document.addEventListener('DOMContentLoaded', function () {
	var toggle = document.querySelector('.nav-toggle');
	var mobileNav = document.querySelector('.mobile-nav');

	if (toggle && mobileNav) {
		toggle.addEventListener('click', function () {
			mobileNav.classList.toggle('is-open');
		});
	}

	var topbar = document.querySelector('.topbar');
	if (topbar) {
		window.addEventListener('scroll', function () {
			topbar.classList.toggle('is-scrolled', window.scrollY > 10);
		}, { passive: true });
	}

	var revealEls = document.querySelectorAll('.reveal');
	if (revealEls.length) {
		if ('IntersectionObserver' in window) {
			var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						io.unobserve(entry.target);
					}
				});
			}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
			revealEls.forEach(function (el) { io.observe(el); });
		} else {
			revealEls.forEach(function (el) { el.classList.add('is-visible'); });
		}
	}

	var parallaxEls = document.querySelectorAll('.parallax-layer');
	if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		var ticking = false;
		var updateParallax = function () {
			parallaxEls.forEach(function (el) {
				var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
				var rect = el.parentElement.getBoundingClientRect();
				var offset = rect.top * speed;
				el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
			});
			ticking = false;
		};
		window.addEventListener('scroll', function () {
			if (!ticking) {
				window.requestAnimationFrame(updateParallax);
				ticking = true;
			}
		}, { passive: true });
		updateParallax();
	}
});
