/* =========================================================
   Yummyland — the gift box builder
   Three steps, one at a time:
     1 Candy        → fill the six cups (a ready box or cup by cup)
     2 Lid & photos → who it's for, then how the lid is dressed:
                      their own photos (+$5.99, the one we push),
                      our photos for the occasion, or no photos
     3 Extras       → ribbon, card, summary and add to cart
   The live box preview sits beside the steps on a wide screen and
   above them on a phone, and every choice redraws it.
   ========================================================= */
window.YL = window.YL || {};

(function (YL) {
  'use strict';
  var $ = YL.$, $$ = YL.$$, esc = YL.esc;

  var STEPS = [
    { id: 'cups', name: 'Candy' },
    { id: 'personal', name: 'Lid & photos' },
    { id: 'finish', name: 'Extras & checkout' }
  ];

  var box, step = 0, selected = null;
  var view = 'inside';  /* preview: the open box, or the closed box as it arrives */
  var seen = {};  /* steps the customer has opened — only those can show as done */
  var filter = { type: 'all', color: null };
  var root;

  function save() {
    if (!YL.saveDraft(box)) YL.toast('Photos are too large to keep in this browser — they stay until you leave the page.');
  }

  /* ---------------------------------------------------------------
     status of each step, for the step bar and the Next button
     --------------------------------------------------------------- */
  function stepDone(i) {
    if (!seen[i] && i > 0) return false;
    switch (STEPS[i].id) {
      case 'cups': return YL.boxComplete(box);
      case 'personal': return !!box.lid && (box.lid !== 'own' || YL.hasOwnPhotos(box));
      default: return false;
    }
  }

  /* The occasion defaults to Just Because. The lid is always an explicit
     choice: the photos are what make this gift, so we ask rather than
     decide for the customer — and still let them say no. */
  function blocker() {
    if (!YL.boxComplete(box)) {
      var left = YL.BOX.cups - YL.boxFilled(box);
      return { step: 0, text: 'Fill ' + left + ' more cup' + (left > 1 ? 's' : '') + '.' };
    }
    if (!box.lid) return { step: 1, text: 'Choose how the lid looks — your photos, ours, or none.' };
    if (box.lid === 'own' && !YL.hasOwnPhotos(box)) {
      return { step: 1, text: 'Upload both photos, or pick one of the other lid options.' };
    }
    if (box.extras.indexOf('card') > -1 && !box.card.message.trim()) {
      return { step: 2, text: 'Write the message for your greeting card.' };
    }
    return null;
  }

  /* ---------------------------------------------------------------
     STEP BAR
     --------------------------------------------------------------- */
  function renderSteps() {
    $('#b-steps').innerHTML = '<ol class="bsteps">' + STEPS.map(function (s, i) {
      var cls = (i === step ? ' is-on' : '') + (stepDone(i) && i !== step ? ' is-done' : '');
      return '<li><button type="button" class="bsteps__btn' + cls + '" data-go="' + i + '"' +
        (i === step ? ' aria-current="step"' : '') + '>' +
        '<span class="bsteps__n">' + (stepDone(i) && i !== step ? YL.icon('check') : (i + 1)) + '</span>' +
        '<span class="bsteps__t">' + s.name + '</span></button></li>';
    }).join('') + '</ol>';
  }

  /* ---------------------------------------------------------------
     PREVIEW (box + price + next)
     --------------------------------------------------------------- */
  function outside() {
    var wrap = box.extras.indexOf('wrap') > -1, card = box.extras.indexOf('card') > -1;
    return '<div class="closed">' +
      '<img src="' + YL.img(wrap ? 'assets/img/box-wrapped.webp' : 'assets/img/box-closed.webp') + '" alt="' +
      (wrap ? 'The closed box tied with a satin ribbon and gift tag' : 'The closed box') + '">' +
      (card ? '<span class="closed__card"><img src="' + YL.img('assets/img/card.webp') + '" alt="Greeting card">' +
        (box.card.message ? '<i>' + esc(box.card.message.slice(0, 60)) + (box.card.message.length > 60 ? '…' : '') + '</i>' : '') + '</span>' : '') +
      '<span class="closed__tags">' + (wrap ? '<b>' + YL.icon('ribbon') + ' Ribbon</b>' : '') +
      (card ? '<b>' + YL.icon('note') + ' Card</b>' : '') + '</span></div>';
  }

  function renderPreview() {
    var p = YL.boxPrice(box);
    var filled = YL.boxFilled(box);
    $('#b-preview').innerHTML =
      '<div class="views" role="tablist" aria-label="Preview">' +
      '<button type="button" role="tab" class="views__btn' + (view === 'inside' ? ' is-on' : '') + '" data-view="inside" aria-selected="' + (view === 'inside') + '">Inside</button>' +
      '<button type="button" role="tab" class="views__btn' + (view === 'outside' ? ' is-on' : '') + '" data-view="outside" aria-selected="' + (view === 'outside') + '">How it arrives</button></div>' +
      (view === 'inside' ? YL.giftBox(box, { interactive: true, selected: selected }) : outside()) +
      '<div class="bprev__bar">' +
      '<div><span class="bprev__label">' + esc(YL.BOX.name) + '</span>' +
      '<span class="bprev__meta">' + filled + ' of ' + YL.BOX.cups + ' cups · ' + YL.BOX.size + '</span></div>' +
      '<b class="bprev__price">' + YL.money(p.total) + '</b></div>' +
      (selected != null && box.cups[selected] && view === 'inside'
        ? '<div class="bprev__sel">Cup ' + (selected + 1) + ' selected — pick a candy to swap it, or ' +
          '<button type="button" class="link-btn" data-empty-cup="' + selected + '">empty this cup</button></div>'
        : '');
  }

  /* ---------------------------------------------------------------
     STEP 1 — OCCASION
     --------------------------------------------------------------- */
  function occasionPicker() {
    var cur = box.occasion || 'just-because';
    return '<h3 class="sub">Who’s it for?</h3>' +
      '<div class="occ-grid">' + YL.OCCASIONS.map(function (o) {
        var on = cur === o.id;
        return '<button type="button" class="occ' + (on ? ' is-on' : '') + '" data-occ="' + o.id + '" aria-pressed="' + on + '">' +
          '<span class="occ__ico">' + YL.icon(o.icon) + '</span><b>' + o.name + '</b></button>';
      }).join('') + '</div>' +
      '<p class="muted small occ-note">Sets the words on the lid — <b>“' + esc(YL.getOccasion(cur).headline) + '”</b> — and the photos we pick if you use ours.</p>';
  }

  function dots(cups) {
    return cups.map(function (id) {
      var c = YL.getCandy(id);
      return '<i style="background:' + (c ? c.swatch : 'transparent') + '"></i>';
    }).join('');
  }

  /* ---------------------------------------------------------------
     STEP 2 — CUPS
     --------------------------------------------------------------- */
  function stepCups() {
    return head('Pick your candy', 'Take one of our ready boxes, or fill the six cups yourself. Tap a cup in the box to choose which one you are filling.') +
      '<div class="tray-mobile">' + YL.giftBoxTray(box, selected) + '</div>' +
      '<h3 class="sub">Ready boxes — one tap fills all six cups</h3>' +
      '<div class="colpick">' + YL.COLLECTIONS.map(function (c) {
        var on = box.collection === c.id && c.cups.join() === box.cups.join();
        return '<button type="button" class="colpick__btn' + (on ? ' is-on' : '') + '" data-use-col="' + c.id + '">' +
          '<span class="colpick__dots">' + dots(c.cups) + '</span><b>' + esc(c.name) + '</b><small>' + esc(c.tag) + '</small></button>';
      }).join('') + '</div>' +
      '<h3 class="sub">Or choose cup by cup</h3>' +
      '<div class="filters" role="group" aria-label="Candy type">' + YL.TYPES.map(function (t) {
        return '<button type="button" class="chip' + (filter.type === t.id ? ' is-on' : '') + '" data-type="' + t.id + '">' + t.name + '</button>';
      }).join('') + '</div>' +
      '<div class="swatches" role="group" aria-label="Colour">' +
      '<span class="swatches__label">Colour</span>' +
      YL.COLORS.map(function (c) {
        var on = filter.color === c.id;
        return '<button type="button" class="swatch' + (on ? ' is-on' : '') + '" data-color="' + c.id + '" title="' + c.name + '" ' +
          'aria-label="' + c.name + '" aria-pressed="' + on + '" style="background:' + c.hex + '"></button>';
      }).join('') +
      (filter.color ? '<button type="button" class="link-btn" data-color="">Any colour</button>' : '') +
      '</div>' +
      '<div class="candies">' + candyCards() + '</div>' +
      '<div class="cups-tools">' +
      '<button type="button" class="link-btn" data-clear-cups>' + YL.icon('refresh') + ' Empty all cups</button></div>';
  }

  function target() {
    if (selected != null) return selected;
    var i = box.cups.indexOf(null);
    return i < 0 ? null : i;
  }

  function candyCards() {
    var tiles = YL.candyTiles(filter.type, filter.color);
    if (!tiles.length) return '<p class="muted">Nothing in that colour and type yet — try another colour.</p>';
    var t = target();
    var addLabel = t == null ? 'Tap a cup to swap' : 'Add to cup ' + (t + 1);
    return tiles.map(function (tile) {
      if (tile.type === 'group') {
        var g = tile.group;
        return '<article class="candy candy--group">' +
          '<button type="button" class="candy__art" data-group="' + g.id + '" aria-label="' + esc(g.name) + ' — choose a colour">' +
          YL.groupTile(g, tile.members) + '</button>' +
          '<div class="candy__body"><span class="candy__brand">' + esc(g.brand) + ' · ' + tile.members.length + ' colours</span>' +
          '<b>' + esc(g.name) + '</b><p>' + esc(g.about) + '</p>' +
          '<button type="button" class="btn btn--line btn--sm" data-group="' + g.id + '">' + esc(g.pick) + '</button></div></article>';
      }
      var c = tile.candy;
      var inBox = box.cups.filter(function (id) { return id === c.id; }).length;
      return '<article class="candy' + (inBox ? ' is-in' : '') + '">' +
        (c.tag ? '<span class="candy__tag">' + esc(c.tag) + '</span>' : '') +
        (inBox ? '<span class="candy__count">' + inBox + '× in box</span>' : '') +
        '<button type="button" class="candy__art" data-add="' + c.id + '" aria-label="' + esc(addLabel + ': ' + c.name) + '">' +
        YL.candyTile(c) + '</button>' +
        '<div class="candy__body"><span class="candy__brand">' + esc(c.brand) + (c.nuts ? ' · contains nuts' : '') + '</span>' +
        '<b>' + esc(c.name) + '</b><p>' + esc(c.about) + '</p>' +
        '<button type="button" class="btn btn--line btn--sm" data-add="' + c.id + '"' + (t == null ? ' disabled' : '') + '>' +
        YL.icon('plus') + ' ' + addLabel + '</button></div></article>';
    }).join('');
  }

  function putCandy(id) {
    var t = target();
    if (t == null) { YL.toast('All six cups are full — tap a cup in the box to swap it.'); return; }
    box.cups[t] = id;
    box.collection = box.collection && YL.getCollection(box.collection) ? box.collection : null;
    selected = null;
    save();
    YL.trackStep && YL.trackStep('cup', { candy: id, cup: t + 1 });
    var c = YL.getCandy(id);
    if (YL.boxComplete(box)) YL.toast('Six for six — your box is full.');
    else YL.toast(c.label + ' in cup ' + (t + 1));
    render();
  }

  /* ---------------------------------------------------------------
     group picker (single-colour bears, Jolly Rancher by colour)
     --------------------------------------------------------------- */
  function openGroup(id) {
    var g = YL.getGroup(id);
    var members = YL.groupMembers(id);
    var el = document.createElement('div');
    el.className = 'modal is-on';
    el.innerHTML = '<div class="modal__box" role="dialog" aria-modal="true" aria-label="' + esc(g.name) + '">' +
      '<button type="button" class="modal__close" data-close aria-label="Close">' + YL.icon('x') + '</button>' +
      '<span class="eyebrow">' + esc(g.brand) + '</span><h3 class="modal__title">' + esc(g.name) + '</h3>' +
      '<p class="muted">' + esc(g.about) + '</p>' +
      '<div class="gpick">' + members.map(function (c) {
        return '<button type="button" class="gpick__btn" data-pick="' + c.id + '">' +
          '<span class="gpick__art">' + YL.candyTile(c, { px: 280, density: 4 }) + '</span>' +
          '<i style="background:' + c.swatch + '"></i><b>' + esc(c.label) + '</b></button>';
      }).join('') + '</div></div>';
    /* inside the builder, not <body>, so a theme's scoped styles still reach it */
    root.appendChild(el);
    document.body.classList.add('modal-open');
    var first = el.querySelector('[data-pick]');
    if (first) first.focus();

    function close() {
      document.removeEventListener('keydown', onKey);
      el.remove();
      document.body.classList.remove('modal-open');
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.closest('[data-close]')) { close(); return; }
      var b = e.target.closest('[data-pick]');
      if (b) { close(); putCandy(b.getAttribute('data-pick')); }
    });
  }

  /* ---------------------------------------------------------------
     STEP 3 — LID PHOTOS
     --------------------------------------------------------------- */
  /* The lid step is the showpiece. Each option carries a small picture
     of that exact lid, so the choice is between three looks, not three
     lines of text. Their own photos lead, carry the badge and are the
     biggest card; the other two are there so nobody is cornered. */
  function lidPreview(mode) {
    var b = JSON.parse(JSON.stringify(box));
    b.lid = mode;
    if (mode === 'own' && b.extras.indexOf('photos') < 0) b.extras.push('photos');
    return YL.giftBox(b, { lidOnly: true, compact: true });
  }

  function stepLid() {
    var occ = YL.getOccasion(box.occasion) || YL.OCCASIONS[0];
    var photoExtra = YL.getExtra('photos');
    var lid = YL.boxLid(box);
    var mode = box.lid;
    function opt(id, cls, title, text, price, badge) {
      var on = mode === id;
      return '<button type="button" class="lidopt ' + cls + (on ? ' is-on' : '') + '" data-lid="' + id + '" aria-pressed="' + on + '">' +
        '<span class="lidopt__art">' + lidPreview(id) + '</span>' +
        '<span class="lidopt__body"><span class="lidopt__radio" aria-hidden="true"></span>' +
        (badge ? '<span class="lidopt__badge">' + badge + '</span>' : '') +
        '<b>' + title + '</b><small>' + text + '</small><span class="lidopt__price">' + price + '</span></span></button>';
    }
    return head('The lid — the best part', 'When they open the box, the first thing they see is two photos inside the lid. Choose how yours looks.') +
      occasionPicker() +
      '<h3 class="sub">Photos inside the lid</h3>' +
      '<div class="lidopts">' +
      opt('own', 'lidopt--main', 'Your own photos', 'Upload two photos — we print them as polaroids and set them in the lid. This is what makes it their gift.',
        '+' + YL.money(photoExtra.price), '♥ Most loved') +
      opt('ours', '', 'Our photos for ' + esc(occ.name), 'We pick two photos that match the occasion.', 'Included') +
      opt('none', '', 'No photos', 'Just the printed lid and message.', 'Included') +
      '</div>' +
      (mode === 'own' ? '<h3 class="sub">Upload your two photos</h3>' + uploads() : '') +
      (mode && mode !== 'none'
        ? '<h3 class="sub">Words under the photos <span class="muted">(optional)</span></h3>' +
          '<div class="fields fields--2">' +
          field('cap0', 'First photo', lid.captions[0], 22) +
          field('cap1', 'Second photo', lid.captions[1], 22) + '</div>'
        : '');
  }

  function uploads() {
    return '<div class="uploads">' + [0, 1].map(function (i) {
      var p = box.photos[i];
      return '<label class="upload' + (p ? ' has-photo' : '') + '">' +
        '<input type="file" accept="image/*" data-upload="' + i + '" class="sr-only">' +
        (p ? '<img src="' + p.src + '" alt="Your photo ' + (i + 1) + '">' +
          '<span class="upload__change">' + YL.icon('edit') + ' Replace</span>'
          : '<span class="upload__empty">' + YL.icon('upload') + '<b>Photo ' + (i + 1) + '</b><small>JPG or PNG from your phone</small></span>') +
        '</label>';
    }).join('') + '</div>' +
      '<p class="muted small">Faces near the middle work best — we crop to the polaroid window. Photos are only used to print your box.</p>';
  }

  /* Phone photos are 3–12 MB; the lid window is a few inches wide. Scale
     to 900 px and re-encode, which keeps the print sharp and the file
     small enough to live in the cart. */
  function readPhoto(file, done) {
    if (!file || !/^image\//.test(file.type)) { YL.toast('That file is not an image.'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, w = img.naturalWidth, h = img.naturalHeight;
        var k = Math.min(1, max / Math.max(w, h));
        var cv = document.createElement('canvas');
        cv.width = Math.round(w * k); cv.height = Math.round(h * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        done(cv.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = function () { YL.toast('We could not read that photo — try a JPG or PNG.'); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  /* ---------------------------------------------------------------
     STEP 4 — FINISHING TOUCHES
     --------------------------------------------------------------- */
  function stepFinish() {
    var wrap = YL.getExtra('wrap'), card = YL.getExtra('card');
    var hasWrap = box.extras.indexOf('wrap') > -1, hasCard = box.extras.indexOf('card') > -1;
    var p = YL.boxPrice(box);
    var block = blocker();
    return head('Extras & checkout', 'Add a finishing touch if you like, check your box and add it to the cart.') +
      (box.lid !== 'own'
        ? '<div class="upsell"><span class="upsell__art">' + lidPreview('own') + '</span>' +
          '<div class="upsell__body"><strong class="upsell__title">Put your own photos in the lid?</strong>' +
          '<span class="upsell__text">It is the part people remember. Two photos, printed and set inside — ' +
          YL.money(YL.getExtra('photos').price) + '.</span>' +
          '<button type="button" class="btn btn--sm btn--gold" data-lid="own" data-go-lid>' + YL.icon('camera') + ' Add my photos</button></div></div>'
        : '') +
      '<div class="touches">' + touch(wrap, hasWrap) + touch(card, hasCard) + '</div>' +
      (hasCard
        ? '<div class="cardform"><div class="fields fields--2">' +
          field('card-to', 'To', box.card.to, 40) + field('card-from', 'From', box.card.from, 40) + '</div>' +
          '<label class="field"><span>Message</span><textarea id="card-msg" maxlength="240" rows="3" ' +
          'placeholder="Happy birthday, you sweet thing…">' + esc(box.card.message) + '</textarea>' +
          '<small class="field__count" id="card-count">' + box.card.message.length + ' / 240</small></label></div>'
        : '') +
      '<h3 class="sub">Your box</h3>' +
      '<ol class="review__cups">' + box.cups.map(function (id, i) {
        var c = id && YL.getCandy(id);
        return '<li>' + (c ? YL.candyDot(c) + '<span>' + esc(c.name) + '</span>'
          : '<span class="muted">Cup ' + (i + 1) + ' is empty</span>') + '</li>';
      }).join('') + '</ol>' +
      '<div class="lines">' +
      line(YL.BOX.name, YL.money(p.base)) +
      box.extras.map(function (id) { var e = YL.getExtra(id); return line(e.name, YL.money(e.price)); }).join('') +
      line('Shipping', 'Free') +
      '<div class="line line--total"><span>Total</span><b>' + YL.money(p.total) + '</b></div></div>' +
      (block ? '<div class="alert">' + esc(block.text) + ' <button type="button" class="link-btn" data-go="' + block.step + '">Fix it</button></div>' : '') +
      '<div class="review__cta"><button type="button" class="btn btn--lg" data-add-cart' + (block ? ' disabled' : '') + '>' +
      YL.icon('cart') + ' Add to cart · ' + YL.money(p.total) + '</button></div>' +
      '<ul class="included">' + YL.INCLUDED.map(function (t) { return '<li>' + YL.icon('check') + t + '</li>'; }).join('') + '</ul>';
  }

  function touch(e, on) {
    return '<button type="button" class="touch' + (on ? ' is-on' : '') + '" data-extra="' + e.id + '" aria-pressed="' + on + '">' +
      (e.img ? '<span class="touch__img"><img src="' + YL.img(e.img) + '" alt="" loading="lazy"></span>' : '') +
      '<span class="touch__body"><span class="touch__ico">' + YL.icon(e.icon) + '</span>' +
      '<b>' + esc(e.name) + '</b><small>' + esc(e.desc) + '</small>' +
      '<span class="touch__price">' + (on ? YL.icon('check') + ' Added · ' : '+ ') + YL.money(e.price) + '</span></span></button>';
  }

  /* ---------------------------------------------------------------
     STEP 5 — REVIEW
     --------------------------------------------------------------- */
  function line(l, v) { return '<div class="line"><span>' + esc(l) + '</span><b>' + v + '</b></div>'; }
  function head(title, text) {
    return '<span class="eyebrow">Step ' + (step + 1) + ' of ' + STEPS.length + '</span>' +
      '<h2 class="bstep__title">' + title + '</h2><p class="bstep__lede">' + text + '</p>';
  }
  function field(id, label, value, max) {
    return '<label class="field"><span>' + label + '</span><input type="text" id="' + id + '" maxlength="' + max + '" value="' + esc(value) + '"></label>';
  }

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  function renderStep() {
    var id = STEPS[step].id;
    var html = id === 'cups' ? stepCups() : id === 'personal' ? stepLid() : stepFinish();
    var next = step < STEPS.length - 1
      ? '<button type="button" class="btn btn--lg" data-next>' + 'Next: ' + STEPS[step + 1].name + ' ' + YL.icon('arrow') + '</button>'
      : '';
    $('#b-step').innerHTML = '<div class="bstep">' + html + '</div>' +
      '<div class="bnav">' +
      (step > 0 ? '<button type="button" class="btn btn--line" data-prev>' + YL.icon('back') + ' Back</button>' : '<span></span>') +
      next + '</div>';
  }

  function render() {
    seen[step] = true;
    renderSteps();
    renderPreview();
    renderStep();
  }

  function go(i, scroll) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    if (step < 2) view = 'inside';
    selected = null;
    render();
    YL.trackStep && YL.trackStep(STEPS[step].id);
    if (scroll !== false) {
      var top = root.getBoundingClientRect().top + window.pageYOffset - 70;
      if (Math.abs(window.pageYOffset - top) > 40) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  function useCollection(id) {
    var col = YL.getCollection(id);
    if (!col) return;
    var occ = box.occasion;
    var keep = { photos: box.photos, captions: box.captions, extras: box.extras, card: box.card };
    box = YL.boxFromCollection(col, occ, box.lid);
    box.photos = keep.photos; box.captions = keep.captions; box.extras = keep.extras; box.card = keep.card;
    selected = null;
    save();
    YL.trackViewBox && YL.trackViewBox(col);
    YL.toast(col.name + ' is in your box — swap any cup you like.');
    render();
  }

  /* ---------------------------------------------------------------
     EVENTS — one delegated listener for the whole builder
     --------------------------------------------------------------- */
  function bind() {
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button, [data-go]');
      if (!t || !root.contains(t)) return;
      var d = t.dataset;

      if (d.go != null) { go(parseInt(d.go, 10)); return; }
      if (t.hasAttribute('data-next')) {
        var b = blocker();
        if (b && b.step === step) { YL.toast(b.text); return; }
        go(step + 1);
        return;
      }
      if (t.hasAttribute('data-prev')) { go(step - 1); return; }

      if (d.occ) {
        box.occasion = d.occ;
        box.captions = null;
        save();
        YL.trackStep && YL.trackStep('occasion', { occasion: d.occ });
        render();
        return;
      }
      if (d.useCol) { useCollection(d.useCol); return; }

      if (d.cup != null) {
        var i = parseInt(d.cup, 10);
        if (step !== 0) { go(0, false); selected = i; render(); return; }
        selected = selected === i ? null : i;
        if (!box.cups[i]) selected = i;
        render();
        return;
      }
      if (d.emptyCup != null) {
        box.cups[parseInt(d.emptyCup, 10)] = null;
        selected = parseInt(d.emptyCup, 10);
        save(); render();
        return;
      }
      if (t.hasAttribute('data-clear-cups')) {
        box.cups = box.cups.map(function () { return null; });
        box.collection = null; selected = null;
        save(); render();
        return;
      }
      if (d.type) { filter.type = d.type; render(); return; }
      if (d.color != null) { filter.color = d.color && filter.color !== d.color ? d.color : null; render(); return; }
      if (d.add) { putCandy(d.add); return; }
      if (d.group) { openGroup(d.group); return; }

      if (d.view) { view = d.view; renderPreview(); return; }
      if (d.lid) {
        box.lid = d.lid;
        var i2 = box.extras.indexOf('photos');
        if (d.lid === 'own' && i2 < 0) box.extras.push('photos');
        if (d.lid !== 'own' && i2 > -1) box.extras.splice(i2, 1);
        view = 'inside';
        save();
        YL.trackStep && YL.trackStep('lid', { lid: d.lid });
        if (t.hasAttribute('data-go-lid')) { go(1); return; }
        render();
        return;
      }
      if (d.extra) {
        var k = box.extras.indexOf(d.extra);
        if (k > -1) box.extras.splice(k, 1); else box.extras.push(d.extra);
        /* show them the box as it will arrive, ribbon and card on */
        view = 'outside';
        save(); render();
        return;
      }
      if (t.hasAttribute('data-add-cart')) {
        if (blocker()) return;
        YL.addToCart(box, 1);
        YL.trackAdd && YL.trackAdd(box);
        YL.toast('Your gift box is in the cart.');
        if (!YL.cartAdapter) setTimeout(function () { window.location.href = YL.PATHS.cart; }, 700);
      }
    });

    root.addEventListener('change', function (e) {
      var up = e.target.getAttribute('data-upload');
      if (up == null || !e.target.files[0]) return;
      readPhoto(e.target.files[0], function (src) {
        box.photos[parseInt(up, 10)] = { src: src };
        box.lid = 'own';
        if (box.extras.indexOf('photos') < 0) box.extras.push('photos');
        view = 'inside';
        save(); render();
      });
    });

    root.addEventListener('input', function (e) {
      var id = e.target.id;
      if (id === 'cap0' || id === 'cap1') {
        var lid = YL.boxLid(box);
        box.captions = [lid.captions[0], lid.captions[1]];
        box.captions[id === 'cap0' ? 0 : 1] = e.target.value;
      } else if (id === 'card-to') box.card.to = e.target.value;
      else if (id === 'card-from') box.card.from = e.target.value;
      else if (id === 'card-msg') {
        box.card.message = e.target.value;
        var cnt = $('#card-count'); if (cnt) cnt.textContent = e.target.value.length + ' / 240';
      } else return;
      save();
      /* redraw the preview and step bar, never the form being typed in */
      renderPreview();
      renderSteps();
    });
  }

  /* the small cup tray shown above the candy on a phone */
  YL.giftBoxTray = function (b, sel) {
    return '<div class="gbox__cups tray" style="grid-template-columns:repeat(' + YL.BOX.cols + ',1fr)">' +
      b.cups.map(function (id, i) {
        var c = id && YL.getCandy(id);
        return '<button type="button" class="cup' + (c ? '' : ' cup--empty') + (sel === i ? ' is-selected' : '') + '" data-cup="' + i + '" ' +
          'aria-label="Cup ' + (i + 1) + (c ? ': ' + esc(c.name) : ' — empty') + '">' +
          (c ? '<span class="cup__fill">' + YL.candyTile(c, { px: 200, density: 3 }) + '</span>'
            : '<span class="cup__plus">' + (i + 1) + '</span>') + '</button>';
      }).join('') + '</div>';
  };

  /* ---------------------------------------------------------------
     INIT
     --------------------------------------------------------------- */
  YL.initBuilder = function () {
    root = $('#builder');
    if (!root) return;
    box = YL.getDraft();

    /* deep links: ?collection=rainbow-row  ?occasion=wedding */
    var q = new URLSearchParams(window.location.search);
    var occ = q.get('occasion'), col = q.get('collection');
    if (occ && YL.getOccasion(occ)) box.occasion = occ;
    if (col && YL.getCollection(col)) {
      var c = YL.getCollection(col);
      var keepOcc = box.occasion;
      box = YL.boxFromCollection(c, occ || keepOcc, box.lid);
    }
    save();

    bind();
    render();
    if (col || occ) setTimeout(function () { go(0); }, 60);
  };
})(window.YL);
