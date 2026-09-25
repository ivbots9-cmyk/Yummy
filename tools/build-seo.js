#!/usr/bin/env node
/* =========================================================
   Yummyland — regenerates JSON-LD blocks and sitemap.xml
   from the real catalogue in assets/js/data.js.

   Run after editing data.js or SITE below:
       node tools/build-seo.js
   ========================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = (process.env.SITE_URL || 'https://yummylandcandy.com').replace(/\/$/, '');

/* --- load the catalogue without a browser --- */
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js/store.js'), 'utf8'), sandbox);
const YL = sandbox.window.YL;

const prices = YL.SIZES.map((s) => s.price);
const low = Math.min.apply(null, prices).toFixed(2), high = Math.max.apply(null, prices).toFixed(2);

const org = {
  '@type': 'Organization',
  '@id': SITE + '/#org',
  name: 'Yummyland',
  url: SITE + '/',
  logo: SITE + '/assets/img/apple-touch-icon.png',
  image: SITE + '/assets/img/og.jpg',
  description: 'Premium candy gift boxes: six cups of Albanese gummies and chocolate, with a lid printed for the occasion.',
  email: 'hello@yummylandcandy.com',
  telephone: '+1-833-986-6526',
  address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
  sameAs: [
    'https://instagram.com/yummylandcandy',
    'https://tiktok.com/@yummylandcandy',
    'https://facebook.com/yummylandcandy'
  ]
};

const website = {
  '@type': 'WebSite',
  '@id': SITE + '/#website',
  url: SITE + '/',
  name: 'Yummyland',
  publisher: { '@id': SITE + '/#org' }
};

const builderProduct = {
  '@type': 'Product',
  name: YL.BOX.name,
  description: 'A rigid burgundy gift box with 4, 8 or 12 sealed cups of candy you choose and a lid printed for the occasion — with your own photos if you like.',
  image: [SITE + '/assets/img/hero-box.jpg', SITE + '/' + YL.BOX.photo],
  brand: { '@type': 'Brand', name: 'Yummyland' },
  offers: {
    '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: low, highPrice: high,
    offerCount: YL.SIZES.length, availability: 'https://schema.org/InStock', url: SITE + '/'
  }
};

const collectionList = {
  '@type': 'ItemList',
  name: 'Yummyland gift box collections',
  itemListElement: YL.COLLECTIONS.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: c.name + ' — ' + YL.BOX.name,
      description: c.desc,
      url: SITE + '/index.html?collection=' + c.id,
      image: SITE + '/' + YL.BOX.photo,
      brand: { '@type': 'Brand', name: 'Yummyland' },
      offers: {
        '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: low, highPrice: high, offerCount: YL.SIZES.length,
        availability: 'https://schema.org/InStock', url: SITE + '/index.html?collection=' + c.id
      }
    }
  }))
};

const faqPage = {
  '@type': 'FAQPage',
  mainEntity: YL.FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
};

const PAGES = {
  'index.html': [org, website, builderProduct],
  'boxes.html': [org, collectionList],
  'gifts.html': [org, collectionList],
  'faq.html': [org, faqPage],
  'about.html': [org],
  'cart.html': [org]
};

const START = '<!-- JSONLD:START -->';
const END = '<!-- JSONLD:END -->';

Object.keys(PAGES).forEach((file) => {
  const p = path.join(ROOT, file);
  let html = fs.readFileSync(p, 'utf8');
  const block = START + '\n<script type="application/ld+json">' +
    JSON.stringify({ '@context': 'https://schema.org', '@graph': PAGES[file] }) +
    '</script>\n' + END;

  if (html.includes(START)) {
    html = html.replace(new RegExp(START + '[\\s\\S]*?' + END), block);
  } else {
    html = html.replace('</head>', block + '\n</head>');
  }
  fs.writeFileSync(p, html);
  console.log('json-ld  ->', file);
});

/* --- sitemap --- */
const urls = [
  { loc: '/', priority: '1.0', freq: 'weekly' },
  { loc: '/boxes.html', priority: '0.9', freq: 'weekly' },
  { loc: '/gifts.html', priority: '0.9', freq: 'weekly' },
  { loc: '/about.html', priority: '0.6', freq: 'monthly' },
  { loc: '/faq.html', priority: '0.6', freq: 'monthly' }
].concat(YL.OCCASIONS.map((o) => ({ loc: '/gifts.html?for=' + o.id, priority: '0.7', freq: 'monthly' })))
  .concat(YL.COLLECTIONS.map((c) => ({ loc: '/index.html?collection=' + c.id, priority: '0.7', freq: 'monthly' })));

const today = new Date().toISOString().slice(0, 10);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => '  <url>\n    <loc>' + SITE + u.loc.replace(/&/g, '&amp;') + '</loc>\n' +
    '    <lastmod>' + today + '</lastmod>\n    <changefreq>' + u.freq + '</changefreq>\n' +
    '    <priority>' + u.priority + '</priority>\n  </url>').join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log('sitemap  -> sitemap.xml (' + urls.length + ' urls)');

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  'User-agent: *\nAllow: /\nDisallow: /cart.html\n\nSitemap: ' + SITE + '/sitemap.xml\n');
console.log('robots   -> robots.txt');
console.log('\nSite URL used: ' + SITE + '  (override with SITE_URL=https://your-domain node tools/build-seo.js)');
