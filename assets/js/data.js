/* =========================================================
   Yummyland — catalogue data
   Prices in USD.

   Boxes are sold BY WEIGHT. The unit is one 4 oz scoop, which is what
   the packing team actually measures out, so what the customer builds
   on screen is what goes on the scale. Every candy below is a real
   product from the Yummyland bulk line — `handle` is its Shopify
   handle, `perLb` is its bulk shelf price per pound, and `img` is its
   product photo. Candy "recipe" drives the generated box artwork.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  /* ---------------------------------------------------------------
     THE WEIGHT MODEL
     ---------------------------------------------------------------
     1 scoop = 4 oz (113 g). Box sizes are whole numbers of scoops, so
     the box is always packed to its nominal fill weight — never half
     empty, never overstuffed:

        Small   4 scoops = 1 lb
        Medium  8 scoops = 2 lb
        Large  12 scoops = 3 lb
        Party  20 scoops = 5 lb

     Pricing. `baseLb` below is the blended bulk shelf price per pound
     across the standard range (median $10.99/lb, mean $11.34/lb over the
     48 flavours in this file), so it is a deliberately conservative
     stand-in for cost: the real landed cost per pound is lower than
     what the same candy sells for loose on the shop shelf.

     The single flavours are what pull that mean up: a hand-sorted pound
     of one colour costs more than the assorted sack it came out of, and
     nine of them sit above the base. Every one of those is a deliberate
     choice by the customer inside the flavour picker, priced there, so
     the default path through the builder stays surcharge-free.

        size    fill    price     $/lb    merch @ baseLb    over merch
        small   1 lb    $22.99   22.99         $11.00      $11.99  52%
        medium  2 lb    $36.99   18.50         $22.00      $14.99  41%
        large   3 lb    $52.99   17.66         $33.00      $19.99  38%
        party   5 lb    $79.99   16.00         $55.00      $24.99  31%

     Two things fall out of that table and both are doing real work:
     the price per pound drops as the box grows (the reason to size up,
     shown right on the size cards), and Large clears the $50 free
     shipping threshold while Medium sits just under it.

     Candy that costs materially more than baseLb per pound carries a
     per-scoop surcharge instead of being priced into every box — see
     YL.PRICING.tiers and YL.scoopExtra below. Single-flavour scoops
     are the usual reason: they are hand-sorted, so they cost more.
     --------------------------------------------------------------- */
  YL.PRICING = {
    scoopOz: 4,
    baseLb: 11.00,
    /* per-scoop surcharge by the candy's own bulk price per pound */
    tiers: [
      { upToLb: 11.99, extra: 0.00 },
      { upToLb: 15.99, extra: 1.25 },
      { upToLb: 19.99, extra: 2.25 },
      { upToLb: Infinity, extra: 3.50 }
    ]
  };

  YL.scoopExtra = function (perLb) {
    var t = YL.PRICING.tiers;
    for (var i = 0; i < t.length; i++) if (perLb <= t[i].upToLb) return t[i].extra;
    return t[t.length - 1].extra;
  };

  /* oz -> "1 lb" / "1 lb 8 oz" / "12 oz" */
  YL.weightLabel = function (oz) {
    if (oz < 16) return oz + ' oz';
    var lb = Math.floor(oz / 16), rest = oz % 16;
    return lb + ' lb' + (rest ? ' ' + rest + ' oz' : '');
  };

  YL.SIZES = [
    { id: 'small', name: 'Small Box', serves: 'Serves 1–2', scoops: 4, oz: 16, price: 22.99, scale: 0.72 },
    { id: 'medium', name: 'Medium Box', serves: 'Serves 3–5', scoops: 8, oz: 32, price: 36.99, scale: 0.86, popular: true },
    { id: 'large', name: 'Large Box', serves: 'Serves 6–8', scoops: 12, oz: 48, price: 52.99, scale: 1 },
    { id: 'party', name: 'Party Size', serves: 'Serves 10+', scoops: 20, oz: 80, price: 79.99, scale: 1.14 }
  ];

  /* Five chips, because they have to fit one row on a phone and because
     a filter is only worth a tap if it removes a meaningful chunk of the
     wall. The old eight split the same candies so finely that Nutty and
     World held one tile each. */
  YL.CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'gummies', name: 'Gummies' },
    { id: 'sour', name: 'Sour' },
    { id: 'chewy', name: 'Chews' },
    { id: 'classic', name: 'Classics' }
  ];

  /* A second, independent filter row. These are things we can state as
     plain fact about the pack — not allergen or dietary claims, which
     belong on the manufacturer's label and in the FAQ. */
  YL.TRAITS = [
    { id: 'wrapped', name: 'Individually wrapped', icon: 'wrap' },
    { id: 'single', name: 'Single flavour', icon: 'heart' },
    { id: 'mix', name: 'Assorted mix', icon: 'sparkle' }
  ];

  /* shorthand palettes */
  var P = {
    red: '#ff4757', orange: '#ff9f2e', yellow: '#ffd23f', green: '#4cd964', lime: '#a8e05f',
    blue: '#3fb8ff', purple: '#a76bff', pink: '#ff6fb0', magenta: '#ff2e8b', white: '#fff4f8',
    cocoa: '#7b4a2d', choc: '#4e2c18', milk: '#8d5a35', caramel: '#c98b45', cream: '#ffe9c9'
  };

  /* ---------------------------------------------------------------
     THE FILL RANGE
     ---------------------------------------------------------------
     Every entry here is a candy we can actually scoop out of a bulk
     sack. That is the whole admission rule, and it is why the list is
     shorter than the shop's catalogue: a 10 oz resealable bag or a
     48-count box is a packet, and a packet cannot be portioned into a
     4 oz scoop without opening it first. Those products still sell on
     the shop — they just have no business in the builder.

     The range is deliberately capped at 29. Past roughly thirty tiles
     a customer stops choosing and starts scrolling, and the old list
     spent twelve of its slots on single-flavour Frooties and Jolly
     Ranchers that read as the same tile five times over. One assorted
     scoop of each replaces them; the flavours are still in the bag.

     Order matters. The first four are the top picks and render as the
     opening row, led by the 12 Flavor Gummi Bears — the Albanese line
     is what people come to a bulk candy shop for.

     `perLb` is the bulk shelf price per pound and drives the per-scoop
     surcharge (see YL.PRICING.tiers). Items still in draft on Shopify
     carry the house gummy price of $9.99–$11.99/lb, which is where the
     already-live bulk gummies sit, so no scoop in the gummy core
     charges the customer extra.
     --------------------------------------------------------------- */
  YL.CANDIES = [
    /* ---------- the opening four ---------- */
    {
      id: 'gummy-bears-12', name: '12 Flavor Gummi Bears', flavor: '12 fruit flavours',
      cats: ['gummies'], traits: ['mix'],
      perLb: 9.99, handle: '12-flavors-assorted-gummy-bears-bulk-candy-bag-soft-chewy-fruity-gummies-colorful-party-snack-bulk-candy-for-sharing',
      tag: 'top pick',
      about: 'The bear that built the bulk candy aisle — twelve flavours, soft chew, no two scoops alike. Start here if you are not sure.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/12_Flavor_Bears.webp',
      bg: '#fff4e6',
      recipe: [
        { shape: 'bear', colors: { a: '#ff4757' } }, { shape: 'bear', colors: { a: '#ffd23f' } },
        { shape: 'bear', colors: { a: '#4cd964' } }, { shape: 'bear', colors: { a: '#3fb8ff' } },
        { shape: 'bear', colors: { a: '#ff9f2e' } }, { shape: 'bear', colors: { a: '#a76bff' } }
      ]
    },
    {
      id: 'peach-rings', name: 'Gummi Peach Rings', flavor: 'Sweet peach, sugar coated',
      cats: ['gummies', 'sour'], traits: ['single'],
      perLb: 9.99, handle: 'gummi-peach-rings',
      tag: 'top pick',
      about: 'Soft peach rings in a light sour-sugar coat — our single best-selling scoop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/1_e66c821c-ebb6-4b66-87b8-d49dfab58255_1.jpg',
      bg: '#fff3e8',
      recipe: [
        { shape: 'ring', colors: { a: '#ffb26b' }, sour: true }, { shape: 'ring', colors: { a: '#ff8f6b' }, sour: true },
        { shape: 'ring', colors: { a: '#ffd08a' }, sour: true }
      ]
    },
    {
      id: 'sour-patch-kids', name: 'Sour Patch Kids', flavor: 'Sour then sweet',
      cats: ['gummies', 'sour'], traits: ['mix'],
      perLb: 11.99, handle: 'sour-patch-kids-5lb',
      tag: 'top pick',
      about: 'Sour first, sweet after. The one candy nobody needs explained — and the name people search for by itself.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102415_1.png',
      bg: '#f4fff0',
      recipe: [
        { shape: 'bean', colors: { a: '#ff4757' }, sour: true }, { shape: 'bean', colors: { a: '#ffd23f' }, sour: true },
        { shape: 'bean', colors: { a: '#4cd964' }, sour: true }, { shape: 'bean', colors: { a: '#3fb8ff' }, sour: true }
      ]
    },
    {
      id: 'gummy-sharks', name: 'Blue Raspberry Gummy Sharks', flavor: 'Fruity & fun',
      cats: ['gummies'], traits: ['single'],
      perLb: 9.99, handle: 'blue-gummi-sharks',
      tag: 'top pick',
      about: 'Soft shark-shaped gummies with a white belly and a big blue-raspberry hit. Kids pick these first.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/medium_1024x1024_28f675f8-8df7-4338-b357-e9bcf72ce661.webp',
      bg: '#eef8ff',
      recipe: [
        { shape: 'shark', colors: { a: '#5ec8ff', b: '#ffffff' } },
        { shape: 'shark', colors: { a: '#7fd8ff', b: '#ffe9f3' } }
      ]
    },

    /* ---------- the gummy core ---------- */
    {
      id: 'gummy-worms', name: 'Gummi Worms', flavor: 'Assorted fruit',
      cats: ['gummies'], traits: ['mix'],
      perLb: 9.99, handle: 'large-assorted-fruit-gummi-worms-4',
      about: 'Four inches of two-tone chew. The scoop that photographs best and the one kids dangle before eating.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50102_1.jpg',
      bg: '#fff2f7',
      recipe: [
        { shape: 'worm', colors: { a: '#ff4757', b: '#ffd23f' } },
        { shape: 'worm', colors: { a: '#4cd964', b: '#3fb8ff' } },
        { shape: 'worm', colors: { a: '#a76bff', b: '#ff6fb0' } }
      ]
    },
    {
      id: 'sour-neon-worms', name: 'Sour Neon Gummi Worms', flavor: 'Sour, neon bright',
      cats: ['gummies', 'sour'], traits: ['mix'],
      perLb: 10.99, handle: 'sour-large-neon-gummi-worms-4',
      about: 'The same worm rolled in sour sugar and turned neon. Louder on camera, louder in the mouth.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50104_1.png',
      bg: '#f3fff4',
      recipe: [
        { shape: 'worm', colors: { a: '#a8e05f', b: '#ffd23f' }, sour: true },
        { shape: 'worm', colors: { a: '#3fb8ff', b: '#ff6fb0' }, sour: true },
        { shape: 'worm', colors: { a: '#ff9f2e', b: '#4cd964' }, sour: true }
      ]
    },
    {
      id: 'swedish-fish', name: 'Swedish Fish', flavor: 'Classic red berry',
      cats: ['gummies'], traits: ['single'],
      perLb: 11.99, handle: 'swedish-fish-large-assorted-5lb',
      about: 'Chewier than a gummy, unmistakably red-berry. A box without a fish scoop looks unfinished to most people.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102404_1.jpg',
      bg: '#fff0f0',
      recipe: [
        { shape: 'shark', colors: { a: '#e63946', b: '#ff6b6b' } },
        { shape: 'shark', colors: { a: '#ff4757', b: '#ff8787' } }
      ]
    },
    {
      id: 'sour-gummy-bears', name: 'Sour Gummi Bears', flavor: 'Sour sugar coated',
      cats: ['gummies', 'sour'], traits: ['mix'],
      perLb: 9.99, handle: 'sour-gummi-bears',
      about: 'The twelve-flavour bear with a sour sugar jacket. Half our sour boxes start here.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50117_1.jpg',
      bg: '#f7fff0',
      recipe: [
        { shape: 'bear', colors: { a: '#ff6fb0' }, sour: true }, { shape: 'bear', colors: { a: '#a8e05f' }, sour: true },
        { shape: 'bear', colors: { a: '#ffd23f' }, sour: true }, { shape: 'bear', colors: { a: '#3fb8ff' }, sour: true }
      ]
    },
    {
      id: 'watermelon-slices', name: 'Gummi Watermelon Slices', flavor: 'Watermelon',
      cats: ['gummies'], traits: ['single'],
      perLb: 9.99, handle: 'gummi-watermelon-slices',
      about: 'Sugared watermelon wedges with a green rind and seeds printed right in. One of Albanese’s own top sellers.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50456_1.jpg',
      bg: '#f2fff4',
      recipe: [
        { shape: 'slice', colors: { a: '#ff4d6d', b: '#3fbf6a' }, sour: true },
        { shape: 'slice', colors: { a: '#ff6b83', b: '#4cd964' }, sour: true }
      ]
    },
    {
      id: 'gummy-butterflies', name: 'Mini Gummi Butterflies', flavor: 'Assorted fruit',
      cats: ['gummies'], traits: ['mix'],
      perLb: 9.99, handle: 'mini-gummi-butterflies',
      about: 'Two-tone butterflies, bite size. The prettiest scoop in the range and the one that lifts a gift box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50234_1.png',
      bg: '#fdf3ff',
      recipe: [
        { shape: 'heart', colors: { a: '#ff6fb0' } }, { shape: 'heart', colors: { a: '#a76bff' } },
        { shape: 'heart', colors: { a: '#ffd23f' } }, { shape: 'heart', colors: { a: '#3fb8ff' } }
      ]
    },
    {
      id: 'gummy-frogs', name: 'Gummi Rainforest Frogs', flavor: 'Assorted fruit',
      cats: ['gummies'], traits: ['mix'],
      perLb: 9.99, handle: 'gummi-rainforest-frogs',
      about: 'Big soft frogs with a creamy white belly. Pure novelty, and they disappear fastest at kids’ parties.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/50172_1.png',
      bg: '#f1fff5',
      recipe: [
        { shape: 'bean', colors: { a: '#4cd964' } }, { shape: 'bean', colors: { a: '#a8e05f' } },
        { shape: 'bean', colors: { a: '#3fb8ff' } }, { shape: 'bean', colors: { a: '#ff6fb0' } }
      ]
    },
    {
      id: 'blue-raspberry-rings', name: 'Blue Raspberry Rings', flavor: 'Bold blue raspberry',
      cats: ['gummies', 'sour'], traits: ['single'],
      perLb: 9.99, handle: 'gummi-blue-raspberry-rings',
      about: 'The blue-raspberry answer to the peach ring. Chewy, tangy, and it turns your tongue blue.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/2594844-ezgif.com-webp-to-jpg-converter.jpg',
      bg: '#eef6ff',
      recipe: [
        { shape: 'ring', colors: { a: '#4bb9ff' }, sour: true }, { shape: 'ring', colors: { a: '#7fd0ff' }, sour: true },
        { shape: 'ring', colors: { a: '#2f8fe0' }, sour: true }
      ]
    },
    {
      id: 'gummy-berries', name: 'Mixed Gummi Berries', flavor: 'Assorted berry',
      cats: ['gummies'], traits: ['mix'],
      perLb: 9.99, handle: 'mixed-gummi-berries',
      about: 'Berry-shaped gummies in raspberry, blackberry and strawberry — a soft, chewy crowd-pleaser.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/61nqKx8C8jL.jpg',
      bg: '#fff0f6',
      recipe: [
        { shape: 'bean', colors: { a: '#ff2e8b' } }, { shape: 'bean', colors: { a: '#a76bff' } },
        { shape: 'bean', colors: { a: '#ff4757' } }, { shape: 'bean', colors: { a: '#3fb8ff' } }
      ]
    },
    {
      id: 'haribo-cola', name: 'Haribo Happy Cola', flavor: 'Cola bottles',
      cats: ['gummies'], traits: ['single'],
      perLb: 11.99, handle: 'haribo-gummi-happy-cola-5lb',
      about: 'The original cola bottle. Firmer chew than our house gummies and the flavour everyone recognises instantly.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102323_1_1.png',
      bg: '#fff6ec',
      recipe: [
        { shape: 'bottle', colors: { a: '#b5651d', b: '#ffe9c9' } },
        { shape: 'bottle', colors: { a: '#8d4a12', b: '#ffdfae' } }
      ]
    },
    {
      id: 'haribo-peaches', name: 'Haribo Gummi Peaches', flavor: 'Sugared peach',
      cats: ['gummies'], traits: ['single'],
      perLb: 11.99, handle: 'haribo-gummi-peaches-5lb',
      about: 'Fuzzy sugar outside, two-tone peach inside. A softer, more perfumed peach than our rings.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102314_1_1.png',
      bg: '#fff2ec',
      recipe: [
        { shape: 'ball', colors: { a: '#ffb26b' }, sour: true },
        { shape: 'ball', colors: { a: '#ff9a8b' }, sour: true }
      ]
    },

    /* ---------- sour: belts, straws and rolls ---------- */
    {
      id: 'sour-straws', name: 'Sour Power Rainbow Straws', flavor: 'Sour & chewy',
      cats: ['sour'], traits: ['mix'],
      perLb: 9.20, handle: 'sour-power-quattro-rainbow-candy-straws-2-5-lb-bulk-tub-soft-chewy-sour-rainbow-straws-assorted-fruit-flavored-candy-for-parties-candy-buffets-sharing',
      about: 'Four fruit flavours of soft sour straws in a tangy sugar coat. The most-filmed candy we sell.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/sour-power-straws-tub-2-5lb-Candy-Funhouse-US.webp',
      bg: '#f7fff2',
      recipe: [
        { shape: 'straw', colors: { a: '#ff4d6d' }, sour: true }, { shape: 'straw', colors: { a: '#5ad06b' }, sour: true },
        { shape: 'straw', colors: { a: '#4bb9ff' }, sour: true }, { shape: 'straw', colors: { a: '#ffd23f' }, sour: true }
      ]
    },
    {
      id: 'sour-belts', name: 'Sour Power Rainbow Belts', flavor: 'Sour & tangy',
      cats: ['sour'], traits: ['mix'],
      perLb: 8.80, handle: 'sour-power-quattro-rainbow-candy-belts-2-5-lb-bulk-tub',
      about: 'Wide rainbow belts, sour-sugar dusted. Rip them, stack them, or just eat the whole strip.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/Sour-Power-Quattro-150-Count-42-3-Ounce_c87510f2-7358-4e1f-8411-6c11bdec8e8f.94b1481dcc27bd480602a6620014fe0e.avif',
      bg: '#f2fff5',
      recipe: [
        { shape: 'belt', colors: { a: '#3fb8ff', b: '#ff4757', c: '#ffd23f' }, sour: true },
        { shape: 'belt', colors: { a: '#4cd964', b: '#ffd23f', c: '#ff9f2e' }, sour: true },
        { shape: 'belt', colors: { a: '#ff6fb0', b: '#a76bff', c: '#3fb8ff' }, sour: true }
      ]
    },
    {
      id: 'sour-mini-belts', name: 'Sour Power Mini Belts', flavor: 'Sour, bite size',
      cats: ['sour'], traits: ['mix'],
      perLb: 11.99, handle: 'sour-power®-snax®-mini-belt-quattro-19-8lb',
      about: 'The same Quattro rainbow flavours cut short — easier to portion into a box and to share.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/103502_1_1.png',
      bg: '#f4fff8',
      recipe: [
        { shape: 'belt', colors: { a: '#a8e05f', b: '#ffd23f', c: '#4cd964' }, sour: true },
        { shape: 'belt', colors: { a: '#ff2e8b', b: '#ff6fb0', c: '#ff4757' }, sour: true }
      ]
    },
    {
      id: 'sour-bursts', name: 'Sour Power Bursts', flavor: 'Sour, filled centres',
      cats: ['sour', 'gummies'], traits: ['mix'],
      perLb: 11.99, handle: 'sour-power®-bursts®-6-6lb',
      about: 'Chewy sour bites with a soft filled centre. Four assorted flavours in every scoop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/104129_1.avif',
      bg: '#fdf4ff',
      recipe: [
        { shape: 'ball', colors: { a: '#ff2e8b' }, sour: true }, { shape: 'ball', colors: { a: '#a8e05f' }, sour: true },
        { shape: 'ball', colors: { a: '#3fb8ff' }, sour: true }, { shape: 'ball', colors: { a: '#ff9f2e' }, sour: true }
      ]
    },
    {
      id: 'pickle-belts', name: 'Sour Pickle Belts', flavor: 'Sour dill, seriously',
      cats: ['sour'], traits: ['single'],
      perLb: 11.99, handle: 'sour-power-pickle-candy-belts-bulk-bag-soft-chewy-sour-pickle-flavored-candy-strips-sweet-tangy-novelty-candy-for-parties-candy-buffets-sharing',
      about: 'Yes, pickle. Sour dill candy belts that people buy as a dare and then finish the bag.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/818gZvFsXxL._SL1500.jpg',
      bg: '#f3fbe9',
      recipe: [
        { shape: 'belt', colors: { a: '#7bbf3f', b: '#a8e05f', c: '#5f9c2a' }, sour: true },
        { shape: 'belt', colors: { a: '#8fcf4f', b: '#c2e88a', c: '#6faa33' }, sour: true }
      ]
    },
    {
      id: 'smarties-sour', name: 'Smarties X-Treme Sour', flavor: 'Extremely sour', group: 'smarties',
      cats: ['sour', 'classic'], traits: ['wrapped', 'mix'],
      perLb: 12.99, handle: 'smarties-x-treme-sour-candy-rolls-bulk-bag',
      about: 'Classic Smarties rolls turned up to eleven. Individually wrapped, so they travel well in a box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/91j1mV5653L._SL1500.jpg',
      bg: '#f6f9ff',
      recipe: [
        { shape: 'wrapped', colors: { a: '#e9f7ff', b: '#3fb8ff' } },
        { shape: 'wrapped', colors: { a: '#fff0f6', b: '#ff2e8b' } }
      ]
    },

    /* ---------- chews ---------- */
    {
      id: 'pink-strawberry-chews', name: 'All Pink Strawberry Chews', flavor: 'Strawberry only',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'all-pink-strawberry-chewy-candy-1-lb-approx-90-pieces-bulk-bag-pink-individually-wrapped-candy-perfect-for-parties-events-candy-buffets-pink-party-favors-birthdays-weddings-baby-shower-candy-pack-by-yummyland-16-oz',
      about: 'Nothing but the pink ones — about 90 strawberry chews to the pound. The single most requested pick we stock.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/Starburst-Pink-Strawberry-Chewy-Candy-1-LB-Approx-90-Pieces-Bulk-Bag-Pink-Individually-Wrapped-Candy-Perfect-Parties-Candy-Buffets-Pink-Party-Favors_bd113bcc-2707-4cd6-96b3-f51853448e.webp',
      bg: '#fff0f6',
      recipe: [
        { shape: 'taffy', colors: { a: '#ff5d8f', b: '#ffd9ea' } },
        { shape: 'taffy', colors: { a: '#ff7fa8', b: '#ffe4ef' } }
      ],
      pieces: 22
    },
    {
      id: 'fruit-chews-assorted', name: 'Starburst Assorted', flavor: 'Assorted fruit', group: 'starburst',
      cats: ['chewy'], traits: ['wrapped', 'mix'],
      perLb: 9.99, handle: 'starburst-original-assorted-fruit-chews-candy',
      about: 'The square fruit chews everyone knows — strawberry, cherry, orange and lemon, individually wrapped.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/IMG000_19_1.jpg',
      bg: '#fff5ec',
      recipe: [
        { shape: 'taffy', colors: { a: '#ff4757', b: '#ffd9ea' } }, { shape: 'taffy', colors: { a: '#ff9f2e', b: '#fff0c2' } },
        { shape: 'taffy', colors: { a: '#ffd23f', b: '#fff6cf' } }, { shape: 'taffy', colors: { a: '#ff6fb0', b: '#ffd9ea' } }
      ]
    },
    {
      id: 'frooties-assorted', name: 'Frooties Assorted', flavor: '10 fruit flavours', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'mix'],
      perLb: 10.99, handle: 'tootsie-frooties-assorted-fruit-chewy-candy-10-flavors',
      about: 'Ten Tootsie Frooties flavours in one scoop, each piece individually wrapped. Great value per pound.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/1_fdf35b62-37bc-4a35-974e-7441d1b43784.jpg',
      bg: '#fff6ef',
      recipe: [
        { shape: 'wrapped', colors: { a: '#ffd9ea', b: '#ff5d8f' } }, { shape: 'wrapped', colors: { a: '#d8f5c0', b: '#69c35a' } },
        { shape: 'wrapped', colors: { a: '#fff0c2', b: '#ffb400' } }, { shape: 'wrapped', colors: { a: '#d9ecff', b: '#3fa9f5' } }
      ]
    },
    {
      id: 'sour-fruit-chews', name: 'Sour Fruit Chews', flavor: 'Sour assorted fruit',
      cats: ['chewy', 'sour'], traits: ['wrapped', 'mix'],
      perLb: 10.99, handle: 'tootsie-fruit-chews-sour-tootsie-fruit-chews-sour-candy-2-lb-bag-approx-134-pieces-individually-wrapped-assorted-sour-fruit-flavored-chewy-candy-bulk-candy-for-parties-sharing',
      about: 'Tootsie fruit chews with the sour turned on. Wrapped, so they hold up in a mixed box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/91LjTHcE1KL._SL1500.jpg',
      bg: '#f8fff0',
      recipe: [
        { shape: 'wrapped', colors: { a: '#e8ffd0', b: '#7bbf3f' }, sour: true },
        { shape: 'wrapped', colors: { a: '#ffe9f3', b: '#ff2e8b' }, sour: true },
        { shape: 'wrapped', colors: { a: '#fff0c2', b: '#ffb400' }, sour: true }
      ]
    },
    {
      id: 'hot-tamales', name: 'Hot Tamales', flavor: 'Cinnamon heat',
      cats: ['chewy'], traits: ['mix'],
      perLb: 9.99, handle: 'hot-tamales®-5lb',
      about: 'Chewy cinnamon bites with real heat behind them. The one scoop in the range that is not a fruit flavour.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102475_1_1.png',
      bg: '#fff0ee',
      recipe: [
        { shape: 'bean', colors: { a: '#e63946' } }, { shape: 'bean', colors: { a: '#ff4757' } },
        { shape: 'bean', colors: { a: '#c9262f' } }
      ]
    },

    /* ---------- classics ---------- */
    {
      id: 'jolly-assorted', name: 'Jolly Rancher Assorted', flavor: '5 fruit flavours', group: 'jolly',
      cats: ['classic'], traits: ['wrapped', 'mix'],
      perLb: 7.99, handle: 'jolly-rancher-assorted-hard-candy',
      about: 'Cherry, watermelon, green apple, blue raspberry and grape. The cheapest pound in the shop and it never sits still.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/products/91HWGWO064L._SL1500.jpg',
      bg: '#fff6f2',
      recipe: [
        { shape: 'square', colors: { a: '#ff4757' } }, { shape: 'square', colors: { a: '#4cd964' } },
        { shape: 'square', colors: { a: '#a76bff' } }, { shape: 'square', colors: { a: '#3fb8ff' } },
        { shape: 'square', colors: { a: '#ff9f2e' } }
      ]
    },
    {
      id: 'caramel-cubes', name: 'Vanilla Caramel Cubes', flavor: 'Buttery & soft',
      cats: ['classic', 'chewy'], traits: ['wrapped', 'single'],
      perLb: 8.99, handle: 'caramel-cubes-candy-bulk-bag-individually-wrapped-vanilla-caramel-squares-old-fashioned-candy',
      about: 'Soft vanilla caramels, individually wrapped. The quiet workhorse of a gift box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81zqz8D8qbL.jpg',
      bg: '#fff5e9',
      recipe: [
        { shape: 'cube', colors: { a: '#c98b45' } }, { shape: 'cube', colors: { a: '#b8783a' } },
        { shape: 'cube', colors: { a: '#d9a05f' } }
      ]
    },
    {
      id: 'bit-o-honey', name: 'Bit-O-Honey', flavor: 'Honey almond taffy',
      cats: ['classic', 'chewy'], traits: ['wrapped', 'single'],
      perLb: 9.99, handle: 'bit-o-honey-candy-bulk-bag-individually-wrapped-honey-taffy-candy',
      about: 'Honey-flavoured taffy with real almond bits. Contains almonds — worth knowing before you gift it.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/102599_2.png',
      bg: '#fff9ea',
      recipe: [
        { shape: 'bar', colors: { a: '#f0c785' } }, { shape: 'bar', colors: { a: '#e0aa5c' } },
        { shape: 'taffy', colors: { a: '#ffe9c9', b: '#e0aa5c' } }
      ]
    },

    /* ---------- single flavours, reached through the flavour picker ---------- */
    {
      id: 'cherry-chews', name: 'Cherry Chews', flavor: 'Cherry only', group: 'starburst',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'yummyland-cherry-chewy-candy-1-lb-single-flavor-red-soft-original-fruit-chews-candy-individually-wrapped-bulk-candies-16-oz',
      about: 'Single-flavour red fruit chews. Pairs well with the all-pink strawberry scoop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/8EEF34EC-87E1-41FA-A43E-15443FD88BB6.jpg',
      bg: '#fff0f1',
      recipe: [{ shape: 'taffy', colors: { a: '#e8324a', b: '#ffd2d7' } }, { shape: 'taffy', colors: { a: '#ff4d63', b: '#ffdde1' } }]
    },
    {
      id: 'lemon-chews', name: 'Lemon Chews', flavor: 'Lemon only', group: 'starburst',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'yummyland-lemon-chewy-candy-1-lb-yellow-single-flavor-soft-original-fruit-chews-candy-individually-wrapped-bulk-candies-16-oz',
      about: 'Sharp yellow lemon chews, one flavour all the way through the scoop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/8BE508EC-B505-401A-BE38-053D68B5B4EF.jpg',
      bg: '#fffaea',
      recipe: [{ shape: 'taffy', colors: { a: '#ffd23f', b: '#fff3c4' } }, { shape: 'taffy', colors: { a: '#f7c00f', b: '#ffeeb0' } }]
    },
    {
      id: 'orange-chews', name: 'Orange Chews', flavor: 'Orange only', group: 'starburst',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'orange-chewy-candy-1-lb-single-flavor-soft-original-fruit-chews-candy-individually-wrapped-bulk-candies-16-oz',
      about: 'Single-flavour orange fruit chews — the one people always dig for in a mixed bag.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/913B71CF-14E3-450F-A0E0-98100610187A.jpg',
      bg: '#fff5e9',
      recipe: [{ shape: 'taffy', colors: { a: '#ff9f2e', b: '#ffe3bd' } }, { shape: 'taffy', colors: { a: '#ff8412', b: '#ffdcae' } }]
    },
    {
      id: 'frootie-blue-raspberry', name: 'Frooties Blue Raspberry', flavor: 'Blue raspberry only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-blue-raspberry-fruit-chewy-candy-bulk',
      about: 'Single-flavour blue raspberry Frooties — the colour that makes a box pop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/GUEST_49bb116d-6eeb-4a1a-a295-c45eb538a286.webp',
      bg: '#eef6ff',
      recipe: [{ shape: 'wrapped', colors: { a: '#d9ecff', b: '#3fa9f5' } }, { shape: 'wrapped', colors: { a: '#c2e4ff', b: '#2f8fe0' } }]
    },
    {
      id: 'frootie-green-apple', name: 'Frooties Green Apple', flavor: 'Green apple only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-green-apple-fruit-chewy-candy-bulk',
      about: 'Tart green apple Frooties, one flavour only.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81X3NEOjx-L._SL1200.jpg',
      bg: '#f2fbea',
      recipe: [{ shape: 'wrapped', colors: { a: '#dcf5c4', b: '#69c35a' } }, { shape: 'wrapped', colors: { a: '#c9ee9f', b: '#4fa93f' } }]
    },
    {
      id: 'frootie-watermelon', name: 'Frooties Watermelon', flavor: 'Watermelon only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-watermelon-fruit-chewy-candy-bulk',
      about: 'Summer-flavoured watermelon Frooties. Reliably the first single flavour to empty.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/817JU0l9FwL._SL1200.jpg',
      bg: '#fff0f3',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffd4dc', b: '#ff5d73' } }, { shape: 'wrapped', colors: { a: '#ffe1e6', b: '#f0455f' } }]
    },
    {
      id: 'frootie-mango', name: 'Frooties Mango', flavor: 'Mango only', group: 'frooties',
      cats: ['chewy', 'world'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-mango-fruit-chewy-candy-bulk',
      about: 'Sweet tropical mango Frooties — quietly one of the best flavours in the range.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/71LYHPKKIJL._SL1200.jpg',
      bg: '#fff7e8',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffe3b0', b: '#ff9f2e' } }, { shape: 'wrapped', colors: { a: '#ffd695', b: '#f08300' } }]
    },
    {
      id: 'frootie-pineapple', name: 'Frooties Pineapple', flavor: 'Pineapple only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-pineapple-fruit-chewy-candy-bulk',
      about: 'Bright tropical pineapple Frooties. The yellow that stops a box looking all red and pink.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/TR7855_2_1000x1000_crop_center_acdd332f-411a-45d0-85be-a2cac1b3590f.webp',
      bg: '#fffbe8',
      recipe: [{ shape: 'wrapped', colors: { a: '#fff3bf', b: '#ffcc33' } }]
    },
    {
      id: 'frootie-strawberry', name: 'Frooties Strawberry', flavor: 'Strawberry only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-strawberry-fruit-chewy-candy-bulk',
      about: 'Classic red strawberry Frooties — the safest single flavour to put in a gift box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81MawXIj50L._SL1200.jpg',
      bg: '#fff0f4',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffd9e4', b: '#ff4d6d' } }]
    },
    {
      id: 'frootie-strawberry-lemonade', name: 'Frooties Strawberry Lemonade', flavor: 'Strawberry lemonade', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-strawberry-lemonade-fruit-chewy-candy-bulk',
      about: 'Pink and sharp at the same time. Strawberry lemonade Frooties, single flavour.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81lcj2xSL3L._SL1200.jpg',
      bg: '#fff4f4',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffdfe4', b: '#ff6b7f' } }, { shape: 'wrapped', colors: { a: '#fff0c8', b: '#ffcc33' } }]
    },
    {
      id: 'frootie-grape', name: 'Frooties Grape', flavor: 'Grape only', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-grape-fruit-chewy-candy-bulk',
      about: 'Deep purple grape Frooties. Adds contrast to an otherwise very pink box.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81ROx8s4aFL._SL1200.jpg',
      bg: '#f7f2ff',
      recipe: [{ shape: 'wrapped', colors: { a: '#e4d5ff', b: '#8b5cf6' } }, { shape: 'wrapped', colors: { a: '#d3bcff', b: '#6f3fd6' } }]
    },
    {
      id: 'frootie-fruit-punch', name: 'Frooties Fruit Punch', flavor: 'Fruit punch', group: 'frooties',
      cats: ['chewy'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-fruit-punch-fruit-chewy-candy-bulk',
      about: 'Mixed-berry fruit punch Frooties, individually wrapped.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/91MRqOOi5oL._SL1500.jpg',
      bg: '#fff2f0',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffd6cf', b: '#ff5a3c' } }, { shape: 'wrapped', colors: { a: '#ffc2b8', b: '#e8452c' } }]
    },
    {
      id: 'frootie-sour-cherry', name: 'Frooties Sour Cherry', flavor: 'Sour cherry', group: 'frooties',
      cats: ['chewy', 'sour'], traits: ['wrapped', 'single'],
      perLb: 10.99, handle: 'tootsie-frooties-sour-cherry-fruit-chewy-candy-bulk',
      about: 'Cherry Frooties with a sour edge — the only Frootie that bites back.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/81BPGW7lysS._SL1200.jpg',
      bg: '#fff2f2',
      recipe: [{ shape: 'wrapped', colors: { a: '#ffd6d6', b: '#e63946' }, sour: true }]
    },
    {
      id: 'jolly-cherry', name: 'Jolly Rancher Cherry', flavor: 'Cherry only', group: 'jolly',
      cats: ['hard'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'jolly-rancher-cherry-hard-candy-1',
      about: 'Single-flavour cherry Jolly Ranchers — the red box builder favourite.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/JOLLYRANCHER_3.jpg',
      bg: '#fff0f1',
      recipe: [{ shape: 'square', colors: { a: '#ff2e46' } }, { shape: 'square', colors: { a: '#e01f36' } }]
    },
    {
      id: 'jolly-green-apple', name: 'Jolly Rancher Green Apple', flavor: 'Green apple only', group: 'jolly',
      cats: ['hard'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'jolly-rancher-green-apple-hard-candy-1',
      about: 'Sharp green apple, hand-sorted into a single-flavour scoop.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/A1ztBLaihxL._SL1500.jpg',
      bg: '#f1fbec',
      recipe: [{ shape: 'square', colors: { a: '#4cd964' } }, { shape: 'square', colors: { a: '#3fbf55' } }]
    },
    {
      id: 'jolly-watermelon', name: 'Jolly Rancher Watermelon', flavor: 'Watermelon only', group: 'jolly',
      cats: ['hard'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'jolly-rancher-watermelon-hard-candy-1',
      about: 'Watermelon only. The flavour people fish out of the assorted bag anyway.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/JOLLYRANCHER_5.jpg',
      bg: '#fff1f4',
      recipe: [{ shape: 'square', colors: { a: '#ff5d73' } }, { shape: 'square', colors: { a: '#ff7d8f' } }]
    },
    {
      id: 'jolly-blue-raspberry', name: 'Jolly Rancher Blue Raspberry', flavor: 'Blue raspberry only', group: 'jolly',
      cats: ['hard'], traits: ['wrapped', 'single'],
      perLb: 14.99, handle: 'jolly-rancher-blue-raspberry-hard-candy-1',
      about: 'A whole scoop of nothing but the blue ones. Sorted by hand, so it costs a little more.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/JOLLYRANCHER_2.jpg',
      bg: '#eef6ff',
      recipe: [{ shape: 'square', colors: { a: '#3fb8ff' } }, { shape: 'square', colors: { a: '#5fc4ff' } }]
    },
    {
      id: 'jolly-grape', name: 'Jolly Rancher Grape', flavor: 'Grape only', group: 'jolly',
      cats: ['hard'], traits: ['wrapped', 'single'],
      perLb: 9.99, handle: 'jolly-rancher-grape-hard-candy',
      about: 'A full scoop of grape. Divisive, and its fans are loyal.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/JOLLYRANCHER_4_26d213be-7a4e-45f5-a045-6270ff2e019e.jpg',
      bg: '#f6f1ff',
      recipe: [{ shape: 'square', colors: { a: '#a76bff' } }, { shape: 'square', colors: { a: '#8b5cf6' } }]
    },
    {
      id: 'smarties-tropical', name: 'Smarties Tropical Rolls', flavor: 'Tropical fruit', group: 'smarties',
      cats: ['hard', 'retro'], traits: ['wrapped', 'mix'],
      perLb: 9.99, handle: 'smarties-tropical-candy-rolls-bulk-bag',
      about: 'Tropical-flavoured Smarties rolls. Nostalgic, cheap to add and easy to hand out.',
      img: 'https://cdn.shopify.com/s/files/1/0665/5747/7161/files/91R5Noswj8L._SL1500.jpg',
      bg: '#fff7ee',
      recipe: [{ shape: 'coil', colors: { a: '#ffd23f', b: '#ff9f2e' } }, { shape: 'coil', colors: { a: '#a8e05f', b: '#4cd964' } }]
    }
  ];

  YL.VIBES = [
    { id: 'me', name: 'Just for Me', icon: 'heart' },
    { id: 'gift', name: 'Gift', icon: 'gift' },
    { id: 'birthday', name: 'Birthday', icon: 'cake' },
    { id: 'office', name: 'Office', icon: 'briefcase' },
    { id: 'movie', name: 'Movie Night', icon: 'film' },
    { id: 'party', name: 'Party', icon: 'party' },
    { id: 'holiday', name: 'Holiday', icon: 'tree' },
    { id: 'surprise', name: 'Surprise Me', icon: 'question' }
  ];

  YL.EXTRAS = [
    { id: 'note', name: 'Gift Note', desc: 'Hand-written on a Yummyland card', price: 0, icon: 'note', free: true },
    { id: 'stickers', name: 'Sticker Pack', desc: 'Yummyland sticker sheet', price: 1.99, icon: 'sticker' },
    { id: 'scoop', name: 'Extra 4 oz Scoop', desc: 'One more scoop over the box weight', price: 5.99, icon: 'candy', addsScoop: true },
    { id: 'surprise', name: 'Surprise Candy', desc: 'We tuck in a secret treat', price: 2.99, icon: 'dice' },
    { id: 'wrap', name: 'Premium Gift Wrap', desc: 'Ribbon, tissue and a sleeve', price: 4.99, icon: 'wrap' },
    { id: 'theme', name: 'Color Theme', desc: 'Pick your box color', price: 1.99, icon: 'palette' }
  ];

  YL.BOX_THEMES = [
    { id: 'pink', name: 'Yummy Pink', hex: '#ff2e8b' },
    { id: 'purple', name: 'Grape Pop', hex: '#9b6bff' },
    { id: 'blue', name: 'Blue Raspberry', hex: '#45b8ff' },
    { id: 'mint', name: 'Mint Chill', hex: '#35c9a4' },
    { id: 'gold', name: 'Golden Party', hex: '#ffc933' }
  ];

  /* One-click starting points. Each list is a pool — the auto-builder
     scoops from it until the box hits its fill weight. */
  YL.PRESETS = [
    { id: 'gummy-lover', name: 'Gummy Lover', desc: 'Bears, worms and rings',
      candies: ['gummy-bears-12', 'gummy-worms', 'peach-rings', 'gummy-sharks', 'gummy-berries', 'blue-raspberry-rings', 'gummy-butterflies', 'watermelon-slices'] },
    { id: 'sour-lover', name: 'Sour Lover', desc: 'Straws, belts and the pickle dare',
      candies: ['sour-patch-kids', 'sour-straws', 'sour-belts', 'sour-mini-belts', 'pickle-belts', 'sour-bursts', 'sour-neon-worms', 'smarties-sour'] },
    { id: 'sweet-fruity', name: 'Sweet & Fruity', desc: 'Chews and fruit flavours',
      candies: ['fruit-chews-assorted', 'frooties-assorted', 'pink-strawberry-chews', 'haribo-peaches', 'gummy-berries', 'gummy-bears-12', 'watermelon-slices', 'haribo-cola'] },
    { id: 'retro-run', name: 'Retro Run', desc: 'The old candy-store counter',
      candies: ['caramel-cubes', 'bit-o-honey', 'jolly-assorted', 'smarties-sour', 'hot-tamales', 'fruit-chews-assorted', 'caramel-cubes', 'bit-o-honey'] },
    { id: 'random', name: 'Random Mix', desc: 'Let us surprise you', candies: null }
  ];

  /* Ready-made boxes. Every one is editable in the builder, and every
     one is filled to exactly its size in 4 oz scoops — a repeated id
     is a second scoop of the same candy. */
  YL.PREBUILT = [
    {
      id: 'gummy-box', name: 'Gummy Lovers Box', tag: 'Gummies',
      desc: 'Two pounds of nothing but gummies.',
      goodFor: ['Gummy fans', 'Kids & teens', 'Content & sharing'],
      about: 'Peach rings, blue raspberry rings, sharks, Swedish Fish, berries and the 12-flavour bears. No hard candy, no chews — just the squishy stuff, and it is the box people film.',
      season: null, size: 'medium', color: 'pink',
      candies: ['peach-rings', 'peach-rings', 'blue-raspberry-rings', 'gummy-sharks', 'gummy-sharks', 'gummy-berries', 'gummy-bears-12', 'swedish-fish'],
      extras: ['stickers'], vibe: 'me'
    },
    {
      id: 'sour-challenge', name: 'Sour Challenge Box', tag: 'Sour',
      desc: 'For sour candy lovers and brave hearts.',
      goodFor: ['Sour lovers', 'Dares & challenges', 'Teens'],
      about: 'Two pounds of our most face-scrunching sours. Start on the peach rings, work up to the belts, and see who taps out before the pickle scoop.',
      season: null, size: 'medium', color: 'mint',
      candies: ['sour-straws', 'sour-straws', 'sour-belts', 'pickle-belts', 'pickle-belts', 'sour-bursts', 'smarties-sour', 'jolly-assorted'],
      extras: ['stickers'], vibe: 'me'
    },
    {
      id: 'movie-night', name: 'Movie Night Box', tag: 'Film Night',
      desc: 'Three pounds of chewy, fruity and slow-burning.',
      goodFor: ['Movie nights', 'Sharing', 'Long films'],
      about: 'Built for the couch: hard candy that lasts a whole film, gummies to pick at, and chews to pass around while the credits roll.',
      season: null, size: 'large', color: 'purple',
      candies: ['peach-rings', 'peach-rings', 'gummy-berries', 'gummy-berries', 'frooties-assorted', 'frooties-assorted', 'jolly-assorted', 'jolly-assorted', 'caramel-cubes', 'sour-straws', 'fruit-chews-assorted', 'gummy-sharks'],
      extras: ['scoop'], vibe: 'movie'
    },
    {
      id: 'office-refill', name: 'Office Candy Refill', tag: 'Office Fave',
      desc: 'Five pounds, mostly individually wrapped.',
      goodFor: ['Offices', 'Break rooms', 'Big teams'],
      about: 'Ten crowd-pleasers, two scoops each, weighted towards wrapped pieces so the bowl stays hygienic. Reorder it monthly and the snack station never runs dry.',
      season: null, size: 'party', color: 'blue',
      candies: ['jolly-assorted', 'jolly-assorted', 'frooties-assorted', 'frooties-assorted', 'fruit-chews-assorted', 'fruit-chews-assorted', 'sour-fruit-chews', 'sour-fruit-chews', 'caramel-cubes', 'caramel-cubes', 'bit-o-honey', 'bit-o-honey', 'smarties-sour', 'smarties-sour', 'peach-rings', 'peach-rings', 'gummy-bears-12', 'gummy-bears-12', 'gummy-berries', 'gummy-berries'],
      extras: [], vibe: 'office'
    },
    {
      id: 'birthday', name: 'Birthday Gift Box', tag: 'Perfect Gift',
      desc: 'Two bright pounds with a hand-written note.',
      goodFor: ['Birthdays', 'Kids & teens', 'Surprise gifts'],
      about: 'A fruity, colourful mix with stickers, premium wrap and a card — it arrives looking like a present, not a parcel.',
      size: 'medium', color: 'pink', season: null,
      candies: ['peach-rings', 'peach-rings', 'gummy-sharks', 'sour-straws', 'frooties-assorted', 'gummy-berries', 'fruit-chews-assorted', 'gummy-bears-12'],
      extras: ['note', 'stickers', 'wrap'], vibe: 'birthday'
    },
    {
      id: 'party-box', name: 'Party Box', tag: 'Crowd Pleaser',
      desc: 'Five pounds, ten different candies.',
      goodFor: ['Parties', 'Celebrations', 'Big groups'],
      about: 'Our biggest box: two scoops each of ten candies, so a room full of people all find something they like.',
      season: null, size: 'party', color: 'pink',
      candies: ['peach-rings', 'peach-rings', 'sour-straws', 'sour-straws', 'gummy-berries', 'gummy-berries', 'jolly-assorted', 'jolly-assorted', 'frooties-assorted', 'frooties-assorted', 'fruit-chews-assorted', 'fruit-chews-assorted', 'gummy-sharks', 'gummy-sharks', 'sour-belts', 'sour-belts', 'blue-raspberry-rings', 'blue-raspberry-rings', 'gummy-bears-12', 'gummy-bears-12'],
      extras: ['scoop', 'stickers'], vibe: 'party'
    },
    {
      id: 'thank-you', name: 'Thank You Box', tag: 'Say Thanks',
      desc: 'A sweet thank-you that beats another bunch of flowers.',
      goodFor: ['Thank-yous', 'Clients', 'Neighbours'],
      about: 'A polite, safe two pounds — nothing too sour, nothing too weird — with a hand-written note and premium wrap.',
      size: 'medium', color: 'gold', season: null,
      candies: ['caramel-cubes', 'caramel-cubes', 'fruit-chews-assorted', 'frooties-assorted', 'caramel-cubes', 'peach-rings', 'gummy-berries', 'smarties-sour'],
      extras: ['note', 'wrap'], vibe: 'gift'
    },
    {
      id: 'get-well', name: 'Get Well Soon Box', tag: 'Feel Better',
      desc: 'One gentle pound for someone having a rough week.',
      goodFor: ['Get well', 'Cheering someone up', 'Care packages'],
      about: 'Gummi bears, peach rings, soft caramels and a scoop of wrapped Frooties — nothing sour, nothing sharp, easy to snack on in bed. Comes with a note.',
      size: 'small', color: 'mint', season: null,
      candies: ['gummy-bears-12', 'peach-rings', 'caramel-cubes', 'frooties-assorted'],
      extras: ['note'], vibe: 'gift'
    },
    {
      id: 'congrats', name: 'Congrats Box', tag: 'Well Done',
      desc: 'New job, new home, graduation — three pounds of it.',
      goodFor: ['Graduations', 'Promotions', 'New homes'],
      about: 'A bright celebration mix, heavy on the gummies, with a note and premium wrap so it feels like an occasion.',
      size: 'large', color: 'purple', season: null,
      candies: ['peach-rings', 'peach-rings', 'fruit-chews-assorted', 'fruit-chews-assorted', 'gummy-berries', 'gummy-berries', 'frooties-assorted', 'frooties-assorted', 'sour-straws', 'gummy-sharks', 'caramel-cubes', 'blue-raspberry-rings'],
      extras: ['note', 'wrap', 'stickers'], vibe: 'gift'
    },
    {
      id: 'love-box', name: 'Love You Box', tag: "Valentine's",
      desc: 'Two pounds of pink and red, nothing else.',
      goodFor: ["Valentine's Day", 'Anniversaries', 'Date nights'],
      about: 'Three scoops of the all-pink strawberry chews, plus fruit chews, berries and gummi bears, in a pink box with a hand-written note.',
      size: 'medium', color: 'pink', season: 'valentines',
      candies: ['pink-strawberry-chews', 'pink-strawberry-chews', 'pink-strawberry-chews', 'fruit-chews-assorted', 'gummy-berries', 'gummy-bears-12', 'peach-rings', 'frooties-assorted'],
      extras: ['note', 'wrap'], vibe: 'gift'
    },
    {
      id: 'halloween-box', name: 'Trick or Treat Box', tag: 'Halloween',
      desc: 'Five pounds, almost all individually wrapped.',
      goodFor: ['Halloween', 'Trick-or-treaters', 'Class parties'],
      about: 'Wrapped pieces kids actually recognise — Jolly Ranchers, Frooties, Smarties and fruit chews — in a party-size box, so you are not rationing by 8pm.',
      size: 'party', color: 'purple', season: 'halloween',
      candies: ['jolly-assorted', 'jolly-assorted', 'jolly-assorted', 'frooties-assorted', 'frooties-assorted', 'frooties-assorted', 'smarties-sour', 'smarties-sour', 'fruit-chews-assorted', 'fruit-chews-assorted', 'peach-rings', 'peach-rings', 'gummy-sharks', 'gummy-sharks', 'sour-straws', 'sour-straws', 'gummy-berries', 'gummy-berries', 'caramel-cubes', 'smarties-sour'],
      extras: ['stickers'], vibe: 'party'
    },
    {
      id: 'christmas-box', name: 'Christmas Stocking Box', tag: 'Holidays',
      desc: 'Three pounds of caramel, taffy and retro.',
      goodFor: ['Christmas', 'Stocking fillers', 'Secret Santa'],
      about: 'Soft vanilla caramels, honey almond taffy and a handful of nostalgic wrapped picks — nearly all individually wrapped, so it can sit under the tree for a fortnight.',
      size: 'large', color: 'mint', season: 'christmas',
      candies: ['caramel-cubes', 'caramel-cubes', 'caramel-cubes', 'bit-o-honey', 'bit-o-honey', 'jolly-assorted', 'jolly-assorted', 'frooties-assorted', 'frooties-assorted', 'fruit-chews-assorted', 'smarties-sour', 'gummy-bears-12'],
      extras: ['note', 'wrap'], vibe: 'holiday'
    },
    {
      id: 'easter-box', name: 'Easter Hunt Box', tag: 'Easter',
      desc: 'Three pounds of small, pastel, hideable pieces.',
      goodFor: ['Easter', 'Kids', 'Family gatherings'],
      about: 'Gummi bears, peach rings, berries and sharks — bright, small and easy to hide, which is exactly what you want in the garden.',
      size: 'large', color: 'gold', season: 'easter',
      candies: ['gummy-bears-12', 'gummy-bears-12', 'peach-rings', 'peach-rings', 'gummy-berries', 'gummy-berries', 'gummy-sharks', 'gummy-sharks', 'smarties-sour', 'frooties-assorted', 'jolly-assorted', 'blue-raspberry-rings'],
      extras: ['stickers'], vibe: 'holiday'
    },
    {
      id: 'kids-box', name: 'Kids Favourites Box', tag: 'For Kids',
      desc: 'One pound of the stuff kids actually ask for.',
      goodFor: ['Kids', 'Party bags', 'Rewards'],
      about: 'No liquorice, no strong sours — sharks, rainforest frogs, 12-flavour bears and wrapped Frooties, all fruity and easy to like.',
      size: 'small', color: 'blue', season: null,
      candies: ['gummy-sharks', 'gummy-frogs', 'gummy-bears-12', 'frooties-assorted'],
      extras: ['stickers'], vibe: 'birthday'
    },
    {
      id: 'all-pink-box', name: 'All Pink Box', tag: 'Trending',
      desc: 'Two pounds and not a single piece that is not pink.',
      goodFor: ['Content & sharing', 'Birthdays', 'Bridal & baby showers'],
      about: 'Built around the all-pink strawberry chews people hunt for, plus berries, fruit chews and gummi bears. It photographs better than anything else we pack.',
      size: 'medium', color: 'pink', season: null,
      candies: ['pink-strawberry-chews', 'pink-strawberry-chews', 'fruit-chews-assorted', 'fruit-chews-assorted', 'gummy-berries', 'gummy-bears-12', 'peach-rings', 'frooties-assorted'],
      extras: ['stickers'], vibe: 'me'
    },
    {
      id: 'retro-box', name: 'Retro Candy Store Box', tag: 'Nostalgia',
      desc: 'Two pounds of the old five-and-dime counter.',
      goodFor: ['Gifts for parents', 'Nostalgia', 'Anyone over 40'],
      about: 'Bit-O-Honey, soft vanilla caramels, Smarties, Jolly Ranchers and a scoop of Hot Tamales — candy that has not changed since they last had it.',
      size: 'medium', color: 'gold', season: null,
      candies: ['caramel-cubes', 'caramel-cubes', 'bit-o-honey', 'bit-o-honey', 'smarties-sour', 'jolly-assorted', 'fruit-chews-assorted', 'hot-tamales'],
      extras: ['note'], vibe: 'gift'
    },
    {
      id: 'world-box', name: 'Bears & Worms Box', tag: 'New',
      desc: 'Two pounds of the gummi line we are known for.',
      goodFor: ['Gummy fans', 'Content & sharing', 'Kids & teens'],
      about: 'Bears, worms, butterflies and watermelon slices — half of it sour-sugared. The whole gummi bench in one box, and the one people film when they open it.',
      size: 'medium', color: 'blue', season: null,
      candies: ['gummy-bears-12', 'gummy-bears-12', 'gummy-worms', 'gummy-worms', 'sour-gummy-bears', 'sour-neon-worms', 'gummy-butterflies', 'watermelon-slices'],
      extras: ['stickers'], vibe: 'me'
    }
  ];

  /* Seasonal boxes surface automatically in their window and step aside
     the rest of the year. Months are 1-12 and ranges may wrap the year. */
  YL.SEASONS = {
    valentines: { name: "Valentine's", from: [1, 10], to: [2, 14] },
    easter: { name: 'Easter', from: [3, 1], to: [4, 20] },
    halloween: { name: 'Halloween', from: [9, 20], to: [10, 31] },
    christmas: { name: 'Christmas', from: [11, 5], to: [12, 26] }
  };

  YL.inSeason = function (key, date) {
    var s = YL.SEASONS[key];
    if (!s) return false;
    var d = date || new Date();
    var md = (d.getMonth() + 1) * 100 + d.getDate();
    var from = s.from[0] * 100 + s.from[1];
    var to = s.to[0] * 100 + s.to[1];
    return from <= to ? (md >= from && md <= to) : (md >= from || md <= to);
  };

  /* Boxes for the shop grid: everything, with out-of-season ones last. */
  YL.boxesInOrder = function (date) {
    var live = [], later = [];
    YL.PREBUILT.forEach(function (pb) {
      if (!pb.season || YL.inSeason(pb.season, date)) live.push(pb);
      else later.push(pb);
    });
    return live.concat(later);
  };


  /* ---------------------------------------------------------------
     Social proof video wall.
     Drop a real file in `src` (mp4/webm, self-hosted or a CDN link)
     and the card plays it in place. Leave `src` empty and the card
     still looks right and links out to the post instead — so the
     section is presentable before the first UGC arrives.
     --------------------------------------------------------------- */
  YL.SOCIAL = [
    {
      id: 'unbox-1', handle: '@sweettoothsam', platform: 'tiktok',
      caption: 'Unboxing the Party Box — 15 candies, no repeats',
      views: '412K', color: 'pink', box: 'party-box', src: '', href: ''
    },
    {
      id: 'unbox-2', handle: '@thesourchallenge', platform: 'tiktok',
      caption: 'Sour Challenge Box vs my little brother',
      views: '1.2M', color: 'mint', box: 'sour-challenge', src: '', href: ''
    },
    {
      id: 'unbox-3', handle: '@giftsbymaya', platform: 'instagram',
      caption: 'Sent this birthday box across the country',
      views: '96K', color: 'purple', box: 'birthday', src: '', href: ''
    },
    {
      id: 'unbox-4', handle: '@officesnackclub', platform: 'instagram',
      caption: 'The office refill lasted exactly four days',
      views: '58K', color: 'blue', box: 'office-refill', src: '', href: ''
    },
    {
      id: 'unbox-5', handle: '@candyworldtour', platform: 'tiktok',
      caption: 'Trying the World Tour Box for the first time',
      views: '233K', color: 'gold', box: 'world-box', src: '', href: ''
    },
    {
      id: 'unbox-6', handle: '@movienightmix', platform: 'tiktok',
      caption: 'Movie night box = sweet and salty sorted',
      views: '147K', color: 'purple', box: 'movie-night', src: '', href: ''
    }
  ];

  /* Headline numbers shown next to the CTAs. Update as the real ones grow. */
  YL.PROOF = {
    rating: 4.9,
    reviews: 1284,
    boxesPacked: '38,000+',
    line: 'boxes packed and shipped'
  };


  /* ---------------------------------------------------------------
     Conversion content — all editable here, no markup changes needed
     --------------------------------------------------------------- */
  /* Rotating announcement bar. These four are the lines that reliably move
     the needle: a shipping threshold (lifts basket size), a dispatch cut-off
     (kills hesitation), risk reversal, and a first-order code. Reorder or
     trim freely — the bar cycles through whatever is in this array. */
  YL.ANNOUNCE = [
    { icon: 'truck', text: '<b>Free shipping</b> on orders over $50',
      link: 'boxes.html', linkText: 'Shop boxes' },
    { icon: 'clock', text: 'Order before <b>2pm</b> and it ships today',
      link: 'index.html', linkText: 'Build yours' },
    { icon: 'gift', text: 'Free <b>hand-written note</b> on every gift box',
      link: 'gifts.html', linkText: 'Send a gift' },
    { icon: 'sparkle', text: 'New here? <b>YUMMY5</b> takes $5 off your first box',
      link: 'index.html', linkText: 'Start building' }
  ];

  YL.ANNOUNCE_INTERVAL = 4800;

  YL.TRUST = [
    { icon: 'box', title: 'Sold by weight', text: 'Small 1 lb to party 5 lb' },
    { icon: 'truck', title: 'Free over $50', text: 'Flat $4.99 under that' },
    { icon: 'clock', title: 'Ships same day', text: 'Order before 2pm' },
    { icon: 'shield', title: '100% happiness', text: '30 days to make it right' }
  ];

  /* Delayed email capture. Set enabled:false to switch it off. */
  YL.EMAIL_OFFER = {
    enabled: true,
    delayMs: 18000,
    title: 'Get $5 off your first box',
    text: 'Join the Yummy Crew for sweet deals, new drops and the odd free upgrade.',
    code: 'YUMMY5',
    button: 'Send me the code'
  };

  /* Only the part the customer cannot see for themselves. Picking a box and
     scooping it full is the builder sitting right above this block — writing
     those two steps out again is instructions for something already done. */
  YL.HOW = [
    { icon: 'gift', title: 'We scoop it fresh', text: 'Your box is filled by hand the day it ships, out of the same bulk stock we sell by the pound.' },
    { icon: 'truck', title: 'We weigh it & send it', text: 'On the scale before it is sealed, then out the door same day. 2–5 days across the USA.' },
    { icon: 'shield', title: '100% happiness', text: "Anything not right within 30 days and we replace it or refund you. That's the whole policy." }
  ];

  YL.OCCASIONS = [
    { icon: 'cake', name: 'Birthdays', text: 'Make their day sweeter' },
    { icon: 'briefcase', name: 'Offices & teams', text: 'Snack happy, work happy' },
    { icon: 'party', name: 'Events & parties', text: 'Treat your guests' },
    { icon: 'tree', name: 'Holidays', text: 'Celebrate every season' }
  ];

  YL.REVIEWS = [
    { text: 'The perfect gift! Everything was packed so beautifully and fresh. Will order again!', name: 'Jessica M.' },
    { text: 'Our office loves the candy refill boxes. Fast delivery and the best selection.', name: 'Mark T.' },
    { text: 'The sour challenge box is insane! So good and so much fun to share.', name: 'Emily R.' },
    { text: 'Built a birthday box for my daughter — the preview made it so easy to get it right.', name: 'Daniel K.' }
  ];

  YL.FAQ = [
    { q: 'How does the box builder work?', a: 'Pick a box, then scoop it full. One scoop is 4 oz of candy: Small takes 4 scoops (1 lb), Medium 8 (2 lb), Large 12 (3 lb) and Party Size 20 (5 lb). Add the same candy twice for a double scoop. Add extras, review and check out.' },
    { q: 'How much candy actually comes in a box?', a: 'Exactly what the meter says. Boxes are filled by weight, not by piece count, so a Medium is two full pounds of candy whether you picked eight different things or four doubles. We weigh every box before it is sealed.' },
    { q: 'Why do some candies cost extra per scoop?', a: 'Because they cost us more per pound. It is almost always a single-flavour scoop — all-pink strawberry chews, cherry Jolly Ranchers, grape Jolly Ranchers — which has to be sorted out of assorted stock by hand. The surcharge is printed on the candy before you add it, and most of the range carries none at all.' },
    { q: 'How fresh is the candy?', a: 'Every box is scooped and packed to order the same day it ships, out of the same fast-moving bulk stock we sell by the pound. Nothing sits on a shelf waiting for you.' },
    { q: 'How fast is shipping?', a: 'Orders placed before 2pm ship the same business day. Standard delivery is 2–5 business days across the USA, and shipping is free on orders over $50 — which a Large box clears on its own.' },
    { q: 'Can I add a gift note?', a: 'Yes — the gift note is free. Add up to 200 characters in step 4 and we hand-write it onto a Yummyland card.' },
    { q: 'Do you have allergen information?', a: 'We do not put dietary or allergen claims on the builder, because recipes change and the label on the pack is the only source worth trusting. What we can tell you: boxes are scooped and packed in a facility that handles nuts, milk, soy and wheat, and the only builder scoop with nuts in it is Bit-O-Honey, which contains almonds. Use the preferences box to tell us what to leave out and we will read it before we pack.' },
    { q: 'Do you ship bulk or corporate orders?', a: 'We do. Office refills, event boxes and branded corporate gifting start at 10 boxes — tell us what you need on the Office & Events page.' },
    { q: 'What is your happiness guarantee?', a: "If anything about your box is not right, message us within 30 days and we will replace it or refund you. That's it." }
  ];

  /* ---------------------------------------------------------------
     FLAVOUR GROUPS
     ---------------------------------------------------------------
     Some products are one candy sold in many single flavours. Listing
     each of them on the wall is what made the old catalogue feel like
     a warehouse — five Jolly Rancher tiles that differ only by colour
     read as noise, not as choice.

     So they collapse. A group takes one tile on the wall, shows a
     collage of its flavours, and opens a picker where each flavour has
     its own photo, note and scoop counter. One tile, every flavour, and
     the customer only meets the long list if they ask for it.

     A group is purely a presentation layer: its members stay ordinary
     entries in YL.CANDIES with their own id, handle and price, so the
     box, the cart, the ready-made boxes and the Shopify line items all
     work exactly as they did. `lead` is the member shown on the tile
     and the one a plain click adds.
     --------------------------------------------------------------- */
  YL.GROUPS = [
    {
      id: 'starburst', name: 'Starburst Fruit Chews', lead: 'fruit-chews-assorted',
      flavor: 'Assorted or one flavour', cats: ['chewy'], traits: ['wrapped', 'single', 'mix'],
      about: 'The square fruit chews everyone knows. Take the assorted scoop, or pick a single colour — we sort those by hand.',
      bg: '#fff5ec'
    },
    {
      id: 'frooties', name: 'Tootsie Frooties', lead: 'frooties-assorted',
      flavor: '11 flavours to choose from', cats: ['chewy'], traits: ['wrapped', 'single', 'mix'],
      about: 'Small wrapped chews with the widest flavour range we stock — from mango and pineapple to sour cherry. Mix them or commit to one.',
      bg: '#fff6ef'
    },
    {
      id: 'jolly', name: 'Jolly Rancher Hard Candy', lead: 'jolly-assorted',
      flavor: 'Assorted or one flavour', cats: ['classic'], traits: ['wrapped', 'single', 'mix'],
      about: 'Long-lasting wrapped hard candy. The assorted scoop is the cheapest pound in the shop; single colours are hand-sorted.',
      bg: '#fff6f2'
    },
    {
      id: 'smarties', name: 'Smarties Candy Rolls', lead: 'smarties-sour',
      flavor: 'Sour or tropical', cats: ['sour', 'classic'], traits: ['wrapped', 'mix'],
      about: 'Wrapped rolls of pressed candy tablets, in the face-pulling X-Treme Sour or the milder tropical mix.',
      bg: '#f6f9ff'
    }
  ];

  /* --------- helpers --------- */

  /* Per-scoop surcharge is derived from the candy's real bulk price per
     pound, so adding a product to YL.CANDIES prices itself. Set `extra`
     explicitly on a candy to override. */
  YL.CANDIES.forEach(function (c) {
    if (c.extra == null) c.extra = YL.scoopExtra(c.perLb);
  });

  YL.getGroup = function (id) {
    for (var i = 0; i < YL.GROUPS.length; i++) if (YL.GROUPS[i].id === id) return YL.GROUPS[i];
    return null;
  };

  /* `lead` first, then catalogue order. It is the flavour a customer is
     most likely to want — the assorted scoop, where there is one — so it
     opens the picker and takes the first pane of the collage. */
  YL.groupMembers = function (id) {
    var g = YL.getGroup(id);
    var list = YL.CANDIES.filter(function (c) { return c.group === id; });
    if (!g || !g.lead) return list;
    return list.sort(function (a, b) {
      return (a.id === g.lead ? -1 : 0) - (b.id === g.lead ? -1 : 0);
    });
  };

  /* The wall in tile order: a plain candy stays itself, and the first
     member of a group is replaced by the group so it keeps that slot
     rather than jumping to the end. */
  YL.candyTiles = function () {
    var seen = {}, out = [];
    YL.CANDIES.forEach(function (c) {
      if (!c.group) { out.push({ type: 'candy', id: c.id, candy: c }); return; }
      if (seen[c.group]) return;
      seen[c.group] = 1;
      var g = YL.getGroup(c.group);
      if (!g) { out.push({ type: 'candy', id: c.id, candy: c }); return; }
      out.push({ type: 'group', id: g.id, group: g, members: YL.groupMembers(g.id) });
    });
    return out;
  };

  /* A tile matches a filter if it, or any flavour under it, matches. */
  YL.tileMatches = function (tile, cat, traits) {
    var pool = tile.type === 'group' ? tile.members : [tile.candy];
    return pool.some(function (c) {
      if (cat && cat !== 'all' && c.cats.indexOf(cat) < 0) return false;
      return (traits || []).every(function (t) { return c.traits.indexOf(t) > -1; });
    });
  };

  YL.getCandy = function (id) {
    for (var i = 0; i < YL.CANDIES.length; i++) if (YL.CANDIES[i].id === id) return YL.CANDIES[i];
    return null;
  };
  YL.getSize = function (id) {
    for (var i = 0; i < YL.SIZES.length; i++) if (YL.SIZES[i].id === id) return YL.SIZES[i];
    return YL.SIZES[1];
  };
  YL.getExtra = function (id) {
    for (var i = 0; i < YL.EXTRAS.length; i++) if (YL.EXTRAS[i].id === id) return YL.EXTRAS[i];
    return null;
  };
  YL.getPrebuilt = function (id) {
    for (var i = 0; i < YL.PREBUILT.length; i++) if (YL.PREBUILT[i].id === id) return YL.PREBUILT[i];
    return null;
  };
  YL.money = function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); };

  YL.SHIPPING = { flat: 4.99, freeOver: 50 };
  YL.PROMOS = { SWEET10: { off: 0.10, label: '10% off' }, YUMMY5: { flat: 5, label: '$5 off' } };
})(window.YL);
