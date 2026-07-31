/* =========================================================
   Yummyland — reusable page sections
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';
  var $ = YL.$;

  /* a generic mixed-candy recipe for decorative artwork */
  YL.mixedRecipe = function (ids) {
    var list = ids || ['gummy-bears', 'sour-belts', 'rainbow-bites', 'choc-peanuts', 'peach-rings', 'gummy-worms', 'watermelon-slices', 'marshmallow-clouds'];
    var out = [];
    list.forEach(function (id) {
      var c = YL.getCandy(id);
      if (c) c.recipe.forEach(function (r) { out.push(r); });
    });
    return out;
  };

  YL.prebuiltRecipe = function (pb) {
    var out = [];
    pb.candies.forEach(function (id) {
      var c = YL.getCandy(id);
      if (c) c.recipe.forEach(function (r) { out.push(r); });
    });
    return out;
  };

  YL.prebuiltPrice = function (pb) {
    return YL.boxPrice({
      size: pb.size,
      candies: pb.candies.map(function (id) { return { id: id, qty: 1 }; }),
      extras: pb.extras || []
    }).total;
  };

  /* ---------- how it works ---------- */
  YL.renderHow = function (sel) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="how">' + YL.HOW.map(function (s) {
      return '<div class="how__item">' + YL.icon(s.icon) + '<b>' + s.title + '</b><p>' + s.text + '</p></div>';
    }).join('') + '</div>';
  };

  /* ---------- ready-made boxes ---------- */
  YL.renderPrebuilt = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    var list = limit ? YL.PREBUILT.slice(0, limit) : YL.PREBUILT;
    host.innerHTML = '<div class="grid-cards">' + list.map(function (pb) {
      return '<article class="pcard">' +
        '<div class="pcard__art"><span class="pcard__tag">' + pb.tag + '</span>' +
        YL.boxArt({ color: pb.color, recipe: YL.prebuiltRecipe(pb), fill: 1, seed: pb.id }) + '</div>' +
        '<div class="pcard__body"><h3>' + pb.name + '</h3><p>' + pb.desc + '</p>' +
        '<div class="pcard__price"><small>from </small>' + YL.money(YL.prebuiltPrice(pb)) + '</div>' +
        '<div style="display:grid;gap:8px">' +
        '<a class="btn btn--block" href="index.html?box=' + pb.id + '">Customize</a>' +
        '<button class="btn btn--ghost btn--block" data-quick="' + pb.id + '">Add to cart</button>' +
        '</div></div></article>';
    }).join('') + '</div>';

    YL.$$('[data-quick]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var pb = YL.getPrebuilt(b.dataset.quick);
        YL.addToCart({
          size: pb.size,
          candies: pb.candies.map(function (id) { return { id: id, qty: 1 }; }),
          extras: (pb.extras || []).slice(),
          color: pb.color, vibe: pb.vibe || 'me', note: '', prefs: '', title: pb.name
        }, 1);
        YL.toast(pb.name + ' added to cart.');
      });
    });
  };

  /* ---------- occasions ---------- */
  YL.renderOccasions = function (sel) {
    var host = $(sel);
    if (!host) return;
    host.innerHTML = '<div class="occasions">' + YL.OCCASIONS.map(function (o) {
      return '<a class="occasion" href="boxes.html">' + YL.icon(o.icon) +
        '<span><b>' + o.name + '</b><small>' + o.text + '</small></span></a>';
    }).join('') + '</div>';
  };

  /* ---------- reviews ---------- */
  YL.renderReviews = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    var list = limit ? YL.REVIEWS.slice(0, limit) : YL.REVIEWS;
    host.innerHTML = '<div class="reviews">' + list.map(function (r) {
      return '<figure class="review" style="margin:0"><div class="stars">★★★★★</div>' +
        '<blockquote style="margin:0"><p>“' + r.text + '”</p></blockquote>' +
        '<figcaption><b>— ' + r.name + '</b></figcaption></figure>';
    }).join('') + '</div>';
  };

  /* ---------- faq ---------- */
  YL.renderFaq = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    var list = limit ? YL.FAQ.slice(0, limit) : YL.FAQ;
    host.innerHTML = '<div class="faq">' + list.map(function (f, i) {
      return '<details' + (i === 0 ? ' open' : '') + '><summary>' + f.q + '</summary><p>' + f.a + '</p></details>';
    }).join('') + '</div>';
  };
})(window.YL);
