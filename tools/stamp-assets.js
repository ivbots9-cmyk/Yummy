#!/usr/bin/env node
/* =========================================================
   Yummyland — stamps ?v=<hash> onto local css/js references.

       node tools/stamp-assets.js          stamp
       node tools/stamp-assets.js --strip  remove the stamps

   Why: the pages load eight separate scripts. A browser holding a
   cached copy of one of them next to a fresh copy of another gets a
   mismatched pair, and the failure is silent and confusing — the
   builder works while half the marketing page renders blank. Hashing
   the URL means a changed file is a different URL, so the set the
   browser holds is always internally consistent.

   The hash is of the file's own contents, so unchanged files keep
   their URL and stay cached. Idempotent: existing stamps are replaced.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const strip = process.argv.includes('--strip');

const PAGES = ['index.html', 'boxes.html', 'gifts.html', 'cart.html',
  'about.html', 'faq.html', '404.html'];

/* src="assets/js/x.js"  or  href="assets/css/x.css", optionally stamped */
const REF = /((?:src|href)=")(assets\/(?:js|css)\/[a-z0-9-]+\.(?:js|css))(?:\?v=[a-f0-9]+)?(")/g;

const hashes = {};
function hashOf(rel) {
  if (hashes[rel] === undefined) {
    const file = path.join(ROOT, rel);
    hashes[rel] = fs.existsSync(file)
      ? crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8)
      : null;
  }
  return hashes[rel];
}

let touched = 0, refs = 0, missing = [];
PAGES.forEach((page) => {
  const file = path.join(ROOT, page);
  if (!fs.existsSync(file)) return;
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(REF, (m, pre, rel, post) => {
    refs++;
    if (strip) return pre + rel + post;
    const h = hashOf(rel);
    if (!h) { missing.push(rel); return pre + rel + post; }
    return pre + rel + '?v=' + h + post;
  });
  if (after !== before) { fs.writeFileSync(file, after); touched++; }
});

console.log((strip ? 'stripped' : 'stamped') + ' ' + refs + ' references across ' +
  touched + ' page(s) changed of ' + PAGES.length);
if (missing.length) {
  console.log('WARNING: referenced but not on disk: ' + [...new Set(missing)].join(', '));
  process.exit(1);
}
