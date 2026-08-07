/* =========================================================
   Yummyland — runtime configuration
   Loaded first, before every other script.

   This is the only file that needs to change when the site
   moves to another platform (Shopify, a custom backend…):
   the builder itself never hardcodes URLs or a cart.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  /* Where the pages live. Static build uses plain files;
     the Shopify adapter overrides these with theme routes. */
  YL.PATHS = YL.PATHS || {
    builder: 'index.html',
    boxes: 'boxes.html',
    cart: 'cart.html'
  };

  /* Cart back end.
     - null            → the built-in localStorage cart (static site / demo)
     - {add: fn}       → e.g. assets/js/shopify-cart.js posts to /cart/add.js
     Set by the adapter script, not here. */
  YL.cartAdapter = YL.cartAdapter || null;

  /* Where candy photos come from.
     Every candy carries `img` — its Shopify CDN url — and, once
     `node tools/fetch-photos.js` has run, a `photo` filename too.
     With PHOTO_BASE set, the local copy wins and the site has no
     external dependencies; the Shopify build sets it to '' so the
     theme keeps serving the same files off the Shopify CDN. */
  YL.PHOTO_BASE = YL.PHOTO_BASE == null ? 'assets/img/candy/' : YL.PHOTO_BASE;

  /* Store settings used by the price summary. */
  YL.CURRENCY = 'USD';
})(window.YL);
