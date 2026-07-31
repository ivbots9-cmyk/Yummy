/* =========================================================
   Yummyland — shared chrome: header, footer, toasts
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var NAV = [
    { href: 'index.html', label: 'Build Your Box', key: 'build' },
    { href: 'boxes.html', label: 'Candy Boxes', key: 'boxes' },
    { href: 'about.html#office', label: 'Office & Events', key: 'office' },
    { href: 'faq.html', label: 'FAQ', key: 'faq' },
    { href: 'about.html', label: 'About', key: 'about' }
  ];

  YL.$ = function (sel, root) { return (root || document).querySelector(sel); };
  YL.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function logo(href) {
    return '<a class="logo" href="' + href + '" aria-label="Yummyland Candy — home">' + YL.logoMark() +
      '<span><span class="logo__txt">YUMMYLAND</span>' +
      '<span class="logo__sub">Candy that turns any moment into a party</span></span></a>';
  }

  YL.renderHeader = function (active) {
    var host = YL.$('#site-header');
    if (!host) return;
    host.className = 'header';
    host.innerHTML =
      '<div class="wrap header__in">' +
      logo('index.html') +
      '<nav class="nav" id="nav">' +
      NAV.map(function (n) {
        return '<a href="' + n.href + '"' + (n.key === active ? ' class="is-active"' : '') + '>' + n.label + '</a>';
      }).join('') +
      '</nav>' +
      '<div class="header__tools">' +
      '<a class="icon-btn" href="boxes.html" aria-label="Search boxes">' + YL.icon('search') + '</a>' +
      '<a class="icon-btn" href="about.html" aria-label="Account">' + YL.icon('user') + '</a>' +
      '<a class="icon-btn" href="cart.html" aria-label="Cart">' + YL.icon('cart') +
      '<span class="cart-count" data-cart-count hidden>0</span></a>' +
      '<button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false">' + YL.icon('burger') + '</button>' +
      '</div></div>';

    var burger = YL.$('#burger'), nav = YL.$('#nav');
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('is-open');
    });
    YL.refreshCartCount();
  };

  YL.refreshCartCount = function () {
    var n = YL.cartCount();
    YL.$$('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
      if (n > 0) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    });
  };

  YL.renderFooter = function () {
    var host = YL.$('#site-footer');
    if (!host) return;
    host.className = 'footer';
    host.innerHTML =
      '<div class="wrap"><div class="footer__grid">' +
      '<div class="footer__brand">' + logo('index.html') +
      '<p>Custom candy boxes made to share. Packed fresh, shipped fast, guaranteed to make someone smile.</p>' +
      '<div class="socials">' +
      ['instagram', 'tiktok', 'facebook', 'pinterest'].map(function (s) {
        return '<a href="#" aria-label="' + s + '">' + YL.icon(s) + '</a>';
      }).join('') + '</div></div>' +

      col('Shop', [
        ['index.html', 'Build Your Box'], ['boxes.html', 'Candy Boxes'],
        ['boxes.html#bulk', 'Bulk Candy'], ['boxes.html', 'Gift Cards']
      ]) +
      col('Help', [
        ['faq.html', 'FAQ'], ['faq.html#shipping', 'Shipping & Delivery'],
        ['faq.html#returns', 'Returns'], ['about.html#contact', 'Contact Us']
      ]) +
      col('Company', [
        ['about.html', 'Our Story'], ['about.html#office', 'Office & Events'],
        ['about.html#quality', 'Quality & Ingredients'], ['about.html#contact', 'Careers']
      ]) +

      '<div><h4>Join the Yummy Crew</h4>' +
      '<p style="font-size:13.5px;opacity:.92;margin:0">Get sweet deals, new drops and candy inspo.</p>' +
      '<form class="subscribe" data-subscribe>' +
      '<input type="email" required placeholder="Enter your email" aria-label="Email">' +
      '<button type="submit">Join</button></form></div>' +

      '</div><div class="footer__bottom">' +
      '<span>© ' + new Date().getFullYear() + ' Yummyland Candy Co. All rights reserved.</span>' +
      '<nav><a href="faq.html">Terms of Service</a><a href="faq.html">Privacy Policy</a><a href="faq.html">Accessibility</a></nav>' +
      '</div></div>';

    var form = YL.$('[data-subscribe]', host);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      YL.toast('You are on the list! Sweet deals incoming.');
    });
  };

  function col(title, links) {
    return '<div><h4>' + title + '</h4><ul>' +
      links.map(function (l) { return '<li><a href="' + l[0] + '">' + l[1] + '</a></li>'; }).join('') +
      '</ul></div>';
  }

  /* ---------- toast ---------- */
  var toastEl, toastTimer;
  YL.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = YL.icon('check') + '<span>' + YL.esc(msg) + '</span>';
    requestAnimationFrame(function () { toastEl.classList.add('is-on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  };

  YL.on('cart:change', function () { YL.refreshCartCount(); });

  /* ---------- shared page bootstrap ---------- */
  YL.initChrome = function (active) {
    YL.renderHeader(active);
    YL.renderFooter();
  };
})(window.YL);
