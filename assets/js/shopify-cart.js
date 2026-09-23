/* =========================================================
   Yummyland — Shopify cart adapter
   Only loaded inside the Shopify theme. Turns a built gift box into
   Shopify line items via the AJAX Cart API (/cart/add.js).

   Expects window.YL_SHOPIFY, rendered by the Liquid section:
   {
     routes:  { cart: '/cart', cart_add: '/cart/add.js', builder: '/pages/build-your-box' },
     box:     { id: 44444444, price: 5499 },            // the gift box variant
     addons:  [{ sku: 'YL-ADD-PHOTOS', id: 555 }, …],   // add-ons + refill pouches
     goToCart: true
   }

   One box = the box variant carrying the whole order as line item
   properties (occasion, lid text, six cups, card) + one line per paid
   finishing touch. Customer photos travel as FILE properties — Shopify
   stores uploads made through a multipart cart request and links them
   on the order, so the print team downloads them from the order page.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var CFG = window.YL_SHOPIFY;
  if (!CFG) return;

  var routes = CFG.routes || {};
  var cartAdd = routes.cart_add || '/cart/add.js';
  var cartUrl = routes.cart || '/cart';

  YL.PATHS = {
    builder: routes.builder || '/pages/build-your-box',
    boxes: routes.boxes || '/collections/gift-boxes',
    cart: cartUrl
  };

  /* add-ons are matched by SKU, so the merchant can rename products freely */
  var BY_SKU = {};
  (CFG.addons || []).forEach(function (a) {
    if (a.sku) BY_SKU[String(a.sku).toUpperCase()] = a.id;
  });
  function variantFor(sku) { return BY_SKU[String(sku || '').toUpperCase()] || null; }

  /* human-readable order details — shown on the cart, the checkout and
     the packing slip, and the packing team works from them */
  function properties(box) {
    var lid = YL.boxLid(box);
    var props = {
      'Occasion': lid.occasion.name,
      'Lid headline': lid.headline,
      'Photo captions': lid.captions[0] + ' / ' + lid.captions[1],
      'Lid photos': lid.mode === 'own' ? 'Customer photos (attached)'
        : lid.mode === 'none' ? 'No photos' : 'Yummyland photos for ' + lid.occasion.name
    };
    box.cups.forEach(function (id, i) {
      var c = YL.getCandy(id);
      props['Cup ' + (i + 1)] = c ? c.name : '—';
    });
    if (box.extras.indexOf('card') > -1) {
      if (box.card.to) props['Card to'] = box.card.to;
      if (box.card.from) props['Card from'] = box.card.from;
      props['Card message'] = box.card.message;
    }
    if (box.extras.indexOf('wrap') > -1) props['Ribbon'] = 'Satin ribbon & gift tag';
    return props;
  }

  function dataUrlToBlob(src) {
    var parts = src.split(','), mime = /data:([^;]+)/.exec(parts[0])[1];
    var bin = atob(parts[1]), buf = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new Blob([buf], { type: mime });
  }

  function post(body, isForm) {
    return fetch(cartAdd, {
      method: 'POST',
      headers: isForm ? { 'Accept': 'application/json' } : { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: body
    }).then(function (r) {
      if (!r.ok) return r.json().then(function (j) { throw new Error(j.description || j.message || 'Cart error'); });
      return r.json();
    });
  }

  /* The box line goes first and alone, as multipart when it carries
     photos (file properties only work that way); add-ons follow as one
     JSON request, grouped to the box by a hidden property. */
  function addBox(box, qty) {
    if (!CFG.box || !CFG.box.id) return Promise.reject(new Error('No gift box variant configured.'));
    var group = 'box-' + Date.now().toString(36);
    var props = properties(box);
    props._yl_group = group;
    props._yl_payload = JSON.stringify({
      occasion: box.occasion, lid: box.lid, cups: box.cups, captions: box.captions, extras: box.extras, card: box.card
    });

    var first;
    if (YL.boxLid(box).own) {
      var fd = new FormData();
      fd.append('id', CFG.box.id);
      fd.append('quantity', qty);
      Object.keys(props).forEach(function (k) { fd.append('properties[' + k + ']', props[k]); });
      fd.append('properties[Photo 1]', dataUrlToBlob(box.photos[0].src), 'photo-1.jpg');
      fd.append('properties[Photo 2]', dataUrlToBlob(box.photos[1].src), 'photo-2.jpg');
      first = post(fd, true);
    } else {
      first = post(JSON.stringify({ items: [{ id: CFG.box.id, quantity: qty, properties: props }] }));
    }

    var addons = [], missing = [];
    box.extras.forEach(function (id) {
      var e = YL.getExtra(id);
      if (!e) return;
      var vid = variantFor(e.sku);
      if (!vid) { missing.push(e.sku); return; }
      addons.push({ id: vid, quantity: qty, properties: { _yl_group: group, 'For box': YL.boxLabel(box) } });
    });
    if (missing.length) console.warn('[Yummyland] Add-on products missing, not charged:', missing.join(', '));

    return first.then(function () {
      return addons.length ? post(JSON.stringify({ items: addons })) : null;
    });
  }

  function busy(on) {
    YL.$$('[data-add-cart], [data-quick], [data-prod]').forEach(function (b) { b.disabled = on; });
  }

  function done(label) {
    YL.toast('Added to cart — ' + label + '.');
    if (CFG.goToCart !== false) setTimeout(function () { window.location.href = cartUrl; }, 700);
    else refreshCount();
  }

  YL.cartAdapter = {
    add: function (box, qty) {
      busy(true);
      return addBox(box, qty || 1)
        .then(function () {
          document.dispatchEvent(new CustomEvent('yummyland:added', { detail: { box: box } }));
          done(YL.boxLabel(box));
        })
        .catch(function (e) {
          console.error('[Yummyland] add to cart failed', e);
          YL.toast('Sorry — we could not add this box. Please try again.');
        })
        .then(function () { busy(false); });
    },
    addProduct: function (productId, qty) {
      var p = YL.getProduct(productId);
      var vid = p && variantFor(p.sku);
      if (!vid) { YL.toast('This item is not available yet.'); return Promise.resolve(); }
      busy(true);
      return post(JSON.stringify({ items: [{ id: vid, quantity: qty || 1 }] }))
        .then(function () { done(p.name); })
        .catch(function () { YL.toast('Sorry — we could not add that. Please try again.'); })
        .then(function () { busy(false); });
    }
  };

  function refreshCount() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { document.dispatchEvent(new CustomEvent('yummyland:cart', { detail: cart })); })
      .catch(function () { /* the theme refreshes on its own */ });
  }
})(window.YL);
