#!/usr/bin/env node
/* =========================================================
   Yummyland — swaps a candy's photo for one you picked.

       node tools/apply-photo-choices.js

   Reads tools/photo-choices.json — {candyId: "https://cdn.shopify…"} —
   produced by opening tools/photo-picker.html and pressing Export.
   Rewrites the `img:` line of each listed candy in assets/js/data.js.

   Why a file and not a hand edit: the choice is data, it survives the
   next regeneration of data.js, and it is reviewable in a diff.

   After running this, `node tools/fetch-photos.js --restore` then
   `node tools/fetch-photos.js` re-downloads the newly chosen photos.
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'assets/js/data.js');
const CHOICES = path.join(__dirname, 'photo-choices.json');

if (!fs.existsSync(CHOICES)) {
  console.error('No tools/photo-choices.json.\n' +
    'Open tools/photo-picker.html in a browser, click the right photo for each\n' +
    'candy, press "Export choices" and save the result there.');
  process.exit(1);
}

const choices = JSON.parse(fs.readFileSync(CHOICES, 'utf8'));
const ids = Object.keys(choices);
if (!ids.length) {
  console.log('photo-choices.json is empty — nothing to change.');
  process.exit(0);
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(DATA, 'utf8'), sandbox);
const CANDIES = sandbox.window.YL.CANDIES;
const byId = {};
CANDIES.forEach((c) => { byId[c.id] = c; });

let src = fs.readFileSync(DATA, 'utf8');
const done = [], skipped = [];

ids.forEach((id) => {
  const candy = byId[id];
  if (!candy) { skipped.push(id + ' (no such candy)'); return; }
  const next = String(choices[id]).split('?')[0];
  if (!/^https:\/\/cdn\.shopify\.com\//.test(next)) {
    skipped.push(id + ' (not a Shopify CDN url)'); return;
  }
  if (next === candy.img) { skipped.push(id + ' (already that photo)'); return; }

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const line = new RegExp("(\\n( *)img: ')" + esc(candy.img) + "(',)");
  if (!line.test(src)) { skipped.push(id + ' (img line not found in data.js)'); return; }
  src = src.replace(line, "$1" + next.replace(/\$/g, '$$$$') + "$3");
  done.push(id + '  ' + candy.img.split('/').pop() + '  ->  ' + next.split('/').pop());
});

if (done.length) fs.writeFileSync(DATA, src);

console.log('changed ' + done.length + ' of ' + ids.length + ' choices');
done.forEach((d) => console.log('  ' + d));
if (skipped.length) {
  console.log('skipped:');
  skipped.forEach((s) => console.log('  ' + s));
}
if (done.length) {
  console.log('\nNext: node tools/fetch-photos.js --restore && node tools/fetch-photos.js');
}
