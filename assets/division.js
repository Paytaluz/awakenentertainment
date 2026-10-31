/* ─── LOADER ─── */
const ld = document.getElementById('ld');
const ldNum = document.getElementById('ldNum');
const ldFill = document.getElementById('ldFill');
let pct = 0;
const ldInt = setInterval(() => {
  pct = Math.min(pct + Math.random() * 22 + 14, 100);
  ldNum.textContent = Math.floor(pct);
  ldFill.style.width = pct + '%';
  if (pct >= 100) {
    clearInterval(ldInt);
    setTimeout(() => {
      ld.classList.add('out');
      revealHero();
    }, 120);
  }
}, 45);

/* ─── HERO REVEAL ─── */
function revealHero() {
  const words = document.querySelectorAll('.hero-word');
  const hTag = document.getElementById('hTag');
  const hBot = document.getElementById('hBot');
  const hBadge = document.getElementById('hBadge');
  const hScroll = document.getElementById('hScroll');
  const nav = document.getElementById('nav');
  const ease = 'cubic-bezier(0.16,1,0.3,1)';
  const set = (el, delay, props) => setTimeout(() => Object.assign(el.style, props), delay);

  setTimeout(() => nav.classList.add('vis'), 200);
  set(document.getElementById('hLogo'), 280, { opacity: '1', transform: 'none', transition: `opacity .8s ${ease}, transform .8s ${ease}` });
  set(hTag, 350, { opacity: '1', transform: 'none', transition: `opacity .7s ${ease}, transform .7s ${ease}` });
  set(hBadge, 400, { opacity: '1', transition: 'opacity 1s ease' });
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transform = 'translateY(0)';
      w.style.transition = `transform 1s ${ease}`;
    }, 480 + i * 70);
  });
  set(hBot, 950, { opacity: '1', transition: `opacity .8s ease` });
  set(hScroll, 1200, { opacity: '1', transition: `opacity .7s ease` });
  const hTrust = document.getElementById('hTrust');
  if (hTrust) set(hTrust, 1300, { opacity: '1', transition: `opacity .8s ease` });
}

/* ─── CURSOR ─── */
const cd = document.getElementById('cd'), cr = document.getElementById('cr');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cd.style.left = mx + 'px'; cd.style.top = my + 'px';
});
(function animCur() {
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  cr.style.left = rx + 'px'; cr.style.top = ry + 'px';
  requestAnimationFrame(animCur);
})();
document.querySelectorAll('a,button,.work-row,.srv-item,.faq-q').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ─── SCROLL PROGRESS ─── */
const scrollProg = document.getElementById('scroll-prog');
let progTick = false;
window.addEventListener('scroll', () => {
  if (progTick) return;
  progTick = true;
  requestAnimationFrame(() => {
    progTick = false;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) scrollProg.style.transform = `scaleX(${(window.scrollY / docH).toFixed(4)})`;
  });
}, { passive: true });

/* ─── STATS COUNTER ─── */
let statsDone = false;
const statsEl = document.getElementById('stats');
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting || statsDone) return;
  statsDone = true;
  document.querySelectorAll('.stat').forEach((s, i) => setTimeout(() => s.classList.add('vis'), i * 100));
  document.querySelectorAll('.stat-n[data-to]').forEach(el => {
    const to = +el.dataset.to, from = +el.dataset.from, sfx = el.dataset.sfx || '';
    const dur = 1600, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * ease) + sfx;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 }).observe(statsEl || document.body);

/* ─── HOVER IMAGE REVEAL ON PROJECTS ─── */
const projImg = document.getElementById('proj-img');
const projPh = document.getElementById('projPh');
if (projImg && projPh) {
  let imgX = 0, imgY = 0, tgtX = 0, tgtY = 0, imgOn = false;
  (function animImg() {
    if (imgOn) {
      imgX += (tgtX - imgX) * .12;
      imgY += (tgtY - imgY) * .12;
      projImg.style.left = imgX + 'px';
      projImg.style.top = imgY + 'px';
    }
    requestAnimationFrame(animImg);
  })();
  document.querySelectorAll('.work-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      projPh.style.background = row.dataset.color || '#ebebeb';
      projPh.innerHTML = row.dataset.img ? `<img src="${row.dataset.img}" alt="">` : (row.dataset.emoji || '');
      imgOn = true;
      projImg.classList.add('show');
    });
    row.addEventListener('mouseleave', () => { projImg.classList.remove('show'); });
  });
  document.addEventListener('mousemove', e => { tgtX = e.clientX - 140; tgtY = e.clientY - 95; }, { passive: true });
}

/* ─── GENERIC SCROLL REVEAL ─── */
const rvObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); rvObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

/* ─── WORK ROWS ─── */
const wrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('vis'), parseInt(e.target.dataset.delay) || 0);
    wrObs.unobserve(e.target);
  });
}, { threshold: 0.05 });
document.querySelectorAll('.work-row').forEach(el => wrObs.observe(el));

/* ─── SERVICE CARDS ─── */
const srvObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('vis'), parseInt(e.target.dataset.sd) || 0);
    srvObs.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.srv-item').forEach(el => srvObs.observe(el));

