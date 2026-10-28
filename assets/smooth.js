/* Smooth wheel scrolling for mouse & trackpad; touch devices keep native scrolling. */
(function () {
  if (!matchMedia('(pointer: fine)').matches) return;
  const root = document.documentElement;
  let target = scrollY, current = scrollY, active = false;
  const maxScroll = () => root.scrollHeight - innerHeight;

  function loop() {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.5) {
      current = target;
      scrollTo(0, current);
      active = false;
      return;
    }
    scrollTo(0, current);
    requestAnimationFrame(loop);
  }
  function start() {
    if (active) return;
    active = true;
    root.style.scrollBehavior = 'auto';
    requestAnimationFrame(loop);
  }
  function innerScroller(el) {
    for (; el instanceof Element && el !== document.body; el = el.parentElement) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
    }
    return false;
  }

  addEventListener('wheel', e => {
    if (e.ctrlKey || e.defaultPrevented || innerScroller(e.target)) return;
    e.preventDefault();
    if (!active) target = current = scrollY;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * unit));
    start();
  }, { passive: false });

  addEventListener('scroll', () => { if (!active) target = current = scrollY; }, { passive: true });

  document.addEventListener('click', e => {
    if (e.defaultPrevented) return;
    const a = e.target.closest('a[href^="#"]');
    const id = a && a.getAttribute('href');
    const el = id && id.length > 1 && document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    if (!active) current = scrollY;
    target = Math.max(0, Math.min(maxScroll(), Math.round(el.getBoundingClientRect().top + scrollY)));
    start();
  });
})();
