/* =========================================================
   Yummyland — cart page
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';
  var $ = YL.$, esc = YL.esc;
  var promo = '';

  function boxItem(item) {
    var box = item.box;
    var p = YL.boxPrice(box);
    var lid = YL.boxLid(box);
    return '<article class="cart-item">' +
      '<div class="cart-item__art">' + YL.giftBox(box, { compact: true }) + '</div>' +
      '<div class="cart-item__info"><h3>' + esc(YL.boxLabel(box)) + '</h3>' +
      '<p class="meta">' + esc(YL.boxSize(box).name) + ' · ' + YL.boxSize(box).cups + ' cups · ' + YL.boxSize(box).dims + '</p>' +
      '<ul class="tags">' + box.cups.map(function (id) {
        var c = YL.getCandy(id);
        return c ? '<li><i style="background:' + c.swatch + '"></i>' + esc(c.label) + '</li>' : '';
      }).join('') + '</ul>' +
      '<p class="meta">Lid: “' + esc(lid.headline) + '” · ' + (lid.mode === 'own' ? 'your photos' : lid.mode === 'none' ? 'no photos' : 'our photos') + '</p>' +
      box.extras.map(function (id) {
        var e = YL.getExtra(id);
        return '<p class="meta">＋ ' + esc(e.name) + ' · ' + YL.money(e.price) + '</p>';
      }).join('') +
      (box.extras.indexOf('card') > -1 && box.card.message
        ? '<p class="meta meta--card">“' + esc(box.card.message) + '”</p>' : '') +
      '</div>' + side(item, p.total) + '</article>';
  }

  function productItem(item) {
    var p = YL.getProduct(item.product);
    var c = YL.getCandy(p.candy);
    return '<article class="cart-item cart-item--prod">' +
      '<div class="cart-item__art cart-item__art--prod">' + (c ? YL.candyTile(c) : '') + '</div>' +
      '<div class="cart-item__info"><h3>' + esc(p.name) + '</h3><p class="meta">' + esc(p.desc) + '</p></div>' +
      side(item, p.price) + '</article>';
  }

  function side(item, unit) {
    return '<div class="cart-item__side">' +
      '<span class="cart-item__price">' + YL.money(unit * item.qty) + '</span>' +
      '<div class="qty"><button type="button" data-dec="' + item.id + '" aria-label="Decrease quantity">' + YL.icon('minus') + '</button>' +
      '<span>' + item.qty + '</span>' +
      '<button type="button" data-inc="' + item.id + '" aria-label="Increase quantity">' + YL.icon('plus') + '</button></div>' +
      '<button type="button" class="link-btn" data-remove="' + item.id + '">Remove</button></div>';
  }

  function render() {
    var host = $('#cart-items'), sum = $('#cart-summary');
    var cart = YL.getCart();

    if (!cart.length) {
      host.innerHTML = '<div class="empty"><span class="script">Your cart is empty</span>' +
        '<p>Pick a size, fill the cups, put your photos in the lid.</p>' +
        '<a class="btn btn--lg btn--gold" href="' + YL.PATHS.builder + '#builder">Build a gift box</a></div>';
      sum.innerHTML = '';
      return;
    }

    host.innerHTML = cart.map(function (i) { return i.kind === 'product' ? productItem(i) : boxItem(i); }).join('') +
      '<div class="cart-more"><a class="btn btn--line btn--sm" href="' + YL.PATHS.builder + '#builder">＋ Build another box</a>' +
      '<button type="button" class="link-btn" data-clear>Clear cart</button></div>' +
      '<section class="cart-extras"><h3 class="sub">Little extras</h3><div id="cart-products"></div></section>';
    YL.renderProducts('#cart-products');

    var t = YL.cartTotals(promo);
    sum.innerHTML = '<div class="panel"><h3 class="panel__title">Order summary</h3>' +
      '<div class="promo"><input type="text" placeholder="Promo code" value="' + esc(promo) + '" data-promo aria-label="Promo code">' +
      '<button type="button" class="btn btn--line btn--sm" data-apply>Apply</button></div>' +
      (t.promo ? '<p class="ok">' + t.promo.label + ' applied</p>' : '') +
      '<div class="lines">' + row('Subtotal', YL.money(t.subtotal)) +
      (t.discount ? row('Discount', '−' + YL.money(t.discount)) : '') +
      row('Shipping', t.shipping ? YL.money(t.shipping) : 'Free') +
      '<div class="line line--total"><span>Total</span><b>' + YL.money(t.total) + '</b></div></div>' +
      '<button type="button" class="btn btn--lg btn--gold btn--block" data-checkout>' + YL.icon('shield') + ' Checkout</button>' +
      '<p class="panel__note">' + YL.icon('gift') + ' Gift-ready: no prices inside the box.</p></div>' +
      '<p class="demo-note">Demo store — checkout is simulated, no payment is taken.</p>';
  }

  function row(l, v) { return '<div class="line"><span>' + l + '</span><b>' + v + '</b></div>'; }

  function find(id) { return YL.getCart().filter(function (i) { return i.id === id; })[0]; }

  function bind() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var d = b.dataset, item;
      if (d.inc) { item = find(d.inc); YL.updateCartQty(item.id, item.qty + 1); render(); }
      else if (d.dec) {
        item = find(d.dec);
        if (item.qty === 1) YL.removeFromCart(item.id); else YL.updateCartQty(item.id, item.qty - 1);
        render();
      } else if (d.remove) { YL.removeFromCart(d.remove); render(); }
      else if (b.hasAttribute('data-clear')) { YL.clearCart(); render(); }
      else if (d.prod) { setTimeout(render, 0); }
      else if (b.hasAttribute('data-apply')) {
        var val = $('[data-promo]').value.trim().toUpperCase();
        if (val && !YL.PROMOS[val]) { YL.toast('That promo code is not valid.'); return; }
        promo = val; render();
      } else if (b.hasAttribute('data-checkout')) {
        var t = YL.cartTotals(promo);
        if (YL.track) {
          YL.track('begin_checkout', { value: t.total, coupon: promo || undefined });
          YL.track('purchase', {
            transaction_id: 'demo-' + Date.now(), value: t.total, coupon: promo || undefined,
            items: YL.getCart().filter(function (i) { return i.kind !== 'product'; }).map(function (i) { return YL.boxToItem(i.box); })
          });
        }
        YL.clearCart();
        promo = '';
        render();
        $('#cart-items').innerHTML = '<div class="empty"><span class="script">Thank you</span>' +
          '<p>Order placed · ' + YL.money(t.total) + '<br>We are packing it by hand — your tracking email is on its way.</p>' +
          '<a class="btn btn--lg btn--gold" href="' + YL.PATHS.builder + '#builder">Build another box</a></div>';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  YL.initCart = function () { bind(); render(); };
})(window.YL);
