// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Calendar tabs
function showCal(brand, btn) {
  document.querySelectorAll('.cal-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('cal-' + brand).classList.add('active');
  document.querySelectorAll('.cal-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// Video players: each card starts as a poster image + play badge.
// We HEAD-check the real clip's URL; if it 404s (not uploaded yet), the badge
// click just shakes and the "Awaiting final clip" tag stays. Once the file
// exists at assets/videos/<name>.mp4, the tag hides and the badge plays it.
const videoKeys = ['fermentation', 'vendors-math', 'house-surprise'];
videoKeys.forEach(key => {
  const video = document.getElementById('vid-' + key);
  const badge = document.getElementById('badge-' + key);
  const tag = document.getElementById('tag-' + key);
  const poster = badge && badge.parentElement.querySelector('.poster-img');
  if (!video) return;
  const src = video.querySelector('source').getAttribute('src');
  let ready = false;

  fetch(src, { method: 'HEAD' })
    .then(res => { if (res.ok) { ready = true; tag.style.display = 'none'; } })
    .catch(() => {});

  badge.addEventListener('click', () => {
    if (ready) {
      poster.style.display = 'none';
      badge.style.display = 'none';
      video.style.display = 'block';
      video.play();
    } else {
      badge.style.animation = 'none';
      requestAnimationFrame(() => { badge.style.animation = 'shake .4s'; });
    }
  });
});
