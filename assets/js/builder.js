/* =========================================================
   Yummyland — the box builder
   Renders every step, keeps the live preview + price in sync
   and persists the draft box between visits.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';

  var $ = YL.$, $$ = YL.$$;
  var box, filter = 'all', showAll = false, traits = [];

  var STEPS = [
    { id: 'step-size', t: 'Choose box', d: 'Small to party size' },
    { id: 'step-candy', t: 'Scoop it full', d: '4 oz per scoop' },
    { id: 'step-vibe', t: 'Choose vibe', d: 'Set the mood' },
    { id: 'step-extras', t: 'Add extras', d: 'Notes & goodies' },
    { id: 'step-review', t: 'Review', d: 'Check out your box' }
  ];

  /* ------------------------------------------------------------------ */
  /* state helpers — capacity is counted in 4 oz scoops                  */
  /* ------------------------------------------------------------------ */
  function slots() { return YL.boxCapacity(box); }
  function used() { return YL.boxScoopsUsed(box); }
  function left() { return slots() - used(); }
  function oz(scoops) { return YL.weightLabel(scoops * YL.PRICING.scoopOz); }
  function qtyOf(id) {
    for (var i = 0; i < box.candies.length; i++) if (box.candies[i].id === id) return box.candies[i].qty;
    return 0;
  }
  function hasExtra(id) { return box.extras.indexOf(id) > -1; }

  function persist() { YL.saveDraft(box); }

  function addCandy(id, silent) {
    if (left() <= 0) {
      if (!silent) YL.toast('That is a full ' + oz(slots()) + ' — drop a scoop or size up.');
      return false;
    }
    var found = false;
    box.candies.forEach(function (c) { if (c.id === id) { c.qty++; found = true; } });
    if (!found) box.candies.push({ id: id, qty: 1 });
    persist();
    return true;
  }

  function removeCandy(id, all) {
    box.candies = box.candies.reduce(function (acc, c) {
      if (c.id !== id) { acc.push(c); return acc; }
      if (!all && c.qty > 1) { c.qty--; acc.push(c); }
      return acc;
    }, []);
    persist();
  }

  /* Shrinking the box (or dropping the extra-scoop add-on) trims the
     last scoops off the end rather than silently overfilling. */
  function trimToFit() {
    var over = used() - slots();
    while (over > 0 && box.candies.length) {
      var last = box.candies[box.candies.length - 1];
      var take = Math.min(last.qty, over);
      last.qty -= take;
      over -= take;
      if (last.qty === 0) box.candies.pop();
    }
  }

  function setSize(id) {
    box.size = id;
    trimToFit();
    persist();
  }

  function fillRandom(pool) {
    var list = (pool || YL.CANDIES.map(function (c) { return c.id; })).slice();
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    box.candies = [];
    var i2 = 0;
    while (left() > 0) {
      addCandy(list[i2 % list.length], true);
      i2++;
      if (i2 > 200) break;
    }
    persist();
  }

  /* ------------------------------------------------------------------ */
  /* render: step chips                                                  */
  /* ------------------------------------------------------------------ */
  function renderSteps() {
    var host = $('#steps');
    if (!host) return;
    /* Five chips do not fit a phone, and a strip cut off mid-word looks
       broken rather than scrollable. Narrow screens get a plain "step 2
       of 5" with a bar instead — same job (you are here, this is how far
       it goes) with nothing hidden off the edge. */
    host.innerHTML =
      '<div class="steps__now"><b data-now-n></b><span data-now-t></span>' +
      '<i class="steps__bar"><s data-now-bar></s></i></div>' +
      STEPS.map(function (s, i) {
        return '<button class="step-chip" data-goto="' + s.id + '" data-step="' + i + '">' +
          '<span class="step-chip__n">' + (i + 1) + '</span>' +
          '<span><span class="step-chip__t">' + s.t + '</span>' +
          '<span class="step-chip__d">' + s.d + '</span></span></button>' +
          (i < STEPS.length - 1 ? '<span class="steps__sep"></span>' : '');
      }).join('');
    host.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-goto]');
      if (!btn) return;
      var el = document.getElementById(btn.dataset.goto);
      if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }

  function markSteps() {
    var chips = $$('.step-chip');
    if (!chips.length) return;
    var y = window.scrollY + 220;
    var active = 0;
    STEPS.forEach(function (s, i) {
      var el = document.getElementById(s.id);
      if (el && el.offsetTop <= y) active = i;
    });
    chips.forEach(function (c, i) {
      c.classList.toggle('is-active', i === active);
      c.classList.toggle('is-done', isStepDone(i) && i !== active);
    });

    var n = $('[data-now-n]'), t = $('[data-now-t]'), bar = $('[data-now-bar]');
    if (n) n.textContent = 'Step ' + (active + 1) + ' of ' + STEPS.length;
    if (t) t.textContent = STEPS[active].t;
    if (bar) bar.style.width = ((active + 1) / STEPS.length * 100) + '%';

    /* On the widths where the chips do still scroll, keep the live one
       in view so the strip visibly follows along. */
    var host = $('#steps');
    if (host && host.scrollWidth > host.clientWidth + 4) {
      var el = chips[active];
      if (el) {
        var want = el.offsetLeft - (host.clientWidth - el.offsetWidth) / 2;
        if (Math.abs(host.scrollLeft - want) > 8) {
          host.scrollTo({ left: Math.max(0, want), behavior: 'smooth' });
        }
      }
    }
    markPeek();
  }

  /* The floating peek only earns its spot once the builder is in view. */
  function markPeek() {
    var fab = $('#peek-fab');
    var builder = document.getElementById('builder');
    if (!fab || !builder) return;
    var live = builder.getBoundingClientRect().top < window.innerHeight * 0.6;
    fab.classList.toggle('is-live', live);
    if (!live) YL.togglePeek(false);
  }

  function isStepDone(i) {
    if (i === 0) return !!box.size;
    if (i === 1) return used() > 0;
    if (i === 2) return !!box.vibe;
    if (i === 3) return box.extras.length > 0;
    return used() === slots();
  }

  /* ------------------------------------------------------------------ */
  /* render: step 1 — size                                               */
  /* ------------------------------------------------------------------ */
  function renderSize() {
    var host = $('#step-size');
    if (!host) return;
    var pct = slots() ? Math.min(100, (used() / slots()) * 100) : 0;
    var size = YL.getSize(box.size);
    /* The size cards answer one question — how big and how much. The
       weight belongs on the meter below, where it reads as "this is how
       much candy you get" rather than as a price per pound. */
    host.innerHTML =
      head(1, 'Step 1: Choose your box', 'Pick the size, then scoop it full.') +
      '<div class="sizes">' + YL.SIZES.map(function (s) {
        return '<button class="size' + (s.id === box.size ? ' is-on' : '') + '" data-size="' + s.id + '" ' +
          'aria-pressed="' + (s.id === box.size) + '">' +
          '<span class="tick">' + YL.icon('check') + '</span>' +
          YL.boxIcon(0.5 + YL.SIZES.indexOf(s) * 0.16) +
          '<b>' + s.name + '</b>' +
          '<span class="size__scoops">' + s.scoops + ' scoops</span>' +
          '<span>' + s.serves + '</span>' +
          '<span class="price">' + YL.money(s.price) + '</span></button>';
      }).join('') + '</div>' +
      '<div class="capacity">' +
      '<b>' + size.name + ' · ' + YL.weightLabel(size.oz) + ' of candy</b>' +
      '<span class="meter"><i style="width:' + pct + '%"></i></span>' +
      '<span class="count">' + oz(used()) + ' / ' + oz(slots()) + '</span></div>';

    $$('[data-size]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var before = used();
        setSize(b.dataset.size);
        if (YL.trackStep) YL.trackStep('size', { size: b.dataset.size });
        if (used() < before) YL.toast('Trimmed to fit your new box size.');
        renderAll();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* render: step 2 — candy                                              */
  /* ------------------------------------------------------------------ */
  function renderCandy() {
    var host = $('#step-candy');
    if (!host) return;
    /* The wall is built from tiles, not candies: a product sold in many
       single flavours takes one tile and opens a picker. */
    var list = YL.candyTiles().filter(function (t) { return YL.tileMatches(t, filter, traits); });
    var visible = showAll ? list : list.slice(0, 16);
    var full = left() <= 0;

    host.innerHTML =
      head(2, 'Step 2: Scoop it full',
        'Every tap adds one 4 oz scoop. Tap the same candy twice for a double scoop.',
        '<span class="badge">' + oz(used()) + ' / ' + oz(slots()) + '</span>') +
      quickMix() +
      '<div class="filters">' + YL.CATEGORIES.map(function (c) {
        return '<button class="filter' + (c.id === filter ? ' is-on' : '') + '" data-filter="' + c.id + '">' + c.name + '</button>';
      }).join('') + '</div>' +
      '<div class="filters filters--diet">' +
      '<span class="filters__label">Good to know</span>' +
      YL.TRAITS.map(function (d) {
        return '<button class="filter filter--diet' + (traits.indexOf(d.id) > -1 ? ' is-on' : '') +
          '" data-trait="' + d.id + '">' + YL.icon(d.icon) + d.name + '</button>';
      }).join('') +
      (traits.length ? '<button class="link-btn" data-trait-clear>Clear</button>' : '') +
      '</div>' +
      '<div class="candies">' + visible.map(function (t) {
        return t.type === 'group' ? groupCard(t.group, t.members, full) : candyCard(t.candy, full);
      }).join('') + '</div>' +
      (list.length > 16 ? '<div class="more-row"><button class="btn btn--soft" data-toggle-more>' +
        (showAll ? 'Show fewer candies' : 'Show more candies (' + (list.length - 16) + ')') + '</button></div>' : '') +
      (list.length === 0 ? '<p class="center" style="color:var(--ink-40)">Nothing matches those filters — try clearing one.</p>' : '') +
      '<p class="candies__note">' + YL.icon('note') +
      ' Allergens change with the recipe, so we point you at the pack rather than guessing. ' +
      'Tell us what to leave out in step 4 and we read it before we scoop.</p>';

    $$('[data-preset]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var preset = YL.PRESETS.filter(function (p) { return p.id === b.dataset.preset; })[0];
        if (!preset) return;
        fillRandom(preset.candies);
        renderAll();
        YL.toast(preset.name + ' box built — swap anything you like.');
      });
    });
    $$('[data-filter]', host).forEach(function (b) {
      b.addEventListener('click', function () { filter = b.dataset.filter; showAll = false; renderCandy(); });
    });
    $$('[data-trait]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.trait, i = traits.indexOf(id);
        if (i > -1) traits.splice(i, 1); else traits.push(id);
        showAll = false;
        renderCandy();
      });
    });
    var clr = $('[data-trait-clear]', host);
    if (clr) clr.addEventListener('click', function () { traits = []; renderCandy(); });
    var more = $('[data-toggle-more]', host);
    if (more) more.addEventListener('click', function () { showAll = !showAll; renderCandy(); });

    $$('[data-add]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        if (addCandy(b.dataset.add)) {
          renderAll();
          flash(b.dataset.add);
          if (YL.trackStep) YL.trackStep('candy', { candy: b.dataset.add });
        }
      });
    });
    $$('[data-inc]', host).forEach(function (b) {
      b.addEventListener('click', function () { if (addCandy(b.dataset.inc)) renderAll(); });
    });
    $$('[data-dec]', host).forEach(function (b) {
      b.addEventListener('click', function () { removeCandy(b.dataset.dec); renderAll(); });
    });
    $$('[data-flavors]', host).forEach(function (b) {
      b.addEventListener('click', function () { openFlavors(b.dataset.flavors); });
    });
  }

  /* ------------------------------------------------------------------ */
  /* the flavour picker                                                  */
  /* ------------------------------------------------------------------ */

  /* how many scoops of a whole group are in the box */
  function groupQty(members) {
    return members.reduce(function (n, c) { return n + qtyOf(c.id); }, 0);
  }

  function groupCard(g, members, full) {
    var q = groupQty(members);
    var picked = members.filter(function (c) { return qtyOf(c.id) > 0; });
    /* Show what is actually in the box rather than the generic blurb —
       once you have chosen, the tile should confirm the choice. */
    var body = picked.length
      ? '<p class="candy__about candy__about--picked">' + YL.icon('check') + ' ' +
        picked.map(function (c) {
          return YL.esc(c.name.replace(/^(Frooties|Jolly Rancher|Smarties|Starburst)\s+/, '')) +
            (qtyOf(c.id) > 1 ? ' ×' + qtyOf(c.id) : '');
        }).join(', ') + '</p>'
      : '<p class="candy__about">' + g.about + '</p>';

    return '<div class="candy candy--group' + (q ? ' is-on' : '') + (full && !q ? ' is-full' : '') +
      '" data-candy="' + g.id + '">' +
      '<span class="candy__tag candy__tag--mint">' + members.length + ' flavours</span>' +
      '<div class="candy__art">' + YL.groupTile(g, members) +
      '<span class="candy__scoop">' + YL.PRICING.scoopOz + ' oz scoop</span>' +
      (q ? '<span class="candy__count">' + q + '</span>' : '') + '</div>' +
      '<b>' + g.name + '</b><small>' + g.flavor + '</small>' + body +
      '<button class="candy__add candy__add--pick" data-flavors="' + g.id + '">' +
      YL.icon('sparkle') + (q ? 'Change flavours' : 'Choose flavour') + '</button></div>';
  }

  var flavorEsc = null;

  function openFlavors(groupId) {
    var g = YL.getGroup(groupId);
    if (!g) return;
    closeFlavors();

    var wrap = document.createElement('div');
    wrap.className = 'fsheet';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', g.name + ' flavours');
    wrap.innerHTML =
      '<div class="fsheet__back" data-fclose></div>' +
      '<div class="fsheet__panel">' +
      '<button class="fsheet__x" data-fclose aria-label="Close flavour picker"></button>' +
      '<div class="fsheet__head"><b>' + g.name + '</b>' +
      '<p>' + g.about + '</p>' +
      '<span class="fsheet__meter" data-fmeter></span></div>' +
      '<div class="fsheet__list" data-flist></div>' +
      '<div class="fsheet__foot"><button class="btn btn--block" data-fclose>Done</button></div>' +
      '</div>';
    document.body.appendChild(wrap);
    document.body.classList.add('no-scroll');

    drawFlavors(g);

    $$('[data-fclose]', wrap).forEach(function (b) {
      b.addEventListener('click', closeFlavors);
    });
    flavorEsc = function (e) { if (e.key === 'Escape') closeFlavors(); };
    document.addEventListener('keydown', flavorEsc);
    var first = $('.fsheet__x', wrap);
    if (first) first.focus();
  }

  function drawFlavors(g) {
    var wrap = $('.fsheet');
    if (!wrap) return;
    var members = YL.groupMembers(g.id);
    var host = $('[data-flist]', wrap);
    var full = left() <= 0;

    host.innerHTML = members.map(function (c) {
      var q = qtyOf(c.id);
      var control = q > 0
        ? '<div class="qty"><button data-fdec="' + c.id + '" aria-label="Remove one scoop of ' + YL.esc(c.name) + '">' +
          YL.icon('minus') + '</button><span>' + q + ' × ' + YL.PRICING.scoopOz + ' oz</span>' +
          '<button data-finc="' + c.id + '" aria-label="Add another scoop of ' + YL.esc(c.name) + '">' + YL.icon('plus') + '</button></div>'
        : '<button class="candy__add" data-fadd="' + c.id + '"' + (full ? ' disabled' : '') + '>' +
          YL.icon('plus') + (full ? ' Box is full' : ' Add scoop' + (c.extra ? ' · +' + YL.money(c.extra) : '')) + '</button>';
      return '<div class="frow' + (q ? ' is-on' : '') + '">' +
        /* square thumb, so the generated pile fills it instead of
           letterboxing inside the card's 150x104 box */
        '<div class="frow__art">' + YL.candyTile(c, { w: 104, h: 104, px: 220 }) + '</div>' +
        '<div class="frow__body"><b>' + c.name + '</b>' +
        '<small>' + c.flavor + (c.pieces ? ' · ~' + c.pieces + ' pcs a scoop' : '') + '</small>' +
        (c.about ? '<p>' + c.about + '</p>' : '') + control + '</div></div>';
    }).join('');

    var meter = $('[data-fmeter]', wrap);
    if (meter) {
      var q = groupQty(members);
      meter.innerHTML = oz(used()) + ' / ' + oz(slots()) + ' packed' +
        (q ? ' · ' + q + ' from this range' : '');
    }

    $$('[data-fadd]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        if (addCandy(b.dataset.fadd)) {
          if (YL.trackStep) YL.trackStep('candy', { candy: b.dataset.fadd });
          afterFlavorChange(g);
        }
      });
    });
    $$('[data-finc]', host).forEach(function (b) {
      b.addEventListener('click', function () { if (addCandy(b.dataset.finc)) afterFlavorChange(g); });
    });
    $$('[data-fdec]', host).forEach(function (b) {
      b.addEventListener('click', function () { removeCandy(b.dataset.fdec); afterFlavorChange(g); });
    });
  }

  /* Keep the sheet open while the box, the meter and the tile behind it
     all catch up — picking four flavours should be four taps, not four
     round trips through the wall. */
  function afterFlavorChange(g) {
    renderAll();
    drawFlavors(g);
  }

  function closeFlavors() {
    var wrap = $('.fsheet');
    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
    document.body.classList.remove('no-scroll');
    if (flavorEsc) { document.removeEventListener('keydown', flavorEsc); flavorEsc = null; }
  }

  function candyCard(c, full) {
    var q = qtyOf(c.id);
    var tag = c.tag === 'premium'
      ? '<span class="candy__tag">Premium</span>'
      : (c.tag ? '<span class="candy__tag candy__tag--mint">' + c.tag + '</span>' : '');
    /* how much of it you actually get, which is the whole point of a scoop */
    var scoop = '<span class="candy__scoop">' + YL.PRICING.scoopOz + ' oz scoop' +
      (c.pieces ? ' · ~' + c.pieces + ' pcs' : '') + '</span>';
    var control = q > 0
      ? '<div class="qty"><button data-dec="' + c.id + '" aria-label="Remove one scoop of ' + YL.esc(c.name) + '">' + YL.icon('minus') + '</button>' +
        '<span>' + q + ' × ' + YL.PRICING.scoopOz + ' oz</span>' +
        '<button data-inc="' + c.id + '" aria-label="Add another scoop of ' + YL.esc(c.name) + '">' + YL.icon('plus') + '</button></div>'
      : '<button class="candy__add" data-add="' + c.id + '">' + YL.icon('plus') + ' Add scoop' +
        (c.extra ? ' · +' + YL.money(c.extra) : '') + '</button>';
    return '<div class="candy' + (q ? ' is-on' : '') + (full && !q ? ' is-full' : '') + '" data-candy="' + c.id + '">' +
      tag + '<div class="candy__art">' + YL.candyTile(c) + scoop + '</div>' +
      '<b>' + c.name + '</b><small>' + c.flavor + '</small>' +
      (c.about ? '<p class="candy__about">' + c.about + '</p>' : '') + control + '</div>';
  }

  function flash(id) {
    var el = $('[data-candy="' + id + '"]');
    if (el) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
  }

  /* ------------------------------------------------------------------ */
  /* render: step 3 — vibe                                               */
  /* ------------------------------------------------------------------ */
  function renderVibe() {
    var host = $('#step-vibe');
    if (!host) return;
    host.innerHTML =
      head(3, 'Step 3: Choose your vibe', 'We match the packing style, card and stickers to the occasion.',
        '<span class="opt">Optional</span>') +
      '<div class="vibes">' + YL.VIBES.map(function (v) {
        return '<button class="vibe' + (v.id === box.vibe ? ' is-on' : '') + '" data-vibe="' + v.id + '">' +
          YL.icon(v.icon) + '<b>' + v.name + '</b></button>';
      }).join('') + '</div>';

    $$('[data-vibe]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        box.vibe = b.dataset.vibe;
        persist();
        if (box.vibe === 'surprise') {
          fillRandom();
          YL.toast('Surprise! We filled your box with a random mix.');
        }
        renderAll();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* render: step 4 — extras                                             */
  /* ------------------------------------------------------------------ */
  function renderExtras() {
    var host = $('#step-extras');
    if (!host) return;
    host.innerHTML =
      head(4, 'Step 4: Add extras', 'Make your box even more special.', '<span class="opt">Optional</span>') +
      '<div class="extras">' + YL.EXTRAS.map(function (e) {
        return '<button class="extra' + (hasExtra(e.id) ? ' is-on' : '') + '" data-extra="' + e.id + '" ' +
          'aria-pressed="' + hasExtra(e.id) + '">' +
          '<span class="box">' + YL.icon('check') + '</span>' +
          YL.icon(e.icon, 'ico') +
          '<span><b>' + e.name + '</b><small>' + e.desc + '</small>' +
          '<span class="cost">' + (e.price ? '+' + YL.money(e.price) : 'Free') + '</span></span></button>';
      }).join('') + '</div>' +
      (hasExtra('scoop')
        ? '<p class="extras__note">' + YL.icon('check') + ' Your box now holds <b>' + oz(slots()) +
          '</b> — go back to step 2 and scoop the extra 4 oz.</p>'
        : '') +

      (hasExtra('theme')
        ? '<div class="swatches" data-swatches><span style="font-size:12.5px;font-weight:800">Box color:</span>' +
          YL.BOX_THEMES.map(function (t) {
            return '<button class="swatch' + (box.color === t.id ? ' is-on' : '') + '" data-color="' + t.id +
              '" style="background:' + t.hex + '" title="' + t.name + '" aria-label="' + t.name + '"></button>';
          }).join('') + '</div>'
        : '') +

      (hasExtra('note')
        ? '<div class="note-field"><textarea maxlength="200" data-note placeholder="Write your gift note (we hand-write it on a Yummyland card)">' +
          YL.esc(box.note || '') + '</textarea><span class="counter"><span data-note-count>' +
          (box.note || '').length + '</span> / 200</span></div>'
        : '') +

      '<div class="note-field"><textarea maxlength="200" data-prefs placeholder="Candy preferences or allergies (optional)">' +
      YL.esc(box.prefs || '') + '</textarea><span class="counter"><span data-prefs-count>' +
      (box.prefs || '').length + '</span> / 200</span></div>';

    $$('[data-extra]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.extra;
        if (hasExtra(id)) box.extras = box.extras.filter(function (x) { return x !== id; });
        else box.extras.push(id);
        var e = YL.getExtra(id);
        if (e && e.addsScoop) {
          trimToFit();                       /* dropping it shrinks the box */
          YL.toast(hasExtra(id)
            ? 'Room for one more scoop — you can now pack ' + oz(slots()) + '.'
            : 'Back to ' + oz(slots()) + '.');
        }
        persist();
        renderAll();
      });
    });
    $$('[data-color]', host).forEach(function (b) {
      b.addEventListener('click', function () { box.color = b.dataset.color; persist(); renderAll(); });
    });
    bindText($('[data-note]', host), 'note', $('[data-note-count]', host));
    bindText($('[data-prefs]', host), 'prefs', $('[data-prefs-count]', host));
  }

  function bindText(el, key, counter) {
    if (!el) return;
    el.addEventListener('input', function () {
      box[key] = el.value;
      if (counter) counter.textContent = el.value.length;
      persist();
      renderReview();
    });
  }

  /* ------------------------------------------------------------------ */
  /* render: step 5 — review                                             */
  /* ------------------------------------------------------------------ */
  function renderReview() {
    var host = $('#step-review');
    if (!host) return;
    var p = YL.boxPrice(box);
    var size = YL.getSize(box.size);
    var vibe = YL.VIBES.filter(function (v) { return v.id === box.vibe; })[0];
    var extras = box.extras.map(function (id) { return YL.getExtra(id).name; });

    host.innerHTML =
      head(5, 'Step 5: Review your box', 'Everything look good? Then let us get packing.') +
      '<div class="review-grid" style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px">' +
      '<div>' + YL.boxArt({ color: box.color, recipe: recipeOrNull(), fill: fillRatio(), seed: 'review' }) + '</div>' +
      '<div>' +
      row('Box size', size.name + ' · ' + YL.weightLabel(size.oz) + ' · ' + size.serves, 'step-size') +
      row('Fill weight', oz(used()) + ' of ' + oz(slots()) +
        (left() > 0 ? ' <span class="warn">— ' + oz(left()) + ' still empty</span>' : ' — packed full'), 'step-candy') +
      row('Candies', used() ? box.candies.map(function (c) {
        return YL.getCandy(c.id).name + ' (' + oz(c.qty) + ')';
      }).join(', ') : 'Nothing scooped yet', 'step-candy') +
      row('Vibe', vibe ? vibe.name : '—', 'step-vibe') +
      row('Extras', extras.length ? extras.join(', ') : 'None', 'step-extras') +
      (box.note ? row('Gift note', '“' + YL.esc(box.note) + '”', 'step-extras') : '') +
      (box.prefs ? row('Preferences', YL.esc(box.prefs), 'step-extras') : '') +
      '<div class="lines">' +
      line('Box price (' + YL.weightLabel(size.oz) + ')', YL.money(p.base)) +
      line('Premium scoops', p.premium ? YL.money(p.premium) : '$0.00') +
      line('Extras', p.extras ? YL.money(p.extras) : '$0.00') +
      '<div class="line line--total"><span>Estimated total</span><b>' + YL.money(p.total) + '</b></div>' +
      '</div>' +
      '<button class="btn btn--lg btn--block" data-add-cart style="margin-top:16px">' +
      YL.icon('cart') + ' Add to cart</button>' +
      '</div></div>';

    $$('[data-jump]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        document.getElementById(b.dataset.jump).scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
    var cta = $('[data-add-cart]', host);
    if (cta) cta.addEventListener('click', addToCart);
  }

  function row(label, value, jump) {
    return '<div style="display:flex;gap:10px;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:1px solid var(--line)">' +
      '<span style="font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-40);flex:none">' + label + '</span>' +
      '<span style="text-align:right;font-size:13.5px">' + value + '</span>' +
      '<button class="link-btn" data-jump="' + jump + '">Edit</button></div>';
  }
  function line(label, value) {
    return '<div class="line"><span>' + label + '</span><b>' + value + '</b></div>';
  }

  /* ------------------------------------------------------------------ */
  /* render: live preview panel                                          */
  /* ------------------------------------------------------------------ */
  function fillRatio() { return slots() ? used() / slots() : 0; }
  function recipeOrNull() {
    var r = YL.boxRecipe(box);
    return r.length ? r : null;
  }

  function renderPanel() {
    var host = $('#panel');
    if (!host) return;
    var p = YL.boxPrice(box);
    var size = YL.getSize(box.size);
    var theme = YL.BOX_THEMES.filter(function (t) { return t.id === box.color; })[0];
    var pct = Math.min(100, fillRatio() * 100);

    var chips = box.candies.map(function (c) {
      var candy = YL.getCandy(c.id);
      return '<span class="chip">' + YL.candyDot(candy, 22) + ' ' + candy.name + ' · ' + oz(c.qty) +
        '<button class="x" data-drop="' + c.id + '" aria-label="Remove ' + YL.esc(candy.name) + '">' + YL.icon('x') + '</button></span>';
    }).join('');
    var openSlots = left();
    if (openSlots > 0) {
      chips += '<span class="chip chip--slot">+ ' + oz(openSlots) + ' still free</span>';
    }

    host.innerHTML =
      '<div class="panel__head"><h3>Your box preview</h3>' +
      '<span class="badge">' + YL.weightLabel(size.oz) + '</span></div>' +
      '<div class="panel__stage">' + YL.boxArt({ color: box.color, recipe: recipeOrNull(), fill: fillRatio(), seed: 'panel' }) + '</div>' +
      '<div class="panel__body">' +
      '<div class="capacity" style="margin:0 0 14px"><b>' + oz(used()) + ' / ' + oz(slots()) + '</b>' +
      '<span class="meter"><i style="width:' + pct + '%"></i></span>' +
      '<span class="count">' + (openSlots > 0 ? oz(openSlots) + ' to go' : 'Packed full!') + '</span></div>' +
      '<div class="chips">' + chips + '</div>' +
      '<div class="lines">' +
      line('Box (' + YL.weightLabel(size.oz) + ')', YL.money(p.base)) +
      line('Premium scoops', p.premium ? YL.money(p.premium) : '$0.00') +
      line('Extras' + (box.extras.length ? ' (' + box.extras.length + ')' : ''), p.extras ? YL.money(p.extras) : '$0.00') +
      (theme && hasExtra('theme') ? line('Box color', theme.name) : '') +
      '<div class="line line--total"><span>Total</span><b>' + YL.money(p.total) + '</b></div>' +
      '<div class="line ' + (p.total >= YL.SHIPPING.freeOver ? 'line--free' : '') + '"><span>Shipping</span><b>' +
      (p.total >= YL.SHIPPING.freeOver ? 'Free' : 'Calculated at checkout') + '</b></div>' +
      '</div>' +
      '<div class="panel__cta">' +
      '<button class="btn btn--lg" data-add-cart>' + YL.icon('cart') + ' Add to cart</button>' +
      '<button class="btn btn--ghost" data-save>' + YL.icon('heart') + ' Save my box</button>' +
      '</div>' +
      '<div class="guarantee">' + YL.icon('shield') +
      '<span><b>100% happiness guarantee</b>Not happy? We will make it right.</span></div>' +
      '</div>' +
      /* phone-only bar so the total and the CTA are always in reach */
      '<div class="mbar"><span class="mbar__info"><b>' + YL.money(p.total) + '</b>' +
      '<span>' + oz(used()) + ' / ' + oz(slots()) + ' packed</span></span>' +
      '<button class="btn" data-add-cart>' + YL.icon('cart') + ' Add to cart</button></div>';

    $$('[data-drop]', host).forEach(function (b) {
      b.addEventListener('click', function () { removeCandy(b.dataset.drop, true); renderAll(); });
    });
    $$('[data-add-cart]', host).forEach(function (b) {
      b.addEventListener('click', addToCart);
    });
    $('[data-save]', host).addEventListener('click', function () {
      YL.saveBox(box);
      YL.toast('Box saved — find it any time on this device.');
    });
  }

  /* ------------------------------------------------------------------ */
  /* auto-build: the escape hatch from the candy wall                    */
  /* ------------------------------------------------------------------ */
  /* This used to be a card of its own below the candy wall, which is the
     wrong moment — by then a hesitant customer has already scrolled past
     everything that overwhelmed them. It now sits directly above the
     grid, as one compact row, so the way out is visible exactly where
     the choice gets heavy. */
  function quickMix() {
    return '<div class="quickmix"><span class="quickmix__label">' + YL.icon('sparkle') +
      'In a hurry? Fill it with</span>' +
      YL.PRESETS.map(function (p) {
        return '<button class="quickmix__btn" data-preset="' + p.id + '">' + p.name + '</button>';
      }).join('') + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* floating peek: the box so far, without scrolling anywhere           */
  /* ------------------------------------------------------------------ */
  function peekEls() {
    return { fab: $('#peek-fab'), panel: $('#peek'), art: $('#peek-fab-art'), badge: $('#peek-fab-badge') };
  }

  YL.togglePeek = function (force) {
    var e = peekEls();
    if (!e.fab || !e.panel) return;
    var open = force == null ? !e.panel.classList.contains('is-open') : force;
    e.panel.hidden = false;
    e.panel.classList.toggle('is-open', open);
    e.fab.classList.toggle('is-open', open);
    e.fab.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('peek-open', open);
  };

  function initPeek() {
    var e = peekEls();
    if (!e.fab) return;
    e.fab.hidden = false;
    e.panel.hidden = false;
    e.fab.addEventListener('click', function () { YL.togglePeek(); });
    var close = $('#peek-close');
    if (close) {
      close.innerHTML = YL.icon('x');
      close.addEventListener('click', function () { YL.togglePeek(false); });
    }
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') YL.togglePeek(false);
    });
    document.addEventListener('click', function (ev) {
      if (!e.panel.classList.contains('is-open')) return;
      if (e.panel.contains(ev.target) || e.fab.contains(ev.target)) return;
      YL.togglePeek(false);
    });
  }

  function renderPeekButton() {
    var e = peekEls();
    if (!e.fab) return;
    e.art.innerHTML = YL.boxArt({ color: box.color, recipe: recipeOrNull(), fill: fillRatio(), seed: 'fab' });
    e.badge.textContent = used();
    e.badge.classList.toggle('is-empty', used() === 0);
  }

  /* ------------------------------------------------------------------ */
  /* add to cart                                                         */
  /* ------------------------------------------------------------------ */
  function addToCart() {
    if (used() === 0) {
      YL.toast('Scoop at least one candy in first!');
      var el = document.getElementById('step-candy');
      if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (YL.trackAdd) YL.trackAdd(box);
    YL.togglePeek(false);
    YL.addToCart(box, 1);
    YL.toast('Added to cart — ' + YL.boxLabel(box) + '.');
  }

  /* ------------------------------------------------------------------ */
  function head(n, title, sub, aside) {
    return '<div class="card__head"><span class="card__num">' + n + '</span>' +
      '<div><h2>' + title + '</h2><p>' + sub + '</p></div>' +
      (aside ? '<span class="card__aside">' + aside + '</span>' : '') + '</div>';
  }

  function renderAll() {
    renderSize();
    renderCandy();
    renderVibe();
    renderExtras();
    renderReview();
    renderPanel();
    renderPeekButton();
    markSteps();
  }

  /* ------------------------------------------------------------------ */
  /* boot                                                                */
  /* ------------------------------------------------------------------ */
  YL.initBuilder = function () {
    box = YL.getDraft();

    /* ?box=movie-night loads a ready-made box into the builder */
    var params = new URLSearchParams(location.search);
    var pre = params.get('box');
    if (pre) {
      var pb = YL.getPrebuilt(pre);
      if (pb) {
        box = YL.emptyBox();
        box.size = pb.size;
        box.color = pb.color === 'pink' ? 'pink' : pb.color;
        box.vibe = pb.vibe || 'me';
        box.extras = (pb.extras || []).slice();
        box.title = pb.name;
        pb.candies.forEach(function (id) { addCandy(id, true); });
        persist();
      }
    }
    var presetId = params.get('preset');
    if (presetId) {
      var pr = YL.PRESETS.filter(function (p) { return p.id === presetId; })[0];
      if (pr) fillRandom(pr.candies);
    }

    document.body.classList.add('has-mbar');
    initPeek();
    renderSteps();
    renderAll();

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { markSteps(); ticking = false; });
    }, { passive: true });

    if (pre || presetId) {
      var el = document.getElementById('builder');
      if (el) setTimeout(function () { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 120);
    }
  };
})(window.YL);
