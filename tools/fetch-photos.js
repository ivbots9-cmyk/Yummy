#!/usr/bin/env node
/* =========================================================
   Yummyland — pulls every candy photo out of the Shopify CDN
   and into the repo, so the static site has no external
   dependencies at all.

       node tools/fetch-photos.js            download + wire up
       node tools/fetch-photos.js --check    report, change nothing
       node tools/fetch-photos.js --restore  drop local copies, back to CDN

   What it does:
     - downloads each YL.CANDIES[].img to assets/img/candy/<id>.<ext>
     - writes a `photo:` field next to `img:` in assets/js/data.js
     - leaves `img:` alone, so the CDN stays the source of truth and
       the Shopify build keeps using it (see YL.PHOTO_BASE in config.js)

   Safe to re-run: files already on disk are skipped, and a candy whose
   download fails simply keeps falling back to the CDN.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'assets/js/data.js');
const DIR = path.join(ROOT, 'assets/img/candy');
const REL = 'assets/img/candy/';

const mode = process.argv.includes('--restore') ? 'restore'
  : process.argv.includes('--check') ? 'check' : 'fetch';

/* ------------------------------------------------------------------ */
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(DATA, 'utf8'), sandbox);
const CANDIES = sandbox.window.YL.CANDIES;

const ext = (url) => {
  const m = url.split('?')[0].match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : 'jpg';
};
const fileFor = (c) => c.id + '.' + ext(c.img);

/* ------------------------------------------------------------- restore */
if (mode === 'restore') {
  let src = fs.readFileSync(DATA, 'utf8');
  const before = src;
  src = src.replace(/\n *photo: '[^']*',/g, '');
  fs.writeFileSync(DATA, src);
  if (fs.existsSync(DIR)) fs.rmSync(DIR, { recursive: true });
  console.log(before === src ? 'nothing to restore' : 'restored — data.js back on CDN urls, ' + REL + ' removed');
  process.exit(0);
}

/* --------------------------------------------------------------- check */
if (mode === 'check') {
  let have = 0;
  CANDIES.forEach((c) => { if (fs.existsSync(path.join(DIR, fileFor(c)))) have++; });
  const wired = (fs.readFileSync(DATA, 'utf8').match(/\n *photo: '/g) || []).length;
  console.log('candies      ' + CANDIES.length);
  console.log('files on disk ' + have);
  console.log('wired in data.js ' + wired);
  console.log(have === CANDIES.length && wired === CANDIES.length
    ? 'photos are local — the site has no external dependencies'
    : 'photos still come from cdn.shopify.com at runtime');
  process.exit(0);
}

/* --------------------------------------------------------------- fetch */
/* Shopify's CDN resizes on request; 800px covers a retina candy card
   without hauling down the 2000px original. */
const WIDTH = 800;

function download(url, dest, redirects) {
  return new Promise((resolve, reject) => {
    const get = url.indexOf('http://') === 0 ? http.get : https.get;
    get(url, { headers: { 'user-agent': 'yummyland-build' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        if ((redirects || 0) > 4) return reject(new Error('too many redirects'));
        return resolve(download(res.headers.location, dest, (redirects || 0) + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const tmp = dest + '.part';
      const out = fs.createWriteStream(tmp);
      res.pipe(out);
      out.on('finish', () => {
        out.close(() => {
          if (fs.statSync(tmp).size < 1024) {
            fs.unlinkSync(tmp);
            return reject(new Error('suspiciously small'));
          }
          fs.renameSync(tmp, dest);
          resolve();
        });
      });
      out.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const got = [];
  const failed = [];

  for (const c of CANDIES) {
    const file = fileFor(c);
    const dest = path.join(DIR, file);
    if (fs.existsSync(dest)) { got.push(c); continue; }
    const url = c.img + (c.img.indexOf('?') > -1 ? '&' : '?') + 'width=' + WIDTH;
    try {
      await download(url, dest);
      got.push(c);
      process.stdout.write('.');
    } catch (e) {
      failed.push(c.id + ' (' + e.message + ')');
      process.stdout.write('x');
    }
  }
  process.stdout.write('\n');

  /* wire the downloaded ones into data.js, drop the rest back to the CDN */
  let src = fs.readFileSync(DATA, 'utf8');
  src = src.replace(/\n( *)photo: '[^']*',/g, '');
  got.forEach((c) => {
    const needle = new RegExp("(\\n( *)img: '" + c.img.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "',)");
    if (!needle.test(src)) { failed.push(c.id + ' (no img: line in data.js)'); return; }
    src = src.replace(needle, "$1\n$2photo: '" + fileFor(c) + "',");
  });
  fs.writeFileSync(DATA, src);

  const wired = (src.match(/\n *photo: '/g) || []).length;
  console.log('downloaded/present ' + got.length + '/' + CANDIES.length + ', wired ' + wired);
  if (failed.length) {
    console.log('still on the CDN:\n  - ' + failed.join('\n  - '));
  }
  console.log(fs.readdirSync(DIR).length + ' files in ' + REL);
})();
