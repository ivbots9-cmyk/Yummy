/* =========================================================
   Yummyland — generated vector art
   Every candy, box and icon on the site is drawn in code,
   so previews can react to what the customer picks.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  /* ---------- tiny deterministic RNG so art never re-shuffles ---------- */
  function seedFrom(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ---------- single candy pieces (drawn around 0,0, ~24px wide) ---------- */
  var PIECE = {
    bear: function (c) {
      return '<g fill="' + c.a + '">' +
        '<circle cx="-4.8" cy="-9.2" r="2.7"/><circle cx="4.8" cy="-9.2" r="2.7"/>' +
        '<circle cx="0" cy="-5.6" r="5.6"/>' +
        '<rect x="-6.2" y="-1" width="12.4" height="13.4" rx="6.2"/>' +
        '<ellipse cx="-7.2" cy="2.2" rx="2.9" ry="3.2"/><ellipse cx="7.2" cy="2.2" rx="2.9" ry="3.2"/>' +
        '<ellipse cx="-3.6" cy="11.8" rx="3.2" ry="2.9"/><ellipse cx="3.6" cy="11.8" rx="3.2" ry="2.9"/>' +
        '</g>' +
        '<ellipse cx="0" cy="-3.4" rx="2.6" ry="1.9" fill="#fff" opacity=".35"/>' +
        '<g fill="#3a1720" opacity=".45"><circle cx="-2.2" cy="-6.6" r=".95"/><circle cx="2.2" cy="-6.6" r=".95"/></g>' +
        '<ellipse cx="-3.4" cy="-9.6" rx="2.2" ry="1.3" fill="#fff" opacity=".35"/>';
    },
    worm: function (c) {
      return '<path d="M-13 6 C-9 -8 -4 10 0 -2 C4 -12 9 6 13 -5" fill="none" stroke="' + c.a +
        '" stroke-width="7.4" stroke-linecap="round"/>' +
        '<path d="M-13 6 C-9 -8 -4 10 0 -2" fill="none" stroke="' + c.b +
        '" stroke-width="7.4" stroke-linecap="round"/>';
    },
    ring: function (c) {
      return '<circle cx="0" cy="0" r="9" fill="none" stroke="' + c.a + '" stroke-width="6.4"/>' +
        '<path d="M-7 -6 A9 9 0 0 1 2 -8.6" fill="none" stroke="#fff" opacity=".4" stroke-width="2.4" stroke-linecap="round"/>';
    },
    belt: function (c) {
      return '<g><rect x="-13" y="-5" width="26" height="10" rx="3" fill="' + c.a + '"/>' +
        '<rect x="-13" y="-5" width="26" height="3.4" rx="1.7" fill="' + c.b + '"/>' +
        '<rect x="-13" y="1.6" width="26" height="3.4" rx="1.7" fill="' + (c.c || c.b) + '"/></g>';
    },
    slice: function (c) {
      return '<path d="M-11 5 A11 11 0 0 1 11 5 Z" fill="' + c.a + '"/>' +
        '<path d="M-11 5 A11 11 0 0 1 11 5" fill="none" stroke="' + (c.b || '#3fbf6a') +
        '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<g fill="#3a1720" opacity=".5"><ellipse cx="-4" cy="0" rx=".9" ry="1.4"/>' +
        '<ellipse cx="2.4" cy="-1.4" rx=".9" ry="1.4"/><ellipse cx="-.6" cy="2.6" rx=".9" ry="1.4"/></g>';
    },
    cube: function (c) {
      return '<rect x="-8" y="-8" width="16" height="16" rx="4.5" fill="' + c.a + '"/>' +
        '<rect x="-8" y="-8" width="16" height="6" rx="4" fill="#fff" opacity=".16"/>';
    },
    bean: function (c) {
      return '<ellipse cx="0" cy="0" rx="9" ry="6.4" fill="' + c.a + '"/>' +
        '<ellipse cx="-3" cy="-2.4" rx="3.4" ry="1.8" fill="#fff" opacity=".45"/>';
    },
    shark: function (c) {
      return '<path d="M-13 3 C-9 -4 -2 -6 4 -4 L7 -11 L11 -3 C14 -1 14 4 10 6 C4 9 -8 9 -13 3 Z" fill="' + c.a + '"/>' +
        '<path d="M-13 3 C-9 -4 -2 -6 4 -4 C2 1 -4 5 -13 3 Z" fill="' + c.b + '"/>';
    },
    lentil: function (c) {
      return '<ellipse cx="0" cy="0" rx="8.6" ry="7.4" fill="' + c.a + '"/>' +
        '<ellipse cx="-2.6" cy="-2.6" rx="3.2" ry="2" fill="#fff" opacity=".4"/>';
    },
    square: function (c) {
      return '<rect x="-9" y="-9" width="18" height="18" rx="3" fill="' + c.a + '"/>' +
        '<path d="M-9 -3h18M-9 3h18M-3 -9v18M3 -9v18" stroke="#000" opacity=".18" stroke-width="1.2"/>' +
        '<rect x="-9" y="-9" width="18" height="5" rx="2.5" fill="#fff" opacity=".12"/>';
    },
    pretzel: function (c) {
      return '<g fill="none" stroke="' + c.a + '" stroke-width="4.6" stroke-linecap="round">' +
        '<circle cx="-5" cy="-3" r="4.6"/><circle cx="5" cy="-3" r="4.6"/>' +
        '<path d="M-6 1 L0 9 L6 1"/></g>';
    },
    ball: function (c) {
      return '<circle cx="0" cy="0" r="8" fill="' + c.a + '"/>' +
        '<circle cx="-2.6" cy="-2.8" r="2.6" fill="#fff" opacity=".42"/>';
    },
    bottle: function (c) {
      return '<path d="M-4 -11 h8 v3 c0 2 3 3 3 6 v10 c0 2-1 3-3 3 h-8 c-2 0-3-1-3-3 v-10 c0-3 3-4 3-6 z" fill="' + c.a + '"/>' +
        '<path d="M-4 -11 h8 v3 c0 2 3 3 3 6 h-14 c0-3 3-4 3-6 z" fill="' + c.b + '"/>';
    },
    twist: function (c) {
      return '<g stroke-linecap="round" stroke-width="7.5"><path d="M-12 5 C-6 -6 6 12 12 -3" fill="none" stroke="' + c.a + '"/>' +
        '<path d="M-12 5 C-6 -6 6 12 12 -3" fill="none" stroke="' + c.b + '" stroke-width="2.4" stroke-dasharray="4 5"/></g>';
    },
    puff: function (c) {
      return '<path d="M0 -10 C6 -10 10 -6 10 0 C10 6 5 10 0 10 C-6 10 -10 5 -10 0 C-10 -6 -6 -10 0 -10 Z" fill="' + c.a + '"/>' +
        '<g fill="#fff" opacity=".5"><circle cx="-3" cy="-3" r="1.8"/><circle cx="3.4" cy="2" r="1.2"/></g>';
    },
    marsh: function (c) {
      return '<rect x="-9" y="-7" width="18" height="14" rx="6" fill="' + c.a + '"/>' +
        '<rect x="-9" y="-7" width="18" height="6" rx="4" fill="#fff" opacity=".45"/>';
    },
    taffy: function (c) {
      return '<path d="M-13 -2 l4 2 -4 2 z" fill="' + c.b + '"/><path d="M13 -2 l-4 2 4 2 z" fill="' + c.b + '"/>' +
        '<rect x="-9" y="-6" width="18" height="12" rx="4" fill="' + c.a + '"/>' +
        '<rect x="-9" y="-6" width="18" height="4" rx="2" fill="#fff" opacity=".3"/>';
    },
    heart: function (c) {
      return '<path d="M0 9 C-11 2 -10 -6 -4.6 -8 C-1.6 -9 0 -6.6 0 -5 C0 -6.6 1.6 -9 4.6 -8 C10 -6 11 2 0 9 Z" fill="' + c.a + '"/>';
    },
    /* --- shapes for the wider assortment --- */
    swirl: function (c) {
      return '<circle cx="0" cy="0" r="9.5" fill="' + c.a + '"/>' +
        '<path d="M0 -9.5 A9.5 9.5 0 0 1 0 9.5 A6.5 6.5 0 0 1 0 -3.5 A3 3 0 0 0 0 2.5" fill="none" stroke="' +
        (c.b || '#fff') + '" stroke-width="3.2" stroke-linecap="round"/>';
    },
    bar: function (c) {
      return '<rect x="-11" y="-7" width="22" height="14" rx="2.5" fill="' + c.a + '"/>' +
        '<path d="M-3.7 -7v14M3.7 -7v14M-11 0h22" stroke="#000" opacity=".2" stroke-width="1.4"/>' +
        '<rect x="-11" y="-7" width="22" height="4" rx="2" fill="#fff" opacity=".14"/>';
    },
    straw: function (c) {
      return '<rect x="-13" y="-3.4" width="26" height="6.8" rx="3.4" fill="' + c.a + '"/>' +
        '<rect x="-13" y="-3.4" width="26" height="2.4" rx="1.2" fill="#fff" opacity=".35"/>';
    },
    coil: function (c) {
      return '<circle cx="0" cy="0" r="9.5" fill="' + c.a + '"/>' +
        '<circle cx="0" cy="0" r="6" fill="none" stroke="' + (c.b || '#fff') + '" stroke-width="2.6"/>' +
        '<circle cx="0" cy="0" r="2" fill="' + (c.b || '#fff') + '"/>';
    },
    crystal: function (c) {
      return '<path d="M0 -10 L6 -3 L4 8 L-4 8 L-6 -3 Z" fill="' + c.a + '" opacity=".92"/>' +
        '<path d="M0 -10 L6 -3 L0 -1 Z" fill="#fff" opacity=".4"/>';
    },
    cup: function (c) {
      return '<path d="M-9 -6 h18 l-2.4 12 c-.3 1.6-1.6 2.6-3.2 2.6 h-6.8 c-1.6 0-2.9-1-3.2-2.6 Z" fill="' + c.a + '"/>' +
        '<ellipse cx="0" cy="-6" rx="9" ry="3" fill="' + (c.b || '#c98b45') + '"/>';
    },
    wrapped: function (c) {
      return '<path d="M-13 -4 l4.5 4 -4.5 4 z" fill="' + (c.b || c.a) + '"/>' +
        '<path d="M13 -4 l-4.5 4 4.5 4 z" fill="' + (c.b || c.a) + '"/>' +
        '<circle cx="0" cy="0" r="8" fill="' + c.a + '"/>' +
        '<ellipse cx="-2.6" cy="-2.8" rx="2.8" ry="1.8" fill="#fff" opacity=".4"/>';
    }
  };

  var SUGAR = '<g fill="#fff" opacity=".55"><circle cx="-5" cy="-4" r=".9"/><circle cx="3" cy="-6" r=".8"/>' +
    '<circle cx="6" cy="2" r=".9"/><circle cx="-2" cy="5" r=".8"/><circle cx="-7" cy="3" r=".8"/><circle cx="1" cy="0" r=".7"/></g>';

  function piece(shape, colors, sour) {
    var fn = PIECE[shape] || PIECE.bean;
    return fn(colors) + (sour ? SUGAR : '');
  }

  /* ---------- scatter a pile of pieces in a rectangle ---------- */
  function pile(opts) {
    var r = rng(seedFrom(opts.seed || 'yl'));
    var recipe = opts.recipe || [];
    if (!recipe.length) return '';
    var out = [];
    var cols = opts.cols || 4;
    var rows = opts.rows || 3;
    var w = opts.w, h = opts.h, x0 = opts.x || 0, y0 = opts.y || 0;
    var cw = w / cols, ch = h / rows;
    var i = 0;
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var rec = recipe[i % recipe.length];
        i++;
        var jx = (r() - 0.5) * cw * 0.72;
        var jy = (r() - 0.5) * ch * 0.72;
        var cx = x0 + cw * (col + 0.5) + jx;
        var cy = y0 + ch * (row + 0.5) + jy;
        var rot = Math.round((r() * 360));
        var sc = ((opts.scale || 1) * (0.82 + r() * 0.4)).toFixed(2);
        out.push('<g transform="translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ') rotate(' + rot + ') scale(' + sc + ')">' +
          piece(rec.shape, rec.colors, rec.sour) + '</g>');
      }
    }
    /* draw back rows first so the pile reads as depth */
    return out.join('');
  }

  /* ---------- candy tile used on catalogue cards ----------
     Real product photos win when a candy has one (they are the actual
     Shopify product images); the generated pile is the fallback, and
     still does all the work inside the box preview. */
  YL.candyTile = function (candy, opts) {
    opts = opts || {};
    var w = opts.w || 150, h = opts.h || 104;
    if (candy.img && !opts.vector) {
      return '<img class="candy__photo" src="' + esc(photoUrl(candy, opts.px || 420)) + '" ' +
        'alt="' + esc(candy.name) + '" loading="lazy" decoding="async" ' +
        'onerror="YL.photoFallback(this)" data-candy-id="' + esc(candy.id) + '" ' +
        'style="background:' + (candy.bg || '#fff2f8') + '">';
    }
    var recipe = candy.recipe || [{ shape: 'bean', colors: { a: '#ff5ea8' } }];
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + esc(candy.name) + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="' + (candy.bg || '#fff2f8') + '"/>' +
      pile({
        seed: candy.id, recipe: recipe,
        w: w + 34, h: h + 34, x: -17, y: -17,
        cols: 5, rows: 4, scale: (opts.scale || 1) * 1.35
      }) + '</svg>';
  };

  /* A local copy wins when tools/fetch-photos.js has put one there.
     Otherwise it is the Shopify CDN, which resizes on the fly — asking
     for the width we actually render keeps the cards light. Any other
     host gets its URL back untouched. */
  function photoUrl(candy, px) {
    if (candy.photo && YL.PHOTO_BASE) return YL.PHOTO_BASE + candy.photo;
    var url = candy.img;
    if (!/cdn\.shopify\.com/.test(url)) return url;
    return url + (url.indexOf('?') > -1 ? '&' : '?') + 'width=' + px;
  }
  YL.photoUrl = photoUrl;

  /* A photo that will not load falls back one step at a time: a missing
     local copy retries the CDN, and only a candy with no working photo
     at all drops to the generated pile. A card is never an empty box. */
  YL.photoFallback = function (img) {
    var candy = YL.getCandy && YL.getCandy(img.getAttribute('data-candy-id'));
    if (!candy || !img.parentNode) return;
    if (!img.getAttribute('data-retried') && candy.photo && candy.img &&
        img.getAttribute('src').indexOf('cdn.shopify.com') < 0) {
      img.setAttribute('data-retried', '1');
      img.src = candy.img;
      return;
    }
    var plain = {}, k;
    for (k in candy) if (Object.prototype.hasOwnProperty.call(candy, k)) plain[k] = candy[k];
    plain.img = null;
    img.outerHTML = img.className.indexOf('candy-dot') > -1
      ? YL.candyDot(plain, parseInt(img.getAttribute('width'), 10) || 40)
      : YL.candyTile(candy, { vector: true });
  };

  /* ---------- little round swatch (used in lists) ---------- */
  YL.candyDot = function (candy, size) {
    var s = size || 40;
    if (candy.img) {
      return '<img class="candy-dot" src="' + esc(photoUrl(candy, 120)) + '" alt="" loading="lazy" ' +
        'onerror="YL.photoFallback(this)" data-candy-id="' + esc(candy.id) + '" ' +
        'width="' + s + '" height="' + s + '" style="background:' + (candy.bg || '#fff2f8') + '">';
    }
    var rec = (candy.recipe || [{ shape: 'bean', colors: { a: '#ff5ea8' } }]);
    return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" aria-hidden="true">' +
      '<rect width="40" height="40" rx="12" fill="' + (candy.bg || '#fff2f8') + '"/>' +
      '<g transform="translate(20 20) scale(.86)">' + piece(rec[0].shape, rec[0].colors, rec[0].sour) + '</g>' +
      '<g transform="translate(31 30) scale(.5)">' + piece(rec[rec.length - 1].shape, rec[rec.length - 1].colors) + '</g>' +
      '</svg>';
  };

  /* ---------- the hero: an open Yummyland box you can fill ---------- */
  var BOX_COLORS = {
    pink: { front: '#ff2e8b', dark: '#d1006a', light: '#ff77b4', lid: '#ff4f9d' },
    purple: { front: '#9b6bff', dark: '#6f3fd6', light: '#c3a5ff', lid: '#ab80ff' },
    blue: { front: '#45b8ff', dark: '#1a8bd6', light: '#8fd8ff', lid: '#5fc4ff' },
    mint: { front: '#35c9a4', dark: '#149c7c', light: '#86e5cd', lid: '#4dd4b3' },
    gold: { front: '#ffc933', dark: '#e0a200', light: '#ffe08a', lid: '#ffd457' }
  };

  YL.boxArt = function (opts) {
    opts = opts || {};
    var c = BOX_COLORS[opts.color] || BOX_COLORS.pink;
    var recipe = opts.recipe && opts.recipe.length ? opts.recipe : null;
    var fill = opts.fill == null ? 1 : Math.max(0.15, Math.min(1, opts.fill));
    var seed = opts.seed || 'box';
    var uid = 'b' + Math.abs(seedFrom(seed + (opts.color || '') + fill)).toString(36);
    var empty = !recipe;
    var rec = recipe || [
      { shape: 'bean', colors: { a: '#ffd0e4' } }, { shape: 'ball', colors: { a: '#ffe0ee' } },
      { shape: 'cube', colors: { a: '#ffd9ea' } }, { shape: 'ring', colors: { a: '#ffc8e0' } }
    ];

    /* mound height grows with how full the box is */
    var top = 214 - 96 * fill;
    var clip = 'M78 252 L140 176 Q260 ' + (top - 34).toFixed(0) + ' 380 176 L442 252 Z';
    var rows = Math.max(2, Math.round((252 - top) / 30));

    /* candy spilled around the base — kept clear of the printed logo */
    var confetti =
      pile({ seed: seed + 'cl', recipe: rec, w: 86, h: 60, x: -4, y: 292, cols: 2, rows: 2, scale: 1 }) +
      pile({ seed: seed + 'cr', recipe: rec, w: 86, h: 60, x: 438, y: 292, cols: 2, rows: 2, scale: 1 }) +
      pile({ seed: seed + 'cb', recipe: rec, w: 330, h: 26, x: 95, y: 330, cols: 5, rows: 1, scale: .9 });

    return '<svg viewBox="0 0 520 400" width="100%" role="img" aria-label="Your Yummyland box preview">' +
      '<defs>' +
      '<clipPath id="' + uid + '"><path d="' + clip + '"/></clipPath>' +
      '<linearGradient id="' + uid + 'f" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + c.lid + '"/><stop offset="1" stop-color="' + c.front + '"/></linearGradient>' +
      '<linearGradient id="' + uid + 'l" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c.lid + '"/><stop offset="1" stop-color="' + c.front + '"/></linearGradient>' +
      '</defs>' +
      /* soft shadow */
      '<ellipse cx="260" cy="352" rx="188" ry="26" fill="' + c.dark + '" opacity=".13"/>' +
      /* opened lid, tilted behind */
      '<g transform="rotate(-8 260 150)"><rect x="146" y="58" width="238" height="74" rx="12" fill="url(#' + uid + 'l)"/>' +
      '<rect x="146" y="58" width="238" height="14" rx="7" fill="#fff" opacity=".18"/>' +
      '<text x="265" y="106" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-size="30" font-weight="800" fill="#fff" opacity=".95">YUMMYLAND</text></g>' +
      /* box interior */
      '<path d="M140 176 L380 176 L442 250 L78 250 Z" fill="' + c.dark + '"/>' +
      '<path d="M140 176 L380 176 L380 186 L140 186 Z" fill="#000" opacity=".12"/>' +
      /* candy mound */
      '<g clip-path="url(#' + uid + ')" opacity="' + (empty ? '.5' : '1') + '">' +
      pile({
        seed: seed + 'in', recipe: rec,
        w: 400, h: 252 - top + 46, x: 60, y: top - 16,
        cols: 9, rows: rows, scale: 1.5
      }) + '</g>' +
      /* front panel */
      '<path d="M78 250 L442 250 L442 322 Q442 336 428 336 L92 336 Q78 336 78 322 Z" fill="url(#' + uid + 'f)"/>' +
      '<path d="M78 250 L442 250 L442 262 L78 262 Z" fill="#fff" opacity=".16"/>' +
      '<text x="260" y="304" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-size="40" font-weight="800" fill="#fff" letter-spacing="1">YUMMYLAND</text>' +
      '<text x="260" y="322" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" font-weight="700" fill="#fff" opacity=".82" letter-spacing="2">YUMMYLANDCANDY.COM</text>' +
      /* spilled pieces in front */
      '<g opacity="' + (empty ? '.5' : '1') + '">' + confetti + '</g>' +
      '</svg>';
  };

  /* ---------- box size pictogram ---------- */
  YL.boxIcon = function (scale, color) {
    var s = scale || 1;
    var c = color || '#ff2e8b';
    return '<svg viewBox="0 0 70 56" width="' + Math.round(56 * s) + '" height="' + Math.round(46 * s) + '" aria-hidden="true">' +
      '<path d="M14 20 L56 20 L62 30 L8 30 Z" fill="' + c + '" opacity=".35"/>' +
      '<path d="M8 30 h54 v16 a4 4 0 0 1-4 4 H12 a4 4 0 0 1-4-4 Z" fill="' + c + '"/>' +
      '<path d="M8 30 h54 v4 H8 Z" fill="#fff" opacity=".25"/>' +
      '<circle cx="24" cy="16" r="4" fill="' + c + '" opacity=".55"/>' +
      '<circle cx="35" cy="12" r="5" fill="' + c + '" opacity=".75"/>' +
      '<circle cx="46" cy="16" r="4" fill="' + c + '" opacity=".55"/>' +
      '</svg>';
  };

  /* ---------- logo ---------- */
  YL.logoMark = function () {
    return '<svg class="logo__mark" viewBox="0 0 48 48" aria-hidden="true">' +
      '<circle cx="24" cy="24" r="21" fill="#ff2e8b"/>' +
      '<path d="M24 38 C8 27 10 14 18 12 C22.5 11 24 15 24 17 C24 15 25.5 11 30 12 C38 14 40 27 24 38 Z" fill="#fff"/>' +
      '<circle cx="16" cy="18" r="2.4" fill="#ff2e8b" opacity=".35"/>' +
      '</svg>';
  };

  /* ---------- line icons ---------- */
  var I = {
    box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    candy: '<circle cx="12" cy="12" r="4.5"/><path d="M7 9L3 5v6l4-2zM17 15l4 4v-6l-4 2z"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12"/><path d="M12 9S9.5 3 7 4.5 9 9 12 9zM12 9s2.5-6 5-4.5S15 9 12 9z"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
    heart: '<path d="M12 20S3.5 14.5 3.5 8.9A4.4 4.4 0 0 1 12 6.8a4.4 4.4 0 0 1 8.5 2.1C20.5 14.5 12 20 12 20z"/>',
    sparkle: '<path d="M12 3l2 5.5L19.5 11 14 13l-2 5.5L10 13 4.5 11 10 8.5z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    cart: '<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.4 8.3-8 9-4.6-.7-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    star: '<path d="M12 3l2.7 5.9 6.3.7-4.7 4.3 1.3 6.1L12 17l-5.6 3 1.3-6.1L3 9.6l6.3-.7z"/>',
    note: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    sticker: '<path d="M4 12a8 8 0 1 1 12.5 6.6L20 12"/><circle cx="12" cy="12" r="8"/><path d="M14 20v-4a2 2 0 0 1 2-2h4"/>',
    wrap: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16M3 12h18"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.4"/><circle cx="15.5" cy="15.5" r="1.4"/><circle cx="12" cy="12" r="1.4"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.9 2-2 0-1.7 1.3-2 2.5-2H19a3 3 0 0 0 3-3c0-5-4.5-9-10-9z"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/>',
    cake: '<path d="M4 20h16v-6c0-1.7-1.6-3-4-3H8c-2.4 0-4 1.3-4 3z"/><path d="M12 11V7M9 7c0-1.5 3-1.5 3-3 0 1.5 3 1.5 3 3"/><path d="M4 16c2 1.5 4 1.5 6 0s4-1.5 6 0 2 1.5 4 0"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M16 5v14M3 12h18"/>',
    party: '<path d="M4 20l5-13 8 8z"/><path d="M15 4v2M19 7l1.5-1M18 12h2"/>',
    tree: '<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M11 16h2v5h-2z"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5A2.5 2.5 0 1 1 12 12.5V14"/><circle cx="12" cy="17.5" r=".6" fill="currentColor"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    leaf: '<path d="M20 4C10 4 4 9 4 16c0 2.2.8 4 .8 4S8 12 20 4z"/><path d="M4 20s4-9 16-16"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>',
    tiktok: '<path d="M15 4c.5 2.5 2 4 4.5 4.2v3.2c-1.7 0-3.3-.5-4.5-1.5v5.6a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.3a2.3 2.3 0 1 0 1.6 2.2V4z"/>',
    facebook: '<path d="M14 8h3V4.5h-3A4 4 0 0 0 10 8.5V11H7.5v3.5H10V21h3.5v-6.5H16l.7-3.5H13.5V9a1 1 0 0 1 1-1z"/>',
    pinterest: '<circle cx="12" cy="12" r="9"/><path d="M10 21l2-8M12 13c-1.6 0-2.5-1.2-2.5-2.8C9.5 8.5 11 7 13 7s3 1.3 3 3c0 2.2-1.2 3.6-2.7 3.6-.8 0-1.4-.6-1.2-1.4"/>',
    burger: '<path d="M4 7h16M4 12h16M4 17h16"/>'
  };

  YL.icon = function (name, cls) {
    var d = I[name] || I.candy;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };

  /* solid-filled variant for footer socials etc. */
  YL.iconSolid = function (name, cls) {
    var d = I[name] || I.candy;
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="currentColor" stroke="none" width="18" height="18" aria-hidden="true">' + d + '</svg>';
  };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m];
    });
  }
  YL.esc = esc;
  YL.pile = pile;
  YL.piece = piece;
  YL.BOX_COLORS = BOX_COLORS;
})(window.YL);
