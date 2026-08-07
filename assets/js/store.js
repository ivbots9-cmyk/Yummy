/* =========================================================
   Yummyland — box pricing + cart persistence (localStorage)
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var CART_KEY = 'yl.cart.v1';
  var DRAFT_KEY = 'yl.draft.v1';
  var SAVED_KEY = 'yl.saved.v1';

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  /* ---------- box model ---------- */
  YL.emptyBox = function () {
    return { size: 'medium', candies: [], extras: [], color: 'pink', vibe: 'me', note: '', prefs: '' };
  };

  /* ---------- weight ----------
     Capacity is measured in 4 oz scoops. A box holds its size's scoops,
     plus one more if the "Extra 4 oz Scoop" add-on is on. */
  YL.boxScoopsUsed = function (box) {
    return box.candies.reduce(function (n, c) { return n + c.qty; }, 0);
  };

  YL.boxCapacity = function (box) {
    var n = YL.getSize(box.size).scoops;
    box.extras.forEach(function (id) {
      var e = YL.getExtra(id);
      if (e && e.addsScoop) n += 1;
    });
    return n;
  };

  YL.boxOzUsed = function (box) { return YL.boxScoopsUsed(box) * YL.PRICING.scoopOz; };
  YL.boxOzCapacity = function (box) { return YL.boxCapacity(box) * YL.PRICING.scoopOz; };

  YL.boxPrice = function (box) {
    var size = YL.getSize(box.size);
    var premium = 0;
    box.candies.forEach(function (c) {
      var candy = YL.getCandy(c.id);
      if (candy) premium += (candy.extra || 0) * c.qty;
    });
    var extras = 0;
    box.extras.forEach(function (id) {
      var e = YL.getExtra(id);
      if (e) extras += e.price;
    });
    return {
      base: size.price,
      premium: premium,
      extras: extras,
      total: size.price + premium + extras
    };
  };

  /* candy recipe for the artwork of a given box */
  YL.boxRecipe = function (box) {
    var out = [];
    box.candies.forEach(function (c) {
      var candy = YL.getCandy(c.id);
      if (!candy) return;
      for (var q = 0; q < c.qty; q++) {
        candy.recipe.forEach(function (r) { out.push(r); });
      }
    });
    return out;
  };

  /* "2 lb · Sour Power Rainbow Straws ×2, Peach Rings…" for carts and receipts */
  YL.boxFillLabel = function (box) {
    return YL.weightLabel(YL.boxOzUsed(box)) + ' of ' + YL.weightLabel(YL.boxOzCapacity(box));
  };

  YL.boxLabel = function (box) {
    if (box.title) return box.title;
    var size = YL.getSize(box.size);
    var vibe = null;
    for (var i = 0; i < YL.VIBES.length; i++) if (YL.VIBES[i].id === box.vibe) vibe = YL.VIBES[i];
    if (vibe && vibe.id !== 'me') return vibe.name + ' Box · ' + size.name;
    return 'Custom ' + size.name;
  };

  /* ---------- draft (the box currently on the builder) ---------- */
  YL.getDraft = function () {
    var d = read(DRAFT_KEY, null);
    if (!d || !d.candies) return YL.emptyBox();
    return d;
  };
  YL.saveDraft = function (box) { write(DRAFT_KEY, box); };
  YL.clearDraft = function () { write(DRAFT_KEY, YL.emptyBox()); };

  /* ---------- saved boxes ("save my box") ---------- */
  YL.getSaved = function () { return read(SAVED_KEY, []); };
  YL.saveBox = function (box) {
    var list = YL.getSaved();
    list.unshift({ id: 'sb' + Date.now(), box: JSON.parse(JSON.stringify(box)), at: Date.now() });
    write(SAVED_KEY, list.slice(0, 12));
  };

  /* ---------- cart ---------- */
  YL.getCart = function () { return read(CART_KEY, []); };

  YL.cartCount = function () {
    return YL.getCart().reduce(function (n, i) { return n + i.qty; }, 0);
  };

  /* Adds a box to whatever cart is configured. With an adapter installed
     (Shopify, custom API) the local cart is bypassed entirely. */
  YL.addToCart = function (box, qty) {
    if (YL.cartAdapter && typeof YL.cartAdapter.add === 'function') {
      return YL.cartAdapter.add(JSON.parse(JSON.stringify(box)), qty || 1);
    }
    var cart = YL.getCart();
    cart.push({
      id: 'ci' + Date.now() + Math.floor(Math.random() * 1000),
      qty: qty || 1,
      box: JSON.parse(JSON.stringify(box))
    });
    write(CART_KEY, cart);
    YL.emit('cart:change');
    return cart;
  };

  YL.updateCartQty = function (id, qty) {
    var cart = YL.getCart().map(function (i) {
      if (i.id === id) i.qty = Math.max(1, Math.min(99, qty));
      return i;
    });
    write(CART_KEY, cart);
    YL.emit('cart:change');
  };

  YL.removeFromCart = function (id) {
    write(CART_KEY, YL.getCart().filter(function (i) { return i.id !== id; }));
    YL.emit('cart:change');
  };

  YL.clearCart = function () {
    write(CART_KEY, []);
    YL.emit('cart:change');
  };

  YL.cartTotals = function (promoCode) {
    var cart = YL.getCart();
    var subtotal = cart.reduce(function (n, i) { return n + YL.boxPrice(i.box).total * i.qty; }, 0);
    var promo = promoCode ? YL.PROMOS[String(promoCode).toUpperCase()] : null;
    var discount = 0;
    if (promo) discount = promo.off ? subtotal * promo.off : Math.min(promo.flat, subtotal);
    var afterDiscount = subtotal - discount;
    var shipping = cart.length === 0 || afterDiscount >= YL.SHIPPING.freeOver ? 0 : YL.SHIPPING.flat;
    return {
      subtotal: subtotal,
      discount: discount,
      promo: promo,
      shipping: shipping,
      total: afterDiscount + shipping,
      freeShippingGap: Math.max(0, YL.SHIPPING.freeOver - afterDiscount)
    };
  };

  /* ---------- tiny event bus ---------- */
  var handlers = {};
  YL.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); };
  YL.emit = function (name, payload) {
    (handlers[name] || []).forEach(function (fn) { fn(payload); });
  };
})(window.YL);
