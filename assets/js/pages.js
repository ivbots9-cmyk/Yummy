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

  /* a ready-made box turned into the shape the cart and builder expect */
  YL.prebuiltBox = function (pb) {
    return {
      size: pb.size,
      candies: pb.candies.map(function (id) { return { id: id, qty: 1 }; }),
      extras: (pb.extras || []).slice(),
      color: pb.color, vibe: pb.vibe || 'me', note: '', prefs: '', title: pb.name
    };
  };

  function addPrebuilt(pb) {
    var box = YL.prebuiltBox(pb);
    if (YL.trackAdd) YL.trackAdd(box);
    YL.addToCart(box, 1);
    YL.toast(pb.name + ' added to cart.');
  }

  /* ---------- ready-made boxes ---------- */
  YL.renderPrebuilt = function (sel, limit, list) {
    var host = $(sel);
    if (!host) return;
    var boxes = list || (limit ? YL.PREBUILT.slice(0, limit) : YL.PREBUILT);

    if (!boxes.length) {
      host.innerHTML = '<p class="center" style="color:var(--ink-40)">No boxes match that filter yet.</p>';
      return;
    }

    host.innerHTML = '<div class="grid-cards">' + boxes.map(function (pb) {
      return '<article class="pcard pcard--clickable" data-open="' + pb.id + '" tabindex="0" ' +
        'role="button" aria-label="See what is inside the ' + YL.esc(pb.name) + '">' +
        '<div class="pcard__art"><span class="pcard__tag">' + pb.tag + '</span>' +
        YL.boxArt({ color: pb.color, recipe: YL.prebuiltRecipe(pb), fill: 1, seed: pb.id }) + '</div>' +
        '<div class="pcard__body"><h3>' + pb.name + '</h3><p>' + pb.desc + '</p>' +
        '<div class="pcard__price"><small>from </small>' + YL.money(YL.prebuiltPrice(pb)) + '</div>' +
        '<div style="display:grid;gap:8px">' +
        '<button class="btn btn--block" data-open="' + pb.id + '">See what&rsquo;s inside</button>' +
        '<button class="btn btn--ghost btn--block" data-quick="' + pb.id + '">Add to cart</button>' +
        '</div></div></article>';
    }).join('') + '</div>';

    YL.$$('[data-quick]', host).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        addPrebuilt(YL.getPrebuilt(b.dataset.quick));
      });
    });

    YL.$$('.pcard--clickable', host).forEach(function (card) {
      card.addEventListener('click', function () { YL.openBoxModal(YL.getPrebuilt(card.dataset.open)); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          YL.openBoxModal(YL.getPrebuilt(card.dataset.open));
        }
      });
    });
  };

  /* ---------- box detail modal ---------- */
  var modal, lastFocus;

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.hidden = false;
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-close]')) YL.closeBoxModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) YL.closeBoxModal();
    });
    return modal;
  }

  YL.closeBoxModal = function () {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  YL.openBoxModal = function (pb) {
    if (!pb) return;
    if (YL.trackViewBox) YL.trackViewBox(pb);
    var m = ensureModal();
    lastFocus = document.activeElement;

    var box = YL.prebuiltBox(pb);
    var size = YL.getSize(pb.size);
    var price = YL.boxPrice(box);
    var extras = (pb.extras || []).map(function (id) {
      var e = YL.getExtra(id);
      return e ? e.name + (e.price ? ' (+' + YL.money(e.price) + ')' : ' (free)') : id;
    });
    var premium = pb.candies.filter(function (id) {
      var c = YL.getCandy(id);
      return c && c.extra;
    }).length;

    m.innerHTML =
      '<div class="modal__box" role="document">' +
      '<button class="modal__close" data-close aria-label="Close">' + YL.icon('x') + '</button>' +
      '<div class="modal__grid">' +
      '<div class="modal__art">' +
      YL.boxArt({ color: pb.color, recipe: YL.prebuiltRecipe(pb), fill: 1, seed: pb.id }) +
      '</div>' +
      '<div class="modal__body">' +
      '<span class="badge">' + pb.tag + '</span>' +
      '<h2>' + pb.name + '</h2>' +
      '<p class="modal__lede">' + (pb.about || pb.desc) + '</p>' +

      '<div class="modal__meta">' +
      '<span class="tag">' + size.name + '</span>' +
      '<span class="tag">' + size.serves + '</span>' +
      '<span class="tag">' + pb.candies.length + ' candies</span>' +
      (premium ? '<span class="tag">' + premium + ' premium pick' + (premium > 1 ? 's' : '') + '</span>' : '') +
      '</div>' +

      '<h3>What&rsquo;s inside</h3>' +
      '<div class="modal__inside">' + pb.candies.map(function (id) {
        var c = YL.getCandy(id);
        if (!c) return '';
        return '<div>' + YL.candyDot(c, 30) + '<span>' + c.name +
          (c.extra ? ' <small style="color:var(--pink)">+' + YL.money(c.extra) + '</small>' : '') +
          '</span></div>';
      }).join('') + '</div>' +

      (extras.length ? '<h3>Comes with</h3><div class="chips">' +
        extras.map(function (n) { return '<span class="chip">' + n + '</span>'; }).join('') + '</div>' : '') +

      (pb.goodFor ? '<h3>Perfect for</h3><div class="chips">' +
        pb.goodFor.map(function (n) { return '<span class="chip">' + n + '</span>'; }).join('') + '</div>' : '') +

      '<div class="lines">' +
      '<div class="line"><span>Box (' + size.name + ')</span><b>' + YL.money(price.base) + '</b></div>' +
      '<div class="line"><span>Premium candy</span><b>' + (price.premium ? YL.money(price.premium) : '$0.00') + '</b></div>' +
      '<div class="line"><span>Extras</span><b>' + (price.extras ? YL.money(price.extras) : '$0.00') + '</b></div>' +
      '<div class="line line--total"><span>Total</span><b>' + YL.money(price.total) + '</b></div>' +
      '</div>' +

      '<div class="modal__cta">' +
      '<button class="btn btn--lg" data-modal-add>' + YL.icon('cart') + ' Add this box to cart</button>' +
      '<a class="btn btn--ghost" href="' + YL.PATHS.builder + '?box=' + pb.id + '">' +
      YL.icon('candy') + ' Open in builder &amp; tweak it</a>' +
      '</div>' +
      '<p style="font-size:12px;color:var(--ink-40);text-align:center;margin:12px 0 0">' +
      'Swap anything you like in the builder — the box stays yours.</p>' +

      '</div></div></div>';

    m.querySelector('[data-modal-add]').addEventListener('click', function () {
      addPrebuilt(pb);
      YL.closeBoxModal();
    });

    document.body.classList.add('modal-open');
    requestAnimationFrame(function () {
      m.classList.add('is-open');
      var close = m.querySelector('.modal__close');
      if (close) close.focus();
    });
  };


  /* ---------- social video wall ---------- */
  YL.renderSocial = function (sel, limit) {
    var host = $(sel);
    if (!host) return;
    var list = limit ? YL.SOCIAL.slice(0, limit) : YL.SOCIAL;

    host.innerHTML = '<div class="social">' + list.map(function (v) {
      var pb = YL.getPrebuilt(v.box);
      var art = pb
        ? YL.boxArt({ color: v.color || pb.color, recipe: YL.prebuiltRecipe(pb), fill: 1, seed: 'v' + v.id })
        : YL.boxArt({ color: v.color || 'pink', recipe: YL.mixedRecipe(), fill: 1, seed: 'v' + v.id });
      return '<button class="vcard" data-video="' + v.id + '" aria-label="Play: ' + YL.esc(v.caption) + '">' +
        '<span class="vcard__art">' + art + '</span>' +
        '<span class="vcard__shade"></span>' +
        '<span class="vcard__top">' + YL.icon(v.platform === 'instagram' ? 'instagram' : 'tiktok') +
        YL.esc(v.handle) + '<span class="vcard__views">' + YL.esc(v.views) + '</span></span>' +
        '<span class="vcard__play">' + playIcon() + '</span>' +
        '<span class="vcard__cap">' + YL.esc(v.caption) +
        (pb ? '<b>' + YL.esc(pb.name) + '</b>' : '') + '</span>' +
        '</button>';
    }).join('') + '</div>';

    YL.$$('[data-video]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = YL.SOCIAL.filter(function (x) { return x.id === b.dataset.video; })[0];
        openVideo(v);
      });
    });
  };

  function playIcon() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  }

  function openVideo(v) {
    if (!v) return;
    var m = ensureModal();
    lastFocus = document.activeElement;
    var pb = YL.getPrebuilt(v.box);

    m.innerHTML = '<div class="modal__box" role="document" style="background:transparent;box-shadow:none;overflow:visible;width:auto">' +
      '<button class="modal__close" data-close aria-label="Close">' + YL.icon('x') + '</button>' +
      '<div class="vplayer">' +
      (v.src
        ? '<video src="' + YL.esc(v.src) + '" controls autoplay playsinline></video>'
        : '<div style="background:#fff;border-radius:var(--radius-l);overflow:hidden">' +
          (pb ? YL.boxArt({ color: v.color || pb.color, recipe: YL.prebuiltRecipe(pb), fill: 1, seed: 'p' + v.id }) : '') +
          '<p style="padding:16px 18px;margin:0;font-size:14px;color:var(--ink-60)">' +
          '<b style="color:var(--ink)">' + YL.esc(v.handle) + '</b><br>' + YL.esc(v.caption) + '</p></div>') +
      '<p class="vplayer__note">' +
      (v.href ? 'Watch it on ' + (v.platform === 'instagram' ? 'Instagram' : 'TikTok') +
        ': <a href="' + YL.esc(v.href) + '" target="_blank" rel="noopener">open the post</a>'
        : 'Video coming soon — tag us and yours could land here.') +
      (pb ? ' &nbsp;·&nbsp; <a href="' + YL.PATHS.builder + '?box=' + pb.id + '">Build this box</a>' : '') +
      '</p></div></div>';

    document.body.classList.add('modal-open');
    requestAnimationFrame(function () {
      m.classList.add('is-open');
      var c = m.querySelector('.modal__close');
      if (c) c.focus();
    });
  }

  /* ---------- headline proof strip ---------- */
  YL.renderProof = function (sel) {
    var host = $(sel);
    if (!host) return;
    var p = YL.PROOF;
    host.innerHTML = '<div class="proof"><span class="proof__stars">★★★★★</span>' +
      '<span><b>' + p.rating + '/5</b> from <b>' + p.reviews.toLocaleString('en-US') + '</b> reviews</span>' +
      '<span aria-hidden="true">·</span><span><b>' + p.boxesPacked + '</b> ' + p.line + '</span></div>';
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
