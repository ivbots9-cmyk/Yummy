/* =========================================================
   Yummyland — box model, pricing, cart persistence (localStorage)
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var CART_KEY = 'yl.cart.v2';
  var DRAFT_KEY = 'yl.draft.v2';

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  /* Returns false when the browser refused the write — uploaded photos
     are the one thing big enough to hit the storage quota. */
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- box model ----------
     occasion   id from YL.OCCASIONS (sets the lid design)
     cups       exactly YL.BOX.cups candy ids, null for an empty cup,
                in reading order: top row left→right, then bottom row
     collection the collection it started from, if any (analytics only)
     lid        how the lid is dressed, asked in the builder:
                'own'  the customer's two photos (paid add-on 'photos')
                'ours' our photos for the occasion (free)
                'none' the printed lid with no photos
                null   not chosen yet — shown as 'ours'
     photos     [{ src: dataURL }, …] — only when the customer uploads
     captions   the two lines under the polaroids (free to edit)
     extras     ids from YL.EXTRAS
     card       greeting card { to, from, message } */
  YL.emptyBox = function () {
    var cups = [];
    for (var i = 0; i < YL.BOX.cups; i++) cups.push(null);
    return {
      occasion: null, cups: cups, collection: null, lid: null,
      photos: [null, null], captions: null,
      extras: [], card: { to: '', from: '', message: '' }
    };
  };

  YL.normalizeBox = function (box) {
    var b = YL.emptyBox();
    if (!box) return b;
    if (box.occasion && YL.getOccasion(box.occasion)) b.occasion = box.occasion;
    (box.cups || []).slice(0, YL.BOX.cups).forEach(function (id, i) {
      b.cups[i] = id && YL.getCandy(id) ? id : null;
    });
    b.collection = box.collection || null;
    if (box.lid === 'own' || box.lid === 'ours' || box.lid === 'none') b.lid = box.lid;
    if (box.photos) b.photos = [0, 1].map(function (i) {
      var p = box.photos[i];
      return p && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(p.src) ? { src: p.src } : null;
    });
    if (box.captions) b.captions = [String(box.captions[0] || ''), String(box.captions[1] || '')];
    b.extras = (box.extras || []).filter(function (id) { return !!YL.getExtra(id); });
    /* the photo add-on and the 'own' lid always travel together */
    if (!b.lid && b.extras.indexOf('photos') > -1) b.lid = 'own';
    b.extras = b.extras.filter(function (id) { return id !== 'photos' || b.lid === 'own'; });
    if (b.lid === 'own' && b.extras.indexOf('photos') < 0) b.extras.push('photos');
    if (box.card) b.card = { to: box.card.to || '', from: box.card.from || '', message: box.card.message || '' };
    return b;
  };

  YL.boxFromCollection = function (col, occasion, lid) {
    var b = YL.emptyBox();
    b.lid = lid || null;
    b.cups = col.cups.slice(0, YL.BOX.cups);
    b.collection = col.id;
    b.occasion = occasion || (col.occasions && col.occasions[0]) || null;
    return b;
  };

  YL.boxFilled = function (box) { return box.cups.filter(Boolean).length; };
  YL.boxComplete = function (box) { return YL.boxFilled(box) === YL.BOX.cups; };
  YL.hasOwnPhotos = function (box) { return !!(box.photos && box.photos[0] && box.photos[1]); };

  /* the lid text for a box: occasion defaults, customer captions on top */
  YL.boxLid = function (box) {
    var occ = YL.getOccasion(box.occasion) || YL.OCCASIONS[0];
    var caps = box.captions || occ.captions;
    var mode = box.lid || 'ours';
    var photos = mode === 'own'
      ? [box.photos[0] ? box.photos[0].src : null, box.photos[1] ? box.photos[1].src : null]
      : mode === 'ours'
        ? [YL.img('assets/img/lid/' + occ.id + '-1.webp'), YL.img('assets/img/lid/' + occ.id + '-2.webp')]
        : null;
    return {
      occasion: occ,
      mode: mode,
      headline: occ.headline,
      side: occ.side,
      captions: [caps[0] != null ? caps[0] : occ.captions[0], caps[1] != null ? caps[1] : occ.captions[1]],
      photos: photos,
      own: mode === 'own' && YL.hasOwnPhotos(box)
    };
  };

  YL.boxPrice = function (box) {
    var extras = 0;
    box.extras.forEach(function (id) {
      var e = YL.getExtra(id);
      if (e) extras += e.price;
    });
    return { base: YL.BOX.price, extras: extras, total: YL.BOX.price + extras };
  };

  YL.boxLabel = function (box) {
    var col = box.collection && YL.getCollection(box.collection);
    var custom = col && col.cups.join() !== box.cups.join();
    var occ = YL.getOccasion(box.occasion);
    var name = col && !custom ? col.name : 'Custom Six';
    return name + (occ ? ' · ' + occ.name : '');
  };

  /* candy recipe for the drawn art of a whole box */
  YL.boxRecipe = function (box) {
    var out = [];
    box.cups.forEach(function (id) {
      var c = id && YL.getCandy(id);
      if (c) c.recipe.forEach(function (r) { out.push(r); });
    });
    return out;
  };

  /* ---------- draft (the box on the builder) ---------- */
  YL.getDraft = function () { return YL.normalizeBox(read(DRAFT_KEY, null)); };
  YL.saveDraft = function (box) {
    if (write(DRAFT_KEY, box)) return true;
    /* over quota: keep everything except the photos, which the
       customer can re-upload, rather than losing the whole box */
    var slim = clone(box); slim.photos = [null, null];
    write(DRAFT_KEY, slim);
    return false;
  };
  YL.clearDraft = function () { write(DRAFT_KEY, YL.emptyBox()); };

  /* ---------- cart ----------
     Two kinds of line: a built box, or a standalone product. */
  YL.getCart = function () {
    return read(CART_KEY, []).filter(function (i) {
      return i && (i.kind === 'product' ? !!YL.getProduct(i.product) : !!i.box);
    }).map(function (i) {
      if (i.kind !== 'product') i.box = YL.normalizeBox(i.box);
      return i;
    });
  };

  YL.cartCount = function () {
    return YL.getCart().reduce(function (n, i) { return n + i.qty; }, 0);
  };

  YL.lineTotal = function (item) {
    if (item.kind === 'product') return YL.getProduct(item.product).price * item.qty;
    return YL.boxPrice(item.box).total * item.qty;
  };

  function newId() { return 'ci' + Date.now() + Math.floor(Math.random() * 1000); }

  function saveCart(cart) {
    var ok = write(CART_KEY, cart);
    YL.emit('cart:change');
    return ok;
  }

  /* With an adapter installed (Shopify) the local cart is bypassed. */
  YL.addToCart = function (box, qty) {
    if (YL.cartAdapter && typeof YL.cartAdapter.add === 'function') {
      return YL.cartAdapter.add(clone(box), qty || 1);
    }
    var cart = YL.getCart();
    cart.push({ id: newId(), kind: 'box', qty: qty || 1, box: clone(box) });
    if (!saveCart(cart)) {
      YL.toast && YL.toast('Your browser is out of space for photos — please re-upload them at checkout.');
    }
    return cart;
  };

  YL.addProductToCart = function (productId, qty) {
    if (YL.cartAdapter && typeof YL.cartAdapter.addProduct === 'function') {
      return YL.cartAdapter.addProduct(productId, qty || 1);
    }
    var cart = YL.getCart();
    var line = cart.filter(function (i) { return i.kind === 'product' && i.product === productId; })[0];
    if (line) line.qty = Math.min(99, line.qty + (qty || 1));
    else cart.push({ id: newId(), kind: 'product', qty: qty || 1, product: productId });
    saveCart(cart);
    return cart;
  };

  YL.updateCartQty = function (id, qty) {
    saveCart(YL.getCart().map(function (i) {
      if (i.id === id) i.qty = Math.max(1, Math.min(99, qty));
      return i;
    }));
  };

  YL.removeFromCart = function (id) {
    saveCart(YL.getCart().filter(function (i) { return i.id !== id; }));
  };

  YL.clearCart = function () { saveCart([]); };

  YL.cartTotals = function (promoCode) {
    var cart = YL.getCart();
    var subtotal = cart.reduce(function (n, i) { return n + YL.lineTotal(i); }, 0);
    var promo = promoCode ? YL.PROMOS[String(promoCode).toUpperCase()] : null;
    var discount = 0;
    if (promo) discount = promo.off ? subtotal * promo.off : Math.min(promo.flat, subtotal);
    var after = subtotal - discount;
    var shipping = !cart.length || after >= YL.SHIPPING.freeOver ? 0 : YL.SHIPPING.flat;
    return { subtotal: subtotal, discount: discount, promo: promo, shipping: shipping, total: after + shipping };
  };

  /* ---------- tiny event bus ---------- */
  var handlers = {};
  YL.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  YL.emit = function (name, payload) {
    (handlers[name] || []).forEach(function (fn) { fn(payload); });
  };
})(window.YL);
