// ─────────────────────────────────────────────────
//  AWAKEN — Accordion Slide Controller
//  Uses explicit pixel widths (not flex-basis)
//  for GPU-smooth transitions.
// ─────────────────────────────────────────────────
(function () {
  'use strict';

  const accordion = document.getElementById('accordion');
  const slides    = Array.from(accordion.querySelectorAll('.slide'));
  const dotsWrap  = document.getElementById('navDots');
  const btnPrev   = document.getElementById('navPrev');
  const btnNext   = document.getElementById('navNext');
  const counter   = document.getElementById('slideCounter');
  const navLinks  = document.querySelectorAll('[data-slide]');

  const TOTAL  = slides.length;
  const TAB_W  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tab-w')) || 52;
  let current  = 0;
  let locked   = false;
  const LOCK_MS = 720; // slightly longer than CSS --dur (680ms) for safety

  // ── Build nav dots ─────────────────────────────
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  // ── Compute & apply widths ─────────────────────
  function applyWidths() {
    const stageW   = accordion.offsetWidth;
    const activeW  = stageW - TAB_W * (TOTAL - 1);

    slides.forEach((slide, i) => {
      // Use style.width so the CSS transition runs on a concrete value —
      // this avoids the reflow jank that flex-basis transitions can cause.
      slide.style.width = (i === current ? activeW : TAB_W) + 'px';
    });
  }

  // ── Update UI state ────────────────────────────
  function updateUI() {
    const pads = String(current + 1).padStart(2, '0');
    const padt = String(TOTAL).padStart(2, '0');
    if (counter) counter.textContent = `${pads} / ${padt}`;

    btnPrev.disabled = current === 0;
    btnNext.disabled = current === TOTAL - 1;

    document.querySelectorAll('.nav-dot').forEach((d, i) =>
      d.classList.toggle('is-active', i === current));

    // Active class drives content fade-in (via CSS transition-delay)
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));

    // Header nav highlight
    navLinks.forEach(link => {
      const idx = parseInt(link.dataset.slide, 10);
      link.classList.toggle('is-active', idx === current);
    });
  }

  // ── Core navigation ────────────────────────────
  function goTo(index) {
    if (locked || index === current) return;
    if (index < 0 || index >= TOTAL) return;

    locked  = true;
    current = index;

    applyWidths();
    updateUI();

    setTimeout(() => { locked = false; }, LOCK_MS);
  }

  // ── Slide tab / body click ─────────────────────
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (!slide.classList.contains('is-active')) goTo(i);
    });
  });

  // ── Arrow buttons ──────────────────────────────
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // ── Nav links (header + buttons with data-slide) ─
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      goTo(parseInt(link.dataset.slide, 10));
    });
  });

  // ── Keyboard ───────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(current - 1); }
  });

  // ── Wheel / trackpad ───────────────────────────
  let wheelCooldown = false;
  document.addEventListener('wheel', e => {
    e.preventDefault();
    if (wheelCooldown) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (d > 40)  goTo(current + 1);
    if (d < -40) goTo(current - 1);
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, LOCK_MS);
  }, { passive: false });

  // ── Touch swipe ────────────────────────────────
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend',   e => {
    const d = e.changedTouches[0].clientX - touchX;
    if (Math.abs(d) > 55) goTo(d < 0 ? current + 1 : current - 1);
  }, { passive: true });

  // ── Resize: recompute widths ───────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyWidths, 60);
  });

  // ── Init ───────────────────────────────────────
  // Set widths without transition on first load
  slides.forEach(s => { s.style.transition = 'none'; });
  applyWidths();
  updateUI();

  // Re-enable transitions on next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      slides.forEach(s => { s.style.transition = ''; });
    });
  });

})();
