/* IETE Chennai Centre — small progressive-enhancement layer.
   Every page reads and works with JavaScript switched off. */
(function () {
  'use strict';

  function nav() {
    var btn = document.querySelector('.nav-toggle');
    var list = document.getElementById('primary-nav');
    if (!btn || !list) return;
    function close() { list.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function () {
      var open = list.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) close(); });
  }

  /* photographs fade in once decoded, so a slow connection doesn't flash empty boxes */
  function photos() {
    var imgs = document.querySelectorAll('.person img');
    Array.prototype.forEach.call(imgs, function (img) {
      if (img.complete) { img.classList.add('is-loaded'); return; }
      img.addEventListener('load', function () { img.classList.add('is-loaded'); });
      img.addEventListener('error', function () { img.classList.add('is-loaded'); });
    });
  }

  function toTop() {
    var btn = document.querySelector('.to-top');
    if (!btn) return;
    var ticking = false;
    function update() {
      btn.classList.toggle('is-shown', (window.pageYOffset || 0) > 600);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    update();
  }

  function lightbox() {
    var box = document.getElementById('lightbox');
    var triggers = document.querySelectorAll('[data-full]');
    if (!box || !triggers.length) return;
    var img = box.querySelector('img'), cap = box.querySelector('.lb-cap'), last = null;
    function open(btn) {
      last = btn;
      img.src = btn.getAttribute('data-full');
      img.alt = btn.getAttribute('data-caption') || '';
      cap.textContent = btn.getAttribute('data-caption') || '';
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function () { box.classList.add('is-visible'); });
      box.querySelector('.lb-close').focus();
    }
    function close() {
      box.classList.remove('is-visible');
      setTimeout(function () {
        box.classList.remove('is-open');
        img.removeAttribute('src');
        document.body.style.overflow = '';
        if (last) last.focus();
      }, 200);
    }
    Array.prototype.forEach.call(triggers, function (b) { b.addEventListener('click', function () { open(b); }); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lb-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) close();
    });
  }

  /* Each gallery has its own filter bar and its own grid, so a bar only ever
     touches the tiles in the section it belongs to. */
  function filterBar(barAttr, btnAttr, countId, noun) {
    var bar = document.querySelector('[' + barAttr + ']');
    if (!bar) return;
    var section = bar.closest('section') || document;
    var items = section.querySelectorAll('[data-cat]');
    var count = document.getElementById(countId);
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[' + btnAttr + ']');
      if (!btn) return;
      var val = btn.getAttribute(btnAttr), shown = 0;
      Array.prototype.forEach.call(bar.querySelectorAll('button'), function (b) {
        b.classList.toggle('btn--plain', b !== btn);
      });
      Array.prototype.forEach.call(items, function (el) {
        var on = val === 'all' || el.getAttribute('data-cat') === val;
        el.style.display = on ? '' : 'none';
        if (on) shown++;
      });
      if (count) count.textContent = shown + ' ' + noun + (shown === 1 ? '' : 's');
    });
  }

  function filters() {
    filterBar('data-filter-bar', 'data-filter', 'filter-count', 'image');
    filterBar('data-filter-bar-2', 'data-filter2', 'office-count', 'photograph');
  }

  function form() {
    var f = document.getElementById('enquiry-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      var subject = encodeURIComponent('[Website] ' + (d.get('subject') || 'Enquiry'));
      var body = encodeURIComponent(
        'Name: ' + (d.get('name') || '') + '\n' +
        'Email: ' + (d.get('email') || '') + '\n' +
        'Telephone: ' + (d.get('phone') || '') + '\n\n' +
        (d.get('message') || ''));
      var s = document.getElementById('form-status');
      if (s) s.classList.add('is-shown');
      window.location.href = 'mailto:ietechennai@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  function year() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function boot() { nav(); photos(); toTop(); lightbox(); filters(); form(); year(); }
  window.__ieteBoot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
