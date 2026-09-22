/* =========================================================
   Yummyland — reusable page sections
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';
  var $ = YL.$, esc = YL.esc;

  function link(params) {
    var q = Object.keys(params).filter(function (k) { return params[k]; })
      .map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    return YL.PATHS.builder + (q ? '?' + q : '') + '#builder';
  }
  YL.builderLink = link;

  /* ---------- how it works ---------- */
  YL.renderHow = function (sel) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<ol class="how">' + YL.HOW.map(function (s, i) {
      return '<li class="how__item"><span class="how__n">0' + (i + 1) + '</span>' +
        '<b>' + s.title + '</b><p>' + s.text + '</p></li>';
    }).join('') + '</ol>';
  };

  /* ---------- collection cards ----------
     The card shows the live drawn box — the real six cups in their real
     order — until the product photo for that collection is shot. */
  YL.renderCollections = function (sel, list, occasion) {
    var host = $(sel);
    if (!host) return;
    list = list || YL.COLLECTIONS;
    host.innerHTML = '<div class="cols">' + list.map(function (c) {
      var box = YL.boxFromCollection(c, occasion);
      return '<article class="col-card">' +
        '<a class="col-card__art" href="' + link({ collection: c.id, occasion: occasion }) + '" aria-label="' + esc(c.name) + '">' +
        YL.giftBox(box, { compact: true }) + '</a>' +
        '<div class="col-card__body">' +
        '<span class="eyebrow">' + esc(c.tag) + '</span>' +
        '<h3>' + esc(c.name) + '</h3>' +
        '<p>' + esc(c.desc) + '</p>' +
        '<ul class="col-card__cups">' + c.cups.map(function (id) {
          var k = YL.getCandy(id);
          return k ? '<li><i style="background:' + k.swatch + '"></i>' + esc(k.label) + '</li>' : '';
        }).join('') + '</ul>' +
        '<div class="col-card__foot"><b class="price">' + YL.money(YL.BOX.price) + '</b>' +
        '<div class="col-card__btns">' +
        '<button type="button" class="btn btn--sm btn--gold" data-quick="' + c.id + '">Add to cart</button>' +
        '<a class="btn btn--sm btn--line" href="' + link({ collection: c.id, occasion: occasion }) + '">Personalise</a>' +
        '</div></div></div></article>';
    }).join('') + '</div>';

    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-quick]');
      if (!b) return;
      var col = YL.getCollection(b.getAttribute('data-quick'));
      var box = YL.boxFromCollection(col, occasion);
      YL.addToCart(box, 1);
      YL.trackAdd && YL.trackAdd(box);
      YL.toast(col.name + ' added — lid designed for ' + YL.getOccasion(box.occasion).name + '.');
    });
  };

  /* ---------- occasions ---------- */
  YL.renderOccasions = function (sel, base) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="occs">' + YL.OCCASIONS.map(function (o) {
      return '<a class="occ-card" href="' + (base ? base + '?for=' + o.id : link({ occasion: o.id })) + '">' +
        '<span class="occ-card__pola">' +
        '<img src="' + YL.img('assets/img/lid/' + o.id + '-1.webp') + '" alt="" loading="lazy" data-occ="' + o.id + '" data-n="1" onerror="YL.lidFallback(this)">' +
        '</span>' +
        '<span class="occ-card__ico">' + YL.icon(o.icon) + '</span>' +
        '<b>' + o.name + '</b><span class="occ-card__script">' + esc(o.headline) + '</span></a>';
    }).join('') + '</div>';
  };

  /* ---------- little extras (refill pouches) ---------- */
  YL.renderProducts = function (sel) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="prods">' + YL.PRODUCTS.map(function (p) {
      var c = YL.getCandy(p.candy);
      return '<article class="prod"><div class="prod__art">' + (c ? YL.candyTile(c) : '') + '</div>' +
        '<div class="prod__body"><b>' + esc(p.name) + '</b><p>' + esc(p.desc) + '</p>' +
        '<div class="prod__foot"><span class="price">' + YL.money(p.price) + '</span>' +
        '<button type="button" class="btn btn--sm btn--line" data-prod="' + p.id + '">Add</button></div></div></article>';
    }).join('') + '</div>';
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-prod]');
      if (!b) return;
      YL.addProductToCart(b.getAttribute('data-prod'), 1);
      YL.toast('Added to your cart.');
    });
  };

  /* ---------- the full candy range, read-only ---------- */
  YL.renderCandyWall = function (sel) {
    var host = $(sel);
    if (!host) return;
    var type = 'all';
    function draw() {
      var list = YL.CANDIES.filter(function (c) { return type === 'all' || c.types.indexOf(type) > -1; });
      host.innerHTML = '<div class="filters filters--center">' + YL.TYPES.map(function (t) {
        return '<button type="button" class="chip' + (t.id === type ? ' is-on' : '') + '" data-t="' + t.id + '">' + t.name + '</button>';
      }).join('') + '</div>' +
        '<div class="wall">' + list.map(function (c) {
          return '<div class="wall__item"><span class="wall__art">' + YL.candyTile(c, { px: 300, density: 4 }) + '</span>' +
            '<b>' + esc(c.name) + '</b><small>' + esc(c.brand) + (c.nuts ? ' · contains nuts' : '') + '</small></div>';
        }).join('') + '</div>';
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]');
      if (b) { type = b.getAttribute('data-t'); draw(); }
    });
    draw();
  };

  /* ---------- reviews ---------- */
  YL.renderReviews = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="reviews">' + YL.REVIEWS.slice(0, limit || 3).map(function (r) {
      return '<figure class="review-card"><span class="stars" aria-label="' + r.stars + ' stars">' +
        new Array(r.stars + 1).join('★') + '</span>' +
        '<blockquote>' + esc(r.text) + '</blockquote><figcaption>' + esc(r.name) + '</figcaption></figure>';
    }).join('') + '</div>';
  };

  /* ---------- faq ---------- */
  YL.renderFaq = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="faq">' + YL.FAQ.slice(0, limit || YL.FAQ.length).map(function (f) {
      return '<details><summary>' + esc(f.q) + YL.icon('chevron') + '</summary><p>' + esc(f.a) + '</p></details>';
    }).join('') + '</div>';
  };
})(window.YL);
