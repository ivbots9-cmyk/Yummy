/* =========================================================
   Yummyland — cart page
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';
  var $ = YL.$, $$ = YL.$$;
  var promo = '';

  function itemHtml(item) {
    var box = item.box;
    var size = YL.getSize(box.size);
    var price = YL.boxPrice(box);
    var recipe = YL.boxRecipe(box);
    var extras = box.extras.map(function (id) { return YL.getExtra(id).name; });
    var candyNames = box.candies.map(function (c) {
      return YL.getCandy(c.id).name + ' · ' + YL.weightLabel(c.qty * YL.PRICING.scoopOz);
    });

    return '<article class="cart-item">' +
      '<div class="cart-item__art">' +
      YL.boxArt({ color: box.color, recipe: recipe.length ? recipe : null, fill: 1, seed: item.id }) + '</div>' +
      '<div><h3>' + YL.esc(YL.boxLabel(box)) + '</h3>' +
      '<div class="meta">' + size.name + ' · ' + size.serves + ' · ' +
      YL.boxFillLabel(box) + ' packed</div>' +
      '<div class="tags">' + candyNames.map(function (n) { return '<span class="tag">' + YL.esc(n) + '</span>'; }).join('') +
      extras.map(function (n) { return '<span class="tag">＋ ' + YL.esc(n) + '</span>'; }).join('') + '</div>' +
      (box.note ? '<div class="meta" style="margin-top:8px">Gift note: “' + YL.esc(box.note) + '”</div>' : '') +
      (box.prefs ? '<div class="meta">Preferences: ' + YL.esc(box.prefs) + '</div>' : '') +
      '</div>' +
      '<div class="cart-item__side">' +
      '<span class="cart-item__price">' + YL.money(price.total * item.qty) + '</span>' +
      '<div class="qty"><button data-dec="' + item.id + '" aria-label="Decrease quantity">' + YL.icon('minus') + '</button>' +
      '<span>' + item.qty + '</span>' +
      '<button data-inc="' + item.id + '" aria-label="Increase quantity">' + YL.icon('plus') + '</button></div>' +
      '<button class="link-btn" data-remove="' + item.id + '">Remove</button>' +
      '</div></article>';
  }

  function render() {
    var host = $('#cart-items');
    var sum = $('#cart-summary');
    var cart = YL.getCart();

    if (!cart.length) {
      host.innerHTML = '<div class="empty">' +
        YL.boxArt({ color: 'pink', fill: 0.2, seed: 'empty' }) +
        '<h3>Your cart is empty</h3><p>Let&rsquo;s fix that — your candy box is only four steps away.</p>' +
        '<a class="btn btn--lg" href="' + YL.PATHS.builder + '">Build your box</a></div>';
      sum.innerHTML = '';
      return;
    }

    host.innerHTML = cart.map(itemHtml).join('') +
      '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:6px">' +
      '<a class="btn btn--ghost btn--sm" href="' + YL.PATHS.builder + '">＋ Build another box</a>' +
      '<button class="link-btn" data-clear>Clear cart</button></div>';

    var t = YL.cartTotals(promo);
    sum.innerHTML =
      '<div class="panel"><div class="panel__head"><h3>Order summary</h3></div>' +
      '<div class="panel__body">' +
      '<div class="promo"><input type="text" placeholder="Promo code" value="' + YL.esc(promo) + '" data-promo aria-label="Promo code">' +
      '<button class="btn btn--soft" data-apply>Apply</button></div>' +
      (t.promo ? '<p style="font-size:12.5px;color:var(--mint);font-weight:800;margin:0 0 8px">' +
        t.promo.label + ' applied!</p>' : '') +
      '<div class="lines" style="border-top:0;margin-top:0">' +
      lineRow('Subtotal', YL.money(t.subtotal)) +
      (t.discount ? lineRow('Discount', '−' + YL.money(t.discount)) : '') +
      lineRow('Shipping', t.shipping ? YL.money(t.shipping) : 'Free') +
      '<div class="line line--total"><span>Total</span><b>' + YL.money(t.total) + '</b></div>' +
      '</div>' +
      shipGoal(t) +
      '<div class="panel__cta"><button class="btn btn--lg" data-checkout>' + YL.icon('shield') + ' Checkout</button></div>' +
      '<div class="guarantee">' + YL.icon('heart') +
      '<span><b>Packed fresh with love</b>Every box is packed the day it ships.</span></div>' +
      '</div></div>' +
      '<p style="font-size:12px;color:var(--ink-40);text-align:center;margin-top:12px">' +
      'Demo store — checkout is simulated, no payment is taken.</p>';

    bind();
  }

  /* how close the cart is to free shipping — the single most reliable
     nudge for a bigger order */
  function shipGoal(t) {
    var goal = YL.SHIPPING.freeOver;
    var reached = t.freeShippingGap <= 0;
    var pct = Math.max(0, Math.min(100, ((goal - t.freeShippingGap) / goal) * 100));
    return '<div class="ship-goal' + (reached ? ' is-done' : '') + '">' +
      '<p>' + (reached
        ? 'Nice — <b>free shipping unlocked</b>.'
        : 'You are <b>' + YL.money(t.freeShippingGap) + '</b> away from free shipping.') + '</p>' +
      '<span class="ship-goal__bar"><i style="width:' + pct + '%"></i></span></div>';
  }

  function lineRow(label, value) {
    return '<div class="line"><span>' + label + '</span><b>' + value + '</b></div>';
  }

  function bind() {
    $$('[data-inc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = find(b.dataset.inc);
        YL.updateCartQty(item.id, item.qty + 1); render();
      });
    });
    $$('[data-dec]').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = find(b.dataset.dec);
        if (item.qty === 1) YL.removeFromCart(item.id);
        else YL.updateCartQty(item.id, item.qty - 1);
        render();
      });
    });
    $$('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () {
        YL.removeFromCart(b.dataset.remove);
        YL.toast('Box removed from cart.');
        render();
      });
    });
    var clear = $('[data-clear]');
    if (clear) clear.addEventListener('click', function () { YL.clearCart(); render(); });

    var apply = $('[data-apply]');
    if (apply) apply.addEventListener('click', function () {
      var val = $('[data-promo]').value.trim().toUpperCase();
      if (val && !YL.PROMOS[val]) { YL.toast('That promo code is not valid.'); return; }
      promo = val;
      render();
      if (val) YL.toast('Promo applied — enjoy!');
    });

    var checkout = $('[data-checkout]');
    if (checkout) checkout.addEventListener('click', function () {
      var t = YL.cartTotals(promo);
      var n = YL.cartCount();
      if (YL.track) {
        YL.track('begin_checkout', { value: t.total, coupon: promo || undefined });
        YL.track('purchase', {
          transaction_id: 'demo-' + Date.now(), value: t.total,
          shipping: t.shipping, coupon: promo || undefined,
          items: YL.getCart().map(function (i) { return YL.boxToItem(i.box); })
        });
      }
      YL.clearCart();
      promo = '';
      render();
      $('#cart-items').innerHTML = '<div class="empty tick-in">' +
        YL.boxArt({ color: 'mint', recipe: YL.mixedRecipe(), fill: 1, seed: 'thanks' }) +
        '<h3>Thank you! Order placed</h3>' +
        '<p>' + n + ' box' + (n > 1 ? 'es' : '') + ' · ' + YL.money(t.total) +
        '<br>We are packing it fresh — you will get a tracking email shortly.</p>' +
        '<a class="btn btn--lg" href="' + YL.PATHS.builder + '">Build another box</a></div>';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function find(id) {
    return YL.getCart().filter(function (i) { return i.id === id; })[0];
  }

  YL.initCart = function () { render(); };
})(window.YL);
