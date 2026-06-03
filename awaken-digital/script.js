/* ════════════════════════════════════════════
   AWAKEN DIGITAL — JS
   1. Nav stick
   2. Hero word cycling
   3. Scroll reveal (blocks slowly appearing)
   4. How-we-do-it drag scroll
   5. Cases carousel
   6. Form submit
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Nav sticky ─────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 60);
  }, { passive: true });

  /* ── Mobile burger ──────────────────────── */
  document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  /* ── 2. Hero word cycling ───────────────── */
  const words  = ['stories.', 'experiences.', 'campaigns.', 'videos.', 'culture.', 'impact.'];
  let   wi     = 0;
  const cycleEl = document.getElementById('cycleWord');

  setInterval(() => {
    cycleEl.classList.add('fade');
    setTimeout(() => {
      wi = (wi + 1) % words.length;
      cycleEl.textContent = words[wi];
      cycleEl.classList.remove('fade');
    }, 300);
  }, 2400);

  /* ── 3. Scroll reveal — "blocks slowly appearing" ── */
  // Stagger cards within each container
  function applyStaggerDelays(container) {
    container.querySelectorAll('.js-card-reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 110) + 'ms';
    });
  }
  document.querySelectorAll('.how-row, .certs-row, .pillars-row').forEach(applyStaggerDelays);

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe both types
  document.querySelectorAll('.js-reveal, .js-card-reveal').forEach(el => revealIO.observe(el));

  /* ── 4. How-we-do-it drag scroll ────────── */
  const howScroll = document.getElementById('howScroll');
  if (howScroll) {
    let isDown  = false, startX, scrollLeft;
    howScroll.addEventListener('mousedown', e => {
      isDown     = true;
      howScroll.classList.add('grabbing');
      startX     = e.pageX - howScroll.offsetLeft;
      scrollLeft = howScroll.scrollLeft;
    });
    howScroll.addEventListener('mouseleave', () => { isDown = false; howScroll.classList.remove('grabbing'); });
    howScroll.addEventListener('mouseup',    () => { isDown = false; howScroll.classList.remove('grabbing'); });
    howScroll.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - howScroll.offsetLeft;
      howScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }

  /* ── 5. Cases carousel ──────────────────── */
  const track   = document.getElementById('casesTrack');
  const prevBtn = document.getElementById('casesPrev');
  const nextBtn = document.getElementById('casesNext');

  if (track && prevBtn && nextBtn) {
    let current   = 0;
    const cards   = track.querySelectorAll('.case-card');
    const visible = () => window.innerWidth > 900 ? 3 : window.innerWidth > 560 ? 2 : 1;
    const maxIdx  = () => Math.max(0, cards.length - visible());

    function slideTo(idx) {
      current = Math.max(0, Math.min(idx, maxIdx()));
      const cardW = cards[0].offsetWidth + 16; // gap
      track.style.transform = `translateX(-${current * cardW}px)`;
    }

    prevBtn.addEventListener('click', () => slideTo(current - 1));
    nextBtn.addEventListener('click', () => slideTo(current + 1));
    window.addEventListener('resize', () => slideTo(Math.min(current, maxIdx())));
  }

  /* ── 6. Form submit ─────────────────────── */
  const form = document.querySelector('.cta-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.cta-send');
      btn.textContent = 'Sending…';
      btn.disabled    = true;
      setTimeout(() => {
        btn.textContent = '✓ Message received!';
        form.reset();
        setTimeout(() => { btn.textContent = 'Send message →'; btn.disabled = false; }, 3000);
      }, 1200);
    });
  }

})();