/* ─── PROCESS STICKY SCALE ─── */
const procCards = document.querySelectorAll('.proc-card');
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.1 }).observe(document.querySelector('.proc-bg') || document.body);
const procBg = document.querySelector('.proc-bg');
procCards.forEach(c => {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) c.classList.add('in-view'); }, { threshold: 0.05 }).observe(c);
});
let procTick = false;
function updateProcCards() {
  procTick = false;
  if (!procBg) return;
  const box = procBg.getBoundingClientRect();
  if (box.bottom < -200 || box.top > innerHeight + 200) return;
  const tops = [...procCards].map(c => c.getBoundingClientRect());
  procCards.forEach((card, i) => {
    const rect = tops[i];
    const next = tops[i + 1];
    let progress = 0;
    if (next) progress = Math.min(1, Math.max(0, 1 - (next.top - 80) / rect.height));
    card.style.transform = `scale(${(1 - progress * 0.045).toFixed(4)})`;
    card.style.setProperty('--dim', (progress * 0.18).toFixed(3));
  });
}
window.addEventListener('scroll', () => {
  if (!procTick) { procTick = true; requestAnimationFrame(updateProcCards); }
}, { passive: true });

/* ─── FAQ ─── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const row = q.parentElement;
    const open = row.classList.contains('open');
    document.querySelectorAll('.faq-row').forEach(r => r.classList.remove('open'));
    if (!open) row.classList.add('open');
  });
});

/* ─── RESULTS SECTION ─── */
const rdObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('vis'), parseInt(e.target.dataset.rd) || 0);
    rdObs.unobserve(e.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.r-card').forEach(el => rdObs.observe(el));

const chartCard = document.querySelector('.r-card[data-rd="0"]');
if (chartCard) {
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const cp = document.getElementById('cpRect');
    if (cp) { cp.style.transition = 'width 1.8s cubic-bezier(.16,1,.3,1)'; cp.style.width = '400'; }
  }, { threshold: 0.3 }).observe(chartCard);
}

/* ─── BLOCK-BY-BLOCK SCROLL (desktop) ─── */
(function () {
  const desktop = matchMedia('(min-width: 901px) and (pointer: fine)');
  const root = document.documentElement;
  const sync = () => root.classList.toggle('js-paging', desktop.matches);
  sync();
  desktop.addEventListener('change', sync);

  const stops = () => {
    const pts = [...document.querySelectorAll('.snap, .proc-snap')].map(el => {
      const off = el.classList.contains('proc-snap') ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
      return Math.round(el.getBoundingClientRect().top + scrollY - off);
    });
    pts.push(root.scrollHeight - innerHeight);
    return [...new Set(pts)].sort((a, b) => a - b);
  };

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  let animating = false, raf = 0;
  function animateTo(target) {
    cancelAnimationFrame(raf);
    const start = scrollY, dist = target - start;
    if (Math.abs(dist) < 2) return;
    const dur = Math.min(850, 480 + Math.abs(dist) * 0.22);
    const t0 = performance.now();
    animating = true;
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      scrollTo(0, start + dist * ease(p));
      if (p < 1) raf = requestAnimationFrame(step);
      else { animating = false; deltas.length = 0; }
    };
    raf = requestAnimationFrame(step);
  }
  function go(dir) {
    const pts = stops(), y = scrollY;
    const target = dir > 0 ? pts.find(p => p > y + 4) : [...pts].reverse().find(p => p < y - 4);
    if (target !== undefined) animateTo(target);
  }

  // A new swipe/wheel spin shows rising deltas; trackpad momentum only decays.
  const deltas = [];
  let lastT = 0, lastDir = 0;
  addEventListener('wheel', e => {
    if (!desktop.matches || e.ctrlKey) return;
    e.preventDefault();
    const now = performance.now();
    const d = Math.abs(e.deltaY) * (e.deltaMode === 1 ? 16 : 1);
    const dir = Math.sign(e.deltaY);
    if (!dir) return;
    if (now - lastT > 160 || dir !== lastDir) deltas.length = 0;
    lastT = now; lastDir = dir;
    deltas.push(d);
    if (deltas.length > 20) deltas.shift();
    if (animating) return;
    const recent = deltas.slice(-3), avgRecent = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgAll = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const fresh = deltas.length <= 2 || avgRecent >= avgAll;
    if (fresh && d >= 4) { deltas.length = 0; go(dir); }
  }, { passive: false });

  addEventListener('keydown', e => {
    if (!desktop.matches || animating || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    const down = ['PageDown', 'ArrowDown', ' '].includes(e.key) && !e.shiftKey;
    const up = ['PageUp', 'ArrowUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (down || up) { e.preventDefault(); go(down ? 1 : -1); }
    if (e.key === 'Home') { e.preventDefault(); animateTo(0); }
    if (e.key === 'End') { e.preventDefault(); animateTo(root.scrollHeight - innerHeight); }
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !desktop.matches) return;
    const el = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    animateTo(Math.round(el.getBoundingClientRect().top + scrollY));
  });
})();

/* ─── HERO PARALLAX ─── */
document.addEventListener('mousemove', e => {
  const bgNum = document.querySelector('.hero-bg-num');
  if (bgNum) bgNum.style.transform = `translate(${(e.clientX / window.innerWidth - .5) * -15}px, ${(e.clientY / window.innerHeight - .5) * -8}px)`;
}, { passive: true });
