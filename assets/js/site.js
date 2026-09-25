/* =========================================================
   Yummyland — shared chrome: header, footer, toasts
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var NAV = [
    { href: 'index.html#builder', label: 'Build a Gift Box', key: 'build' },
    { href: 'boxes.html', label: 'Collections', key: 'boxes' },
    { href: 'gifts.html', label: 'Occasions', key: 'gifts' },
    { href: 'about.html', label: 'About us', key: 'about' },
    { href: 'about.html#corporate', label: 'Corporate', key: 'office' },
    { href: 'faq.html', label: 'FAQ', key: 'faq' }
  ];

  YL.$ = function (sel, root) { return (root || document).querySelector(sel); };
  YL.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function logo(href) {
    return '<a class="logo" href="' + href + '" aria-label="Yummyland — home">' +
      '<span class="logo__txt">YUMMYLAND<sup>®</sup></span>' +
      '<span class="logo__sub">A little happiness inside · since 2018</span></a>';
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
      '<p>A family candy company since 2018. Premium gummies, chocolate and classics, packed by hand into gift boxes with your photos inside the lid.</p>' +
      '<div class="socials">' +
      ['instagram', 'tiktok', 'facebook', 'pinterest'].map(function (s) {
        return '<a href="#" aria-label="' + s + '">' + YL.icon(s) + '</a>';
      }).join('') + '</div></div>' +

      col('Shop', [
        ['index.html#builder', 'Build a Gift Box'], ['boxes.html', 'Collections'],
        ['gifts.html', 'Occasions'], ['boxes.html#extras', 'Refill Pouches']
      ]) +
      col('Help', [
        ['faq.html', 'FAQ'], ['faq.html#shipping', 'Shipping'],
        ['faq.html#returns', 'Returns'], ['about.html#contact', 'Contact']
      ]) +
      col('Company', [
        ['about.html', 'Our Story'], ['about.html#corporate', 'Corporate Gifting'],
        ['about.html#quality', 'Our Candy']
      ]) +

      '<div><h4>Sweet letters</h4>' +
      '<p class="footer__note">New collections and seasonal lids, a few times a year.</p>' +
      '<form class="subscribe" data-subscribe>' +
      '<input type="email" required placeholder="Your email" aria-label="Email">' +
      '<button type="submit">Join</button></form></div>' +

      '</div><div class="footer__bottom">' +
      '<span>© ' + new Date().getFullYear() + ' Yummyland Candy Co. All rights reserved.</span>' +
      '<nav><a href="faq.html">Terms</a><a href="faq.html">Privacy</a><a href="faq.html">Accessibility</a></nav>' +
      '</div></div>';

    var form = YL.$('[data-subscribe]', host);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      YL.toast('You are on the list.');
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


  /* ---------- announcement bar (rotates through YL.ANNOUNCE) ---------- */
  YL.renderAnnounce = function () {
    var items = YL.ANNOUNCE;
    if (!items) return;
    if (!Array.isArray(items)) items = [items];
    items = items.filter(function (i) { return i && i.text; });
    if (!items.length) return;

    var el = document.createElement('div');
    el.className = 'announce';
    el.innerHTML = '<div class="wrap announce__in">' +
      items.map(function (it, i) {
        return '<span class="announce__item' + (i === 0 ? ' is-on' : '') + '"' +
          (i === 0 ? '' : ' aria-hidden="true"') + '>' +
          (it.icon ? YL.icon(it.icon) : '') + '<span>' + it.text + '</span>' +
          (it.link ? '<a href="' + it.link + '">' + it.linkText + ' &rarr;</a>' : '') +
          '</span>';
      }).join('') + '</div>';
    document.body.insertBefore(el, document.body.firstChild);

    if (items.length < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var slides = YL.$$('.announce__item', el);
    var i = 0, timer = null;

    function step() {
      var prev = slides[i];
      prev.classList.remove('is-on');
      prev.classList.add('is-out');
      prev.setAttribute('aria-hidden', 'true');
      setTimeout(function () { prev.classList.remove('is-out'); }, 520);
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
      slides[i].removeAttribute('aria-hidden');
    }

    function play() { if (!timer) timer = setInterval(step, YL.ANNOUNCE_INTERVAL || 5000); }
    function pause() { clearInterval(timer); timer = null; }

    play();
    /* never swap the line out from under someone reading or clicking it */
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', play);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else play();
    });
  };

  /* ---------- trust bar ---------- */
  YL.renderTrust = function (sel) {
    var host = YL.$(sel);
    if (!host) return;
    host.innerHTML = '<div class="trust">' + YL.TRUST.map(function (t) {
      return '<div class="trust__item">' + YL.icon(t.icon) +
        '<span><b>' + t.title + '</b>' + t.text + '</span></div>';
    }).join('') + '</div>';
  };

  /* ---------- shared page bootstrap ----------
     Page bootstraps are a flat list of independent render calls. Left
     bare, the first one that throws takes every section below it with
     it — a broken hero blanks the whole marketing page while the
     builder above keeps working, which is confusing and invisible.
     Each call goes through YL.boot so a failure costs one block and
     says so in the console. */
  YL.boot = function (label, fn) {
    try {
      fn();
    } catch (e) {
      if (window.console && console.error) {
        console.error('[Yummyland] "' + label + '" failed to render:', e);
      }
    }
  };

  YL.initChrome = function (active) {
    YL.boot('announce bar', function () { YL.renderAnnounce(); });
    YL.boot('header', function () { YL.renderHeader(active); });
    YL.boot('footer', function () { YL.renderFooter(); });
  };
})(window.YL);
