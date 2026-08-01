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
    { id: 'hard', name: 'Lollipops & Hard' },
    { id: 'retro', name: 'Retro' },
    { id: 'world', name: 'From Around the World' },
    { id: 'classic', name: 'Classic' },
    { id: 'premium', name: 'Premium' }
  ];

  /* Dietary filters — a second, independent filter row in the builder.
     Keeping them separate from categories means "vegan sour candy" is
     one tap away instead of a category explosion. */
  YL.DIETS = [
    { id: 'vegan', name: 'Vegan', icon: 'leaf' },
    { id: 'gf', name: 'Gluten free', icon: 'check' },
    { id: 'nutfree', name: 'Nut free', icon: 'shield' },
    { id: 'sugarfree', name: 'No added sugar', icon: 'heart' }
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
      diet: ['gf','nutfree'], extra: 0, tag: 'top pick', bg: '#fff2f8',
      recipe: [
        { shape: 'bear', colors: { a: P.red } }, { shape: 'bear', colors: { a: P.green } },
        { shape: 'bear', colors: { a: P.yellow } }, { shape: 'bear', colors: { a: P.orange } },
        { shape: 'bear', colors: { a: P.blue } }
      ]
    },
    {
      id: 'gummy-worms', name: 'Gummy Worms', flavor: 'Fruity & Chewy', cats: ['gummies'],
      diet: ['gf','nutfree'], extra: 0, bg: '#fff6ec',
      recipe: [
        { shape: 'worm', colors: { a: P.red, b: P.yellow } }, { shape: 'worm', colors: { a: P.green, b: P.blue } },
        { shape: 'worm', colors: { a: P.orange, b: P.lime } }, { shape: 'worm', colors: { a: P.purple, b: P.pink } }
      ]
    },
    {
      id: 'peach-rings', name: 'Peach Rings', flavor: 'Sweet & Peachy', cats: ['gummies', 'sour'],
      diet: ['gf','nutfree'], extra: 0, tag: 'top pick', bg: '#fff3e8',
      recipe: [
        { shape: 'ring', colors: { a: '#ffb26b' }, sour: true }, { shape: 'ring', colors: { a: '#ff8f6b' }, sour: true },
        { shape: 'ring', colors: { a: '#ffd08a' }, sour: true }
      ]
    },
    {
      id: 'sour-belts', name: 'Sour Belts', flavor: 'Sour & Tangy', cats: ['sour'],
      diet: ['nutfree'], extra: 0, bg: '#f2fff5',
      recipe: [
        { shape: 'belt', colors: { a: P.blue, b: P.red, c: P.yellow }, sour: true },
        { shape: 'belt', colors: { a: P.green, b: P.yellow, c: P.orange }, sour: true },
        { shape: 'belt', colors: { a: P.pink, b: P.purple, c: P.blue }, sour: true }
      ]
    },
    {
      id: 'watermelon-slices', name: 'Watermelon Slices', flavor: 'Sweet & Juicy', cats: ['gummies'],
      diet: ['gf','nutfree'], extra: 0, bg: '#fff0f3',
      recipe: [
        { shape: 'slice', colors: { a: '#ff5d73', b: '#3fbf6a' }, sour: true },
        { shape: 'slice', colors: { a: '#ff7d8f', b: '#57cc7d' }, sour: true }
      ]
    },
    {
      id: 'sour-patch-mix', name: 'Sour Patch Style Mix', flavor: 'Sour & Fruity', cats: ['sour', 'classic'],
      diet: ['gf','nutfree'], extra: 0, tag: 'top pick', bg: '#fbf4ff',
      recipe: [
        { shape: 'cube', colors: { a: P.red }, sour: true }, { shape: 'cube', colors: { a: P.green }, sour: true },
        { shape: 'cube', colors: { a: P.yellow }, sour: true }, { shape: 'cube', colors: { a: P.blue }, sour: true },
        { shape: 'cube', colors: { a: P.purple }, sour: true }
      ]
    },
    {
      id: 'rainbow-bites', name: 'Rainbow Bites', flavor: 'Fruity & Chewy', cats: ['gummies', 'classic'],
      diet: ['gf','nutfree'], extra: 0, bg: '#f4f8ff',
      recipe: [
        { shape: 'lentil', colors: { a: P.red } }, { shape: 'lentil', colors: { a: P.orange } },
        { shape: 'lentil', colors: { a: P.yellow } }, { shape: 'lentil', colors: { a: P.green } },
        { shape: 'lentil', colors: { a: P.blue } }, { shape: 'lentil', colors: { a: P.purple } }
      ]
    },
    {
      id: 'jelly-beans', name: 'Jelly Beans', flavor: 'Classic & Sweet', cats: ['classic'],
      diet: ['vegan','gf','nutfree'], extra: 0, bg: '#fff8ee',
      recipe: [
        { shape: 'bean', colors: { a: P.red } }, { shape: 'bean', colors: { a: P.yellow } },
        { shape: 'bean', colors: { a: P.purple } }, { shape: 'bean', colors: { a: P.lime } },
        { shape: 'bean', colors: { a: P.pink } }
      ]
    },
    {
      id: 'gummy-sharks', name: 'Gummy Sharks', flavor: 'Fruity & Fun', cats: ['gummies'],
      diet: ['gf','nutfree'], extra: 0, bg: '#eef8ff',
      recipe: [
        { shape: 'shark', colors: { a: '#5ec8ff', b: '#ffffff' } },
        { shape: 'shark', colors: { a: '#7fd8ff', b: '#ffe9f3' } }
      ]
    },
    {
      id: 'sour-worms', name: 'Sour Worms', flavor: 'Sour & Chewy', cats: ['sour', 'gummies'],
      diet: ['gf','nutfree'], extra: 0, bg: '#f6fff0',
      recipe: [
        { shape: 'worm', colors: { a: P.lime, b: P.yellow }, sour: true },
        { shape: 'worm', colors: { a: P.pink, b: P.blue }, sour: true },
        { shape: 'worm', colors: { a: P.orange, b: P.red }, sour: true }
      ]
    },
    {
      id: 'cola-bottles', name: 'Fizzy Cola Bottles', flavor: 'Fizzy & Classic', cats: ['classic', 'sour'],
      diet: ['gf','nutfree'], extra: 0, bg: '#fff6ef',
      recipe: [
        { shape: 'bottle', colors: { a: '#a9663a', b: '#ffe9c9' }, sour: true },
        { shape: 'bottle', colors: { a: '#8f5730', b: '#fff4e0' }, sour: true }
      ]
    },
    {
      id: 'marshmallow-clouds', name: 'Marshmallow Clouds', flavor: 'Soft & Fluffy', cats: ['classic'],
      diet: ['gf','nutfree'], extra: 0, bg: '#fff4f9',
      recipe: [
        { shape: 'marsh', colors: { a: '#ffd7e8' } }, { shape: 'marsh', colors: { a: '#fff2d0' } },
        { shape: 'marsh', colors: { a: '#d8f3ff' } }
      ]
    },
    {
      id: 'rainbow-taffy', name: 'Rainbow Taffy', flavor: 'Chewy & Creamy', cats: ['classic'],
      diet: ['nutfree'], extra: 0, bg: '#fdf3ff',
      recipe: [
        { shape: 'taffy', colors: { a: P.pink, b: '#ffd9ea' } },
        { shape: 'taffy', colors: { a: P.blue, b: '#d9f0ff' } },
        { shape: 'taffy', colors: { a: P.yellow, b: '#fff0c2' } }
      ]
    },
    {
      id: 'gummy-hearts', name: 'Gummy Hearts', flavor: 'Sweet & Berry', cats: ['gummies'],
      diet: ['gf','nutfree'], extra: 0, bg: '#fff1f6',
      recipe: [
        { shape: 'heart', colors: { a: '#ff4d87' } }, { shape: 'heart', colors: { a: '#ff85b3' } },
        { shape: 'heart', colors: { a: '#ffb3cf' } }
      ]
    },
    {
      id: 'caramel-bites', name: 'Caramel Bites', flavor: 'Chewy & Sweet', cats: ['chocolate'],
      diet: ['gf'], extra: 0, bg: '#fff5e9',
      recipe: [
        { shape: 'cube', colors: { a: P.caramel } }, { shape: 'cube', colors: { a: '#b8783a' } },
        { shape: 'ball', colors: { a: '#d9a05f' } }
      ]
    },
    {
      id: 'choc-almonds', name: 'Chocolate Covered Almonds', flavor: 'Crunchy & Chocolatey',
      cats: ['chocolate', 'nuts', 'premium'], diet: ['gf'], extra: 3.00, tag: 'premium', bg: '#f7f0ea',
      recipe: [
        { shape: 'lentil', colors: { a: P.milk } }, { shape: 'lentil', colors: { a: P.choc } },
        { shape: 'bean', colors: { a: P.cocoa } }
      ]
    },
    {
      id: 'choc-pretzels', name: 'Chocolate Pretzels', flavor: 'Sweet & Salty',
      cats: ['chocolate', 'premium'], diet: [], extra: 2.50, tag: 'premium', bg: '#f6efe8',
      recipe: [
        { shape: 'pretzel', colors: { a: P.milk } }, { shape: 'pretzel', colors: { a: P.choc } }
      ]
    },
    {
      id: 'choc-peanuts', name: 'Chocolate Peanuts', flavor: 'Crunchy & Chocolatey',
      cats: ['chocolate', 'nuts', 'premium'], diet: ['gf'], extra: 2.50, tag: 'premium', bg: '#f5ede6',
      recipe: [
        { shape: 'ball', colors: { a: P.milk } }, { shape: 'ball', colors: { a: P.cocoa } },
        { shape: 'ball', colors: { a: P.choc } }
      ]
    },
    {
      id: 'choc-truffles', name: 'Cocoa Truffles', flavor: 'Rich & Melty',
      cats: ['chocolate', 'premium'], diet: ['gf'], extra: 4.00, tag: 'premium', bg: '#f4ece6',
      recipe: [
        { shape: 'ball', colors: { a: '#5a3620' } }, { shape: 'square', colors: { a: P.choc } },
        { shape: 'square', colors: { a: P.milk } }
      ]
    },
    {
      id: 'freeze-rainbow', name: 'Freeze Dried Rainbows', flavor: 'Light & Crunchy',
      cats: ['freeze', 'premium'], diet: ['vegan','gf','nutfree'], extra: 3.50, tag: 'premium', bg: '#f4fbff',
      recipe: [
        { shape: 'puff', colors: { a: P.red } }, { shape: 'puff', colors: { a: P.yellow } },
        { shape: 'puff', colors: { a: P.green } }, { shape: 'puff', colors: { a: P.purple } }
      ]
    },
    {
      id: 'freeze-taffy', name: 'Freeze Dried Taffy', flavor: 'Crispy & Creamy',
      cats: ['freeze', 'premium'], diet: ['nutfree'], extra: 3.50, tag: 'premium', bg: '#fff5fb',
      recipe: [
        { shape: 'puff', colors: { a: '#ffc2dd' } }, { shape: 'puff', colors: { a: '#c9e8ff' } },
        { shape: 'puff', colors: { a: '#fff0b8' } }
      ]
    },
    {
      id: 'sour-twists', name: 'Sour Rainbow Twists', flavor: 'Sour & Zesty', cats: ['sour'],
      diet: ['vegan','gf','nutfree'], extra: 0, bg: '#f3fff9',
      recipe: [
        { shape: 'twist', colors: { a: P.green, b: '#fff' }, sour: true },
        { shape: 'twist', colors: { a: P.magenta, b: '#fff' }, sour: true },
        { shape: 'twist', colors: { a: P.blue, b: '#fff' }, sour: true }
      ]
    },
    {
      id: 'rainbow-lollipops', name: 'Rainbow Lollipops', flavor: 'Fruity & Classic',
      cats: ['hard', 'retro'], diet: ['vegan', 'gf', 'nutfree'], extra: 0, bg: '#fff2fa',
      recipe: [
        { shape: 'swirl', colors: { a: P.pink, b: '#fff' } }, { shape: 'swirl', colors: { a: P.blue, b: '#fff' } },
        { shape: 'swirl', colors: { a: P.lime, b: '#fff' } }, { shape: 'swirl', colors: { a: P.yellow, b: '#fff' } }
      ]
    },
    {
      id: 'sour-straws', name: 'Sour Straws', flavor: 'Sour & Chewy', cats: ['sour'],
      diet: ['nutfree'], extra: 0, bg: '#f7fff2',
      recipe: [
        { shape: 'straw', colors: { a: '#ff4d6d' }, sour: true }, { shape: 'straw', colors: { a: '#5ad06b' }, sour: true },
        { shape: 'straw', colors: { a: '#4bb9ff' }, sour: true }, { shape: 'straw', colors: { a: '#ffd23f' }, sour: true }
      ]
    },
    {
      id: 'choc-bar-bites', name: 'Milk Chocolate Bar Bites', flavor: 'Smooth & Milky',
      cats: ['chocolate'], diet: ['gf'], extra: 0, bg: '#f6efe7',
      recipe: [
        { shape: 'bar', colors: { a: P.milk } }, { shape: 'bar', colors: { a: '#6f4426' } },
        { shape: 'square', colors: { a: P.choc } }
      ]
    },
    {
      id: 'cookies-cream', name: 'Cookies & Cream Bites', flavor: 'Creamy & Crunchy',
      cats: ['chocolate', 'premium'], diet: [], extra: 3.00, tag: 'premium', bg: '#f4f1ee',
      recipe: [
        { shape: 'square', colors: { a: '#f3ece4' } }, { shape: 'square', colors: { a: '#2f2b2a' } },
        { shape: 'lentil', colors: { a: '#e9e0d6' } }
      ]
    },
    {
      id: 'pb-cups', name: 'Peanut Butter Cups', flavor: 'Rich & Nutty',
      cats: ['chocolate', 'nuts', 'premium'], diet: ['gf'], extra: 3.50, tag: 'premium', bg: '#f8f0e4',
      recipe: [
        { shape: 'cup', colors: { a: P.choc, b: '#e0a758' } }, { shape: 'cup', colors: { a: P.milk, b: '#f0c078' } }
      ]
    },
    {
      id: 'freeze-crunch', name: 'Freeze Dried Crunch Bites', flavor: 'Airy & Crispy',
      cats: ['freeze', 'premium'], diet: ['vegan', 'gf', 'nutfree'], extra: 3.50, tag: 'premium', bg: '#f2fbff',
      recipe: [
        { shape: 'puff', colors: { a: '#8fd8ff' } }, { shape: 'puff', colors: { a: '#ffb8d8' } },
        { shape: 'puff', colors: { a: '#c9f0a8' } }
      ]
    },
    {
      id: 'candy-buttons', name: 'Candy Buttons', flavor: 'Sweet & Nostalgic',
      cats: ['retro', 'classic'], diet: ['vegan', 'gf', 'nutfree'], extra: 0, bg: '#fff8fb',
      recipe: [
        { shape: 'lentil', colors: { a: '#ff9ec4' } }, { shape: 'lentil', colors: { a: '#a8dcff' } },
        { shape: 'lentil', colors: { a: '#fff08a' } }, { shape: 'lentil', colors: { a: '#c9f0a8' } }
      ]
    },
    {
      id: 'rock-candy', name: 'Rock Candy Crystals', flavor: 'Pure & Crunchy',
      cats: ['hard', 'retro'], diet: ['vegan', 'gf', 'nutfree'], extra: 0, bg: '#f6f9ff',
      recipe: [
        { shape: 'crystal', colors: { a: '#d9c2ff' } }, { shape: 'crystal', colors: { a: '#bfe6ff' } },
        { shape: 'crystal', colors: { a: '#ffd6e8' } }
      ]
    },
    {
      id: 'bubblegum-balls', name: 'Bubblegum Balls', flavor: 'Chewy & Bubbly',
      cats: ['retro', 'hard'], diet: ['nutfree'], extra: 0, bg: '#fff1f7',
      recipe: [
        { shape: 'ball', colors: { a: '#ff6fb0' } }, { shape: 'ball', colors: { a: '#5ec8ff' } },
        { shape: 'ball', colors: { a: '#ffd23f' } }, { shape: 'ball', colors: { a: '#8be08b' } }
      ]
    },
    {
      id: 'mint-humbugs', name: 'Mint Humbugs', flavor: 'Cool & Minty',
      cats: ['hard', 'classic'], diet: ['gf', 'nutfree'], extra: 0, bg: '#f1fbf7',
      recipe: [
        { shape: 'wrapped', colors: { a: '#eaf7f1', b: '#35c9a4' } },
        { shape: 'wrapped', colors: { a: '#d6f2e7', b: '#2aa98a' } }
      ]
    },
    {
      id: 'licorice-wheels', name: 'Licorice Wheels', flavor: 'Bold & Chewy',
      cats: ['retro', 'classic'], diet: ['nutfree'], extra: 0, bg: '#f4f2f7',
      recipe: [
        { shape: 'coil', colors: { a: '#2f2733', b: '#ff6fb0' } },
        { shape: 'coil', colors: { a: '#5a3b6b', b: '#ffd23f' } }
      ]
    },
    {
      id: 'japan-fruit-chews', name: 'Japanese Fruit Chews', flavor: 'Soft & Fruity',
      cats: ['world'], diet: ['nutfree'], extra: 0, tag: 'new', bg: '#fff6f9',
      recipe: [
        { shape: 'wrapped', colors: { a: '#ffb3c9', b: '#ff5d8f' } },
        { shape: 'wrapped', colors: { a: '#b7e3ff', b: '#3fa9f5' } },
        { shape: 'wrapped', colors: { a: '#d8f5c0', b: '#69c35a' } }
      ]
    },
    {
      id: 'chili-mango', name: 'Chili Mango Strips', flavor: 'Sweet, Sour & Spicy',
      cats: ['world', 'sour'], diet: ['vegan', 'gf', 'nutfree'], extra: 0, tag: 'new', bg: '#fff5e8',
      recipe: [
        { shape: 'straw', colors: { a: '#ff8a3d' }, sour: true },
        { shape: 'straw', colors: { a: '#e8452c' }, sour: true },
        { shape: 'straw', colors: { a: '#ffbe3d' }, sour: true }
      ]
    },
    {
      id: 'turkish-delight', name: 'Turkish Delight Cubes', flavor: 'Floral & Soft',
      cats: ['world', 'premium'], diet: ['gf'], extra: 3.00, tag: 'premium', bg: '#fdf4f8',
      recipe: [
        { shape: 'cube', colors: { a: '#f3c7dd' } }, { shape: 'cube', colors: { a: '#e6d5f5' } },
        { shape: 'cube', colors: { a: '#ffe6c2' } }
      ]
    },
    {
      id: 'vegan-fruit-gums', name: 'Vegan Fruit Gums', flavor: 'Fruity & Plant-based',
      cats: ['gummies'], diet: ['vegan', 'gf', 'nutfree'], extra: 0, tag: 'vegan', bg: '#f4fff4',
      recipe: [
        { shape: 'bean', colors: { a: '#68d391' } }, { shape: 'bean', colors: { a: '#f6ad55' } },
        { shape: 'bean', colors: { a: '#fc8181' } }, { shape: 'bean', colors: { a: '#b794f4' } }
      ]
    },
    {
      id: 'sugarfree-bears', name: 'Sugar Free Gummy Bears', flavor: 'Fruity, No Added Sugar',
      cats: ['gummies'], diet: ['sugarfree', 'gf', 'nutfree'], extra: 0, bg: '#f3f9ff',
      recipe: [
        { shape: 'bear', colors: { a: '#9ad5f0' } }, { shape: 'bear', colors: { a: '#f0b3c8' } },
        { shape: 'bear', colors: { a: '#c8e6a0' } }
      ]
    },
    {
      id: 'caramel-popcorn', name: 'Caramel Popcorn Clusters', flavor: 'Buttery & Crunchy',
      cats: ['classic'], diet: ['gf'], extra: 0, bg: '#fff8ea',
      recipe: [
        { shape: 'puff', colors: { a: '#f0c785' } }, { shape: 'puff', colors: { a: '#e0aa5c' } },
        { shape: 'ball', colors: { a: '#c98b45' } }
      ]
    },
    {
      id: 'yogurt-raisins', name: 'Yogurt Covered Raisins', flavor: 'Creamy & Tangy',
      cats: ['chocolate', 'classic'], diet: ['gf', 'nutfree'], extra: 0, bg: '#fbf8f4',
      recipe: [
        { shape: 'lentil', colors: { a: '#fdfaf5' } }, { shape: 'lentil', colors: { a: '#f2e9dc' } },
        { shape: 'bean', colors: { a: '#efe4d2' } }
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
      about: 'Seven of our most face-scrunching sours in one box. Start with the peach rings, work up to the belts, and see who taps out first.', season: null, season: null, size: 'medium', color: 'mint',
      candies: ['sour-belts', 'sour-patch-mix', 'sour-worms', 'sour-twists', 'peach-rings', 'cola-bottles', 'watermelon-slices'],
      extras: ['stickers'], vibe: 'me'
    },
    {
      id: 'movie-night', name: 'Movie Night Box', tag: 'Film Night',
      desc: 'The ultimate sweet & salty mix for movie nights.',
      goodFor: ['Movie nights', 'Sharing', 'Sweet & salty fans'],
      about: 'Built for the couch: something salty, something chocolatey and plenty to pass around while the credits roll.', season: null, size: 'large', color: 'purple',
      candies: ['choc-peanuts', 'choc-pretzels', 'gummy-bears', 'rainbow-bites', 'caramel-bites', 'marshmallow-clouds', 'cola-bottles', 'jelly-beans', 'rainbow-taffy', 'sour-belts'],
      extras: ['scoop'], vibe: 'movie'
    },
    {
      id: 'chocolate-lovers', name: 'Chocolate Lovers Box', tag: 'Rich',
      desc: 'For chocolate and sweet lovers.',
      goodFor: ['Gifting', 'Chocolate fans', 'Thank-yous'],
      about: 'All the premium chocolate picks in one box — almonds, pretzels, peanuts and cocoa truffles, finished with premium gift wrap.', season: null, size: 'medium', color: 'gold',
      candies: ['choc-almonds', 'choc-peanuts', 'choc-pretzels', 'choc-truffles', 'caramel-bites', 'marshmallow-clouds', 'rainbow-taffy'],
      extras: ['wrap'], vibe: 'gift'
    },
    {
      id: 'office-refill', name: 'Office Candy Refill', tag: 'Office Fave',
      desc: 'Keep the office snack station full.',
      goodFor: ['Offices', 'Break rooms', 'Big teams'],
      about: 'Fifteen crowd-pleasers chosen so nobody in the office is left out. Reorder it monthly and the snack station never runs dry.', season: null, size: 'party', color: 'blue',
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
      about: 'Our biggest box with fifteen different candies, so a room full of people all find something they like.', season: null, size: 'party', color: 'pink',
      candies: ['gummy-bears', 'gummy-worms', 'sour-belts', 'rainbow-bites', 'jelly-beans', 'watermelon-slices', 'peach-rings', 'sour-patch-mix', 'cola-bottles', 'gummy-sharks', 'marshmallow-clouds', 'rainbow-taffy', 'caramel-bites', 'sour-twists', 'gummy-hearts'],
      extras: ['scoop', 'stickers'], vibe: 'party'
    },
    {
      id: 'thank-you', name: 'Thank You Box', tag: 'Say Thanks',
      desc: 'A sweet thank-you that beats another bunch of flowers.',
      goodFor: ['Thank-yous', 'Clients', 'Neighbours'],
      about: 'A polite, crowd-pleasing mix — nothing too sour, nothing too weird — with a hand-written note and premium wrap.',
      size: 'medium', color: 'gold', season: null,
      candies: ['gummy-bears', 'choc-bar-bites', 'caramel-bites', 'rainbow-bites', 'marshmallow-clouds', 'yogurt-raisins', 'jelly-beans'],
      extras: ['note', 'wrap'], vibe: 'gift'
    },
    {
      id: 'get-well', name: 'Get Well Soon Box', tag: 'Feel Better',
      desc: 'Little comforts for someone having a rough week.',
      goodFor: ['Get well', 'Cheering someone up', 'Care packages'],
      about: 'Soft, gentle sweets that are easy to snack on in bed, plus a note so they know who is thinking of them.',
      size: 'small', color: 'mint', season: null,
      candies: ['marshmallow-clouds', 'gummy-hearts', 'rainbow-taffy', 'mint-humbugs'],
      extras: ['note'], vibe: 'gift'
    },
    {
      id: 'congrats', name: 'Congrats Box', tag: 'Well Done',
      desc: 'New job, new home, graduation — celebrate it with candy.',
      goodFor: ['Graduations', 'Promotions', 'New homes'],
      about: 'A bright celebration mix with a couple of premium picks so it feels like an occasion, not a snack run.',
      size: 'large', color: 'purple', season: null,
      candies: ['rainbow-bites', 'gummy-bears', 'choc-almonds', 'cookies-cream', 'rainbow-lollipops', 'caramel-popcorn', 'sour-patch-mix', 'jelly-beans', 'bubblegum-balls', 'marshmallow-clouds'],
      extras: ['note', 'wrap', 'stickers'], vibe: 'gift'
    },
    {
      id: 'love-box', name: 'Love You Box', tag: "Valentine's",
      desc: 'Hearts, berries and chocolate for the person you like most.',
      goodFor: ["Valentine's Day", 'Anniversaries', 'Date nights'],
      about: 'Berry gummy hearts and rich chocolate in a pink box with a hand-written note — sent as a gift, wrapped like one.',
      size: 'medium', color: 'pink', season: 'valentines',
      candies: ['gummy-hearts', 'choc-truffles', 'turkish-delight', 'rainbow-taffy', 'yogurt-raisins', 'freeze-taffy', 'gummy-bears'],
      extras: ['note', 'wrap'], vibe: 'gift'
    },
    {
      id: 'halloween-box', name: 'Trick or Treat Box', tag: 'Halloween',
      desc: 'Enough candy to answer the door all night long.',
      goodFor: ['Halloween', 'Trick-or-treaters', 'Class parties'],
      about: 'Fifteen classics kids actually recognise, in a party-size box so you are not rationing by 8pm.',
      size: 'party', color: 'purple', season: 'halloween',
      candies: ['gummy-worms', 'sour-patch-mix', 'jelly-beans', 'bubblegum-balls', 'rainbow-lollipops', 'candy-buttons', 'licorice-wheels', 'gummy-bears', 'sour-belts', 'choc-bar-bites', 'caramel-bites', 'rainbow-taffy', 'cola-bottles', 'gummy-sharks', 'rock-candy'],
      extras: ['stickers'], vibe: 'party'
    },
    {
      id: 'christmas-box', name: 'Christmas Stocking Box', tag: 'Holidays',
      desc: 'Stocking fillers sorted in one order.',
      goodFor: ['Christmas', 'Stocking fillers', 'Secret Santa'],
      about: 'Festive favourites with mint, chocolate and a few nostalgic picks, wrapped and ready to sit under the tree.',
      size: 'large', color: 'mint', season: 'christmas',
      candies: ['mint-humbugs', 'choc-truffles', 'candy-buttons', 'rainbow-lollipops', 'caramel-bites', 'choc-bar-bites', 'marshmallow-clouds', 'jelly-beans', 'yogurt-raisins', 'turkish-delight'],
      extras: ['note', 'wrap'], vibe: 'holiday'
    },
    {
      id: 'easter-box', name: 'Easter Hunt Box', tag: 'Easter',
      desc: 'Pastel sweets for baskets and back-garden hunts.',
      goodFor: ['Easter', 'Kids', 'Family gatherings'],
      about: 'Bright, pastel and mostly small pieces, which is exactly what you want when you are hiding them in the garden.',
      size: 'large', color: 'gold', season: 'easter',
      candies: ['gummy-bears', 'candy-buttons', 'rainbow-bites', 'bubblegum-balls', 'marshmallow-clouds', 'jelly-beans', 'yogurt-raisins', 'rock-candy', 'gummy-hearts', 'rainbow-taffy'],
      extras: ['stickers'], vibe: 'holiday'
    },
    {
      id: 'kids-box', name: 'Kids Favourites Box', tag: 'For Kids',
      desc: 'The stuff kids actually ask for, nothing weird.',
      goodFor: ['Kids', 'Party bags', 'Rewards'],
      about: 'No liquorice, no strong sours — just the fruity, chewy, colourful things children reliably finish.',
      size: 'small', color: 'blue', season: null,
      candies: ['gummy-bears', 'gummy-worms', 'rainbow-bites', 'bubblegum-balls'],
      extras: ['stickers'], vibe: 'birthday'
    },
    {
      id: 'vegan-box', name: 'Vegan Candy Box', tag: 'Plant-based',
      desc: 'Every piece plant-based — no gelatin anywhere.',
      goodFor: ['Vegans', 'Gifting', 'Allergy-aware gifting'],
      about: 'Built only from our vegan range, so it can be handed over without a single question about what is in it.',
      size: 'medium', color: 'mint', season: null,
      candies: ['vegan-fruit-gums', 'jelly-beans', 'rainbow-lollipops', 'rock-candy', 'chili-mango', 'freeze-rainbow', 'candy-buttons'],
      extras: ['note'], vibe: 'gift'
    },
    {
      id: 'world-box', name: 'World Tour Box', tag: 'New',
      desc: 'Candy from places your corner shop does not stock.',
      goodFor: ['Trying something new', 'Gifting', 'Content & sharing'],
      about: 'Japanese fruit chews, chili mango and Turkish delight next to a few familiar names — the box people film when they open it.',
      size: 'medium', color: 'blue', season: null,
      candies: ['japan-fruit-chews', 'chili-mango', 'turkish-delight', 'licorice-wheels', 'freeze-crunch', 'mint-humbugs', 'rainbow-taffy'],
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
    { icon: 'truck', title: 'Free over $50', text: 'Flat $4.99 under that' },
    { icon: 'clock', title: 'Ships same day', text: 'Order before 2pm' },
    { icon: 'shield', title: '100% happiness', text: '30 days to make it right' },
    { icon: 'gift', title: 'Gift ready', text: 'Free hand-written note' }
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
