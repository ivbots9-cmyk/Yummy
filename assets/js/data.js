/* =========================================================
   Yummyland — catalogue data
   Prices in USD. Candy "recipe" drives the generated artwork.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  YL.SIZES = [
    { id: 'small', name: 'Small Box', serves: 'Serves 1–2', slots: 4, price: 24.99, scale: 0.72 },
    { id: 'medium', name: 'Medium Box', serves: 'Serves 3–5', slots: 7, price: 34.99, scale: 0.86, popular: true },
    { id: 'large', name: 'Large Box', serves: 'Serves 6–8', slots: 10, price: 49.99, scale: 1 },
    { id: 'party', name: 'Party Size', serves: 'Serves 10+', slots: 15, price: 69.99, scale: 1.14 }
  ];

  YL.CATEGORIES = [
    { id: 'all', name: 'All' },
    { id: 'gummies', name: 'Gummies' },
    { id: 'sour', name: 'Sour' },
    { id: 'chocolate', name: 'Chocolate' },
    { id: 'nuts', name: 'Nuts & Chocolate' },
    { id: 'freeze', name: 'Freeze Dried' },
    { id: 'classic', name: 'Classic' },
    { id: 'premium', name: 'Premium' }
  ];

  /* shorthand palettes */
  var P = {
    red: '#ff4757', orange: '#ff9f2e', yellow: '#ffd23f', green: '#4cd964', lime: '#a8e05f',
    blue: '#3fb8ff', purple: '#a76bff', pink: '#ff6fb0', magenta: '#ff2e8b', white: '#fff4f8',
    cocoa: '#7b4a2d', choc: '#4e2c18', milk: '#8d5a35', caramel: '#c98b45', cream: '#ffe9c9'
  };

  YL.CANDIES = [
    {
      id: 'gummy-bears', name: 'Gummy Bears', flavor: 'Fruity & Chewy', cats: ['gummies', 'classic'],
      extra: 0, tag: 'top pick', bg: '#fff2f8',
      recipe: [
        { shape: 'bear', colors: { a: P.red } }, { shape: 'bear', colors: { a: P.green } },
        { shape: 'bear', colors: { a: P.yellow } }, { shape: 'bear', colors: { a: P.orange } },
        { shape: 'bear', colors: { a: P.blue } }
      ]
    },
    {
      id: 'gummy-worms', name: 'Gummy Worms', flavor: 'Fruity & Chewy', cats: ['gummies'],
      extra: 0, bg: '#fff6ec',
      recipe: [
        { shape: 'worm', colors: { a: P.red, b: P.yellow } }, { shape: 'worm', colors: { a: P.green, b: P.blue } },
        { shape: 'worm', colors: { a: P.orange, b: P.lime } }, { shape: 'worm', colors: { a: P.purple, b: P.pink } }
      ]
    },
    {
      id: 'peach-rings', name: 'Peach Rings', flavor: 'Sweet & Peachy', cats: ['gummies', 'sour'],
      extra: 0, tag: 'top pick', bg: '#fff3e8',
      recipe: [
        { shape: 'ring', colors: { a: '#ffb26b' }, sour: true }, { shape: 'ring', colors: { a: '#ff8f6b' }, sour: true },
        { shape: 'ring', colors: { a: '#ffd08a' }, sour: true }
      ]
    },
    {
      id: 'sour-belts', name: 'Sour Belts', flavor: 'Sour & Tangy', cats: ['sour'],
      extra: 0, bg: '#f2fff5',
      recipe: [
        { shape: 'belt', colors: { a: P.blue, b: P.red, c: P.yellow }, sour: true },
        { shape: 'belt', colors: { a: P.green, b: P.yellow, c: P.orange }, sour: true },
        { shape: 'belt', colors: { a: P.pink, b: P.purple, c: P.blue }, sour: true }
      ]
    },
    {
      id: 'watermelon-slices', name: 'Watermelon Slices', flavor: 'Sweet & Juicy', cats: ['gummies'],
      extra: 0, bg: '#fff0f3',
      recipe: [
        { shape: 'slice', colors: { a: '#ff5d73', b: '#3fbf6a' }, sour: true },
        { shape: 'slice', colors: { a: '#ff7d8f', b: '#57cc7d' }, sour: true }
      ]
    },
    {
      id: 'sour-patch-mix', name: 'Sour Patch Style Mix', flavor: 'Sour & Fruity', cats: ['sour', 'classic'],
      extra: 0, tag: 'top pick', bg: '#fbf4ff',
      recipe: [
        { shape: 'cube', colors: { a: P.red }, sour: true }, { shape: 'cube', colors: { a: P.green }, sour: true },
        { shape: 'cube', colors: { a: P.yellow }, sour: true }, { shape: 'cube', colors: { a: P.blue }, sour: true },
        { shape: 'cube', colors: { a: P.purple }, sour: true }
      ]
    },
    {
      id: 'rainbow-bites', name: 'Rainbow Bites', flavor: 'Fruity & Chewy', cats: ['gummies', 'classic'],
      extra: 0, bg: '#f4f8ff',
      recipe: [
        { shape: 'lentil', colors: { a: P.red } }, { shape: 'lentil', colors: { a: P.orange } },
        { shape: 'lentil', colors: { a: P.yellow } }, { shape: 'lentil', colors: { a: P.green } },
        { shape: 'lentil', colors: { a: P.blue } }, { shape: 'lentil', colors: { a: P.purple } }
      ]
    },
    {
      id: 'jelly-beans', name: 'Jelly Beans', flavor: 'Classic & Sweet', cats: ['classic'],
      extra: 0, bg: '#fff8ee',
      recipe: [
        { shape: 'bean', colors: { a: P.red } }, { shape: 'bean', colors: { a: P.yellow } },
        { shape: 'bean', colors: { a: P.purple } }, { shape: 'bean', colors: { a: P.lime } },
        { shape: 'bean', colors: { a: P.pink } }
      ]
    },
    {
      id: 'gummy-sharks', name: 'Gummy Sharks', flavor: 'Fruity & Fun', cats: ['gummies'],
      extra: 0, bg: '#eef8ff',
      recipe: [
        { shape: 'shark', colors: { a: '#5ec8ff', b: '#ffffff' } },
        { shape: 'shark', colors: { a: '#7fd8ff', b: '#ffe9f3' } }
      ]
    },
    {
      id: 'sour-worms', name: 'Sour Worms', flavor: 'Sour & Chewy', cats: ['sour', 'gummies'],
      extra: 0, bg: '#f6fff0',
      recipe: [
        { shape: 'worm', colors: { a: P.lime, b: P.yellow }, sour: true },
        { shape: 'worm', colors: { a: P.pink, b: P.blue }, sour: true },
        { shape: 'worm', colors: { a: P.orange, b: P.red }, sour: true }
      ]
    },
    {
      id: 'cola-bottles', name: 'Fizzy Cola Bottles', flavor: 'Fizzy & Classic', cats: ['classic', 'sour'],
      extra: 0, bg: '#fff6ef',
      recipe: [
        { shape: 'bottle', colors: { a: '#a9663a', b: '#ffe9c9' }, sour: true },
        { shape: 'bottle', colors: { a: '#8f5730', b: '#fff4e0' }, sour: true }
      ]
    },
    {
      id: 'marshmallow-clouds', name: 'Marshmallow Clouds', flavor: 'Soft & Fluffy', cats: ['classic'],
      extra: 0, bg: '#fff4f9',
      recipe: [
        { shape: 'marsh', colors: { a: '#ffd7e8' } }, { shape: 'marsh', colors: { a: '#fff2d0' } },
        { shape: 'marsh', colors: { a: '#d8f3ff' } }
      ]
    },
    {
      id: 'rainbow-taffy', name: 'Rainbow Taffy', flavor: 'Chewy & Creamy', cats: ['classic'],
      extra: 0, bg: '#fdf3ff',
      recipe: [
        { shape: 'taffy', colors: { a: P.pink, b: '#ffd9ea' } },
        { shape: 'taffy', colors: { a: P.blue, b: '#d9f0ff' } },
        { shape: 'taffy', colors: { a: P.yellow, b: '#fff0c2' } }
      ]
    },
    {
      id: 'gummy-hearts', name: 'Gummy Hearts', flavor: 'Sweet & Berry', cats: ['gummies'],
      extra: 0, bg: '#fff1f6',
      recipe: [
        { shape: 'heart', colors: { a: '#ff4d87' } }, { shape: 'heart', colors: { a: '#ff85b3' } },
        { shape: 'heart', colors: { a: '#ffb3cf' } }
      ]
    },
    {
      id: 'caramel-bites', name: 'Caramel Bites', flavor: 'Chewy & Sweet', cats: ['chocolate'],
      extra: 0, bg: '#fff5e9',
      recipe: [
        { shape: 'cube', colors: { a: P.caramel } }, { shape: 'cube', colors: { a: '#b8783a' } },
        { shape: 'ball', colors: { a: '#d9a05f' } }
      ]
    },
    {
      id: 'choc-almonds', name: 'Chocolate Covered Almonds', flavor: 'Crunchy & Chocolatey',
      cats: ['chocolate', 'nuts', 'premium'], extra: 3.00, tag: 'premium', bg: '#f7f0ea',
      recipe: [
        { shape: 'lentil', colors: { a: P.milk } }, { shape: 'lentil', colors: { a: P.choc } },
        { shape: 'bean', colors: { a: P.cocoa } }
      ]
    },
    {
      id: 'choc-pretzels', name: 'Chocolate Pretzels', flavor: 'Sweet & Salty',
      cats: ['chocolate', 'premium'], extra: 2.50, tag: 'premium', bg: '#f6efe8',
      recipe: [
        { shape: 'pretzel', colors: { a: P.milk } }, { shape: 'pretzel', colors: { a: P.choc } }
      ]
    },
    {
      id: 'choc-peanuts', name: 'Chocolate Peanuts', flavor: 'Crunchy & Chocolatey',
      cats: ['chocolate', 'nuts', 'premium'], extra: 2.50, tag: 'premium', bg: '#f5ede6',
      recipe: [
        { shape: 'ball', colors: { a: P.milk } }, { shape: 'ball', colors: { a: P.cocoa } },
        { shape: 'ball', colors: { a: P.choc } }
      ]
    },
    {
      id: 'choc-truffles', name: 'Cocoa Truffles', flavor: 'Rich & Melty',
      cats: ['chocolate', 'premium'], extra: 4.00, tag: 'premium', bg: '#f4ece6',
      recipe: [
        { shape: 'ball', colors: { a: '#5a3620' } }, { shape: 'square', colors: { a: P.choc } },
        { shape: 'square', colors: { a: P.milk } }
      ]
    },
    {
      id: 'freeze-rainbow', name: 'Freeze Dried Rainbows', flavor: 'Light & Crunchy',
      cats: ['freeze', 'premium'], extra: 3.50, tag: 'premium', bg: '#f4fbff',
      recipe: [
        { shape: 'puff', colors: { a: P.red } }, { shape: 'puff', colors: { a: P.yellow } },
        { shape: 'puff', colors: { a: P.green } }, { shape: 'puff', colors: { a: P.purple } }
      ]
    },
    {
      id: 'freeze-taffy', name: 'Freeze Dried Taffy', flavor: 'Crispy & Creamy',
      cats: ['freeze', 'premium'], extra: 3.50, tag: 'premium', bg: '#fff5fb',
      recipe: [
        { shape: 'puff', colors: { a: '#ffc2dd' } }, { shape: 'puff', colors: { a: '#c9e8ff' } },
        { shape: 'puff', colors: { a: '#fff0b8' } }
      ]
    },
    {
      id: 'sour-twists', name: 'Sour Rainbow Twists', flavor: 'Sour & Zesty', cats: ['sour'],
      extra: 0, bg: '#f3fff9',
      recipe: [
        { shape: 'twist', colors: { a: P.green, b: '#fff' }, sour: true },
        { shape: 'twist', colors: { a: P.magenta, b: '#fff' }, sour: true },
        { shape: 'twist', colors: { a: P.blue, b: '#fff' }, sour: true }
      ]
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
    { id: 'note', name: 'Gift Note', desc: 'Add a personal message', price: 0, icon: 'note', free: true },
    { id: 'stickers', name: 'Sticker Pack', desc: 'Yummyland sticker sheet', price: 1.99, icon: 'sticker' },
    { id: 'scoop', name: 'Extra Candy Scoop', desc: 'One more cup of candy', price: 4.99, icon: 'candy' },
    { id: 'surprise', name: 'Surprise Candy', desc: 'We pick a secret treat', price: 2.99, icon: 'dice' },
    { id: 'wrap', name: 'Premium Gift Wrap', desc: 'Special gift packaging', price: 4.99, icon: 'wrap' },
    { id: 'theme', name: 'Color Theme', desc: 'Pick your box color', price: 1.99, icon: 'palette' }
  ];

  YL.BOX_THEMES = [
    { id: 'pink', name: 'Yummy Pink', hex: '#ff2e8b' },
    { id: 'purple', name: 'Grape Pop', hex: '#9b6bff' },
    { id: 'blue', name: 'Blue Raspberry', hex: '#45b8ff' },
    { id: 'mint', name: 'Mint Chill', hex: '#35c9a4' },
    { id: 'gold', name: 'Golden Party', hex: '#ffc933' }
  ];

  /* one-click starting points shown next to the preview */
  YL.PRESETS = [
    { id: 'sour-lover', name: 'Sour Lover', desc: 'Pucker-power picks', candies: ['sour-belts', 'sour-patch-mix', 'peach-rings', 'sour-worms', 'sour-twists', 'cola-bottles'] },
    { id: 'sweet-fruity', name: 'Sweet & Fruity', desc: 'All the fruity classics', candies: ['gummy-bears', 'watermelon-slices', 'rainbow-bites', 'gummy-hearts', 'jelly-beans', 'gummy-worms'] },
    { id: 'chocolate-lover', name: 'Chocolate Lover', desc: 'Rich & chocolatey', candies: ['choc-almonds', 'choc-peanuts', 'choc-pretzels', 'choc-truffles', 'caramel-bites'] },
    { id: 'party-mix', name: 'Party Mix', desc: 'A bit of everything', candies: ['gummy-bears', 'sour-belts', 'rainbow-bites', 'choc-peanuts', 'rainbow-taffy', 'marshmallow-clouds', 'cola-bottles'] },
    { id: 'random', name: 'Random Mix', desc: 'Let us surprise you', candies: null }
  ];

  /* ready-made boxes — every one is editable in the builder */
  YL.PREBUILT = [
    {
      id: 'sour-challenge', name: 'Sour Challenge Box', tag: 'Sour',
      desc: 'For sour candy lovers and brave hearts.',
      goodFor: ['Sour lovers', 'Dares & challenges', 'Teens'],
      about: 'Seven of our most face-scrunching sours in one box. Start with the peach rings, work up to the belts, and see who taps out first.', size: 'medium', color: 'mint',
      candies: ['sour-belts', 'sour-patch-mix', 'sour-worms', 'sour-twists', 'peach-rings', 'cola-bottles', 'watermelon-slices'],
      extras: ['stickers'], vibe: 'me'
    },
    {
      id: 'movie-night', name: 'Movie Night Box', tag: 'Film Night',
      desc: 'The ultimate sweet & salty mix for movie nights.',
      goodFor: ['Movie nights', 'Sharing', 'Sweet & salty fans'],
      about: 'Built for the couch: something salty, something chocolatey and plenty to pass around while the credits roll.', size: 'large', color: 'purple',
      candies: ['choc-peanuts', 'choc-pretzels', 'gummy-bears', 'rainbow-bites', 'caramel-bites', 'marshmallow-clouds', 'cola-bottles', 'jelly-beans', 'rainbow-taffy', 'sour-belts'],
      extras: ['scoop'], vibe: 'movie'
    },
    {
      id: 'chocolate-lovers', name: 'Chocolate Lovers Box', tag: 'Rich',
      desc: 'For chocolate and sweet lovers.',
      goodFor: ['Gifting', 'Chocolate fans', 'Thank-yous'],
      about: 'All the premium chocolate picks in one box — almonds, pretzels, peanuts and cocoa truffles, finished with premium gift wrap.', size: 'medium', color: 'gold',
      candies: ['choc-almonds', 'choc-peanuts', 'choc-pretzels', 'choc-truffles', 'caramel-bites', 'marshmallow-clouds', 'rainbow-taffy'],
      extras: ['wrap'], vibe: 'gift'
    },
    {
      id: 'office-refill', name: 'Office Candy Refill', tag: 'Office Fave',
      desc: 'Keep the office snack station full.',
      goodFor: ['Offices', 'Break rooms', 'Big teams'],
      about: 'Fifteen crowd-pleasers chosen so nobody in the office is left out. Reorder it monthly and the snack station never runs dry.', size: 'party', color: 'blue',
      candies: ['gummy-bears', 'rainbow-bites', 'jelly-beans', 'sour-patch-mix', 'choc-peanuts', 'caramel-bites', 'cola-bottles', 'marshmallow-clouds', 'peach-rings', 'gummy-worms', 'rainbow-taffy', 'sour-belts', 'watermelon-slices', 'gummy-sharks', 'sour-worms'],
      extras: [], vibe: 'office'
    },
    {
      id: 'birthday', name: 'Birthday Gift Box', tag: 'Perfect Gift',
      desc: 'Make their day extra sweet with a custom surprise.',
      goodFor: ['Birthdays', 'Kids & teens', 'Surprise gifts'],
      about: 'A bright, fruity mix with a hand-written note, stickers and premium wrap — it arrives looking like a present, not a parcel.', size: 'medium', color: 'pink',
      candies: ['gummy-bears', 'rainbow-bites', 'gummy-hearts', 'rainbow-taffy', 'marshmallow-clouds', 'freeze-rainbow', 'watermelon-slices'],
      extras: ['note', 'stickers', 'wrap'], vibe: 'birthday'
    },
    {
      id: 'party-box', name: 'Party Box', tag: 'Crowd Pleaser',
      desc: 'Perfect for parties and celebrations.',
      goodFor: ['Parties', 'Celebrations', 'Big groups'],
      about: 'Our biggest box with fifteen different candies, so a room full of people all find something they like.', size: 'party', color: 'pink',
      candies: ['gummy-bears', 'gummy-worms', 'sour-belts', 'rainbow-bites', 'jelly-beans', 'watermelon-slices', 'peach-rings', 'sour-patch-mix', 'cola-bottles', 'gummy-sharks', 'marshmallow-clouds', 'rainbow-taffy', 'caramel-bites', 'sour-twists', 'gummy-hearts'],
      extras: ['scoop', 'stickers'], vibe: 'party'
    }
  ];

  YL.HOW = [
    { icon: 'box', title: '1. You choose', text: 'Pick your size, candy and extras.' },
    { icon: 'gift', title: '2. We pack', text: 'Our team packs it fresh with care.' },
    { icon: 'truck', title: '3. We ship', text: 'Fast, reliable delivery to your door.' },
    { icon: 'heart', title: '4. You enjoy', text: 'Unbox happiness and share the fun!' },
    { icon: 'shield', title: '5. 100% happiness', text: "Not happy? We'll make it right." }
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
    { q: 'How does the box builder work?', a: 'Pick a box size, choose your candies (each size has a set number of slots), add a vibe and extras, then review your box and add it to the cart. The preview on the right updates as you build.' },
    { q: 'How fresh is the candy?', a: 'Every box is packed to order the same day it ships. Nothing sits on a shelf waiting for you.' },
    { q: 'How fast is shipping?', a: 'Orders placed before 2pm ship the same business day. Standard delivery is 2–5 business days across the USA, and shipping is free on orders over $50.' },
    { q: 'Can I add a gift note?', a: 'Yes — the gift note is free. Add up to 200 characters in step 4 and we hand-write it onto a Yummyland card.' },
    { q: 'Do you have allergen information?', a: 'Boxes are packed in a facility that handles nuts, milk, soy and wheat. Use the candy preference note to tell us about allergies and we will do our best to accommodate.' },
    { q: 'Do you ship bulk or corporate orders?', a: 'We do. Office refills, event boxes and branded corporate gifting start at 10 boxes — tell us what you need on the Office & Events page.' },
    { q: 'What is your happiness guarantee?', a: "If anything about your box is not right, message us within 30 days and we will replace it or refund you. That's it." }
  ];

  /* --------- helpers --------- */
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
