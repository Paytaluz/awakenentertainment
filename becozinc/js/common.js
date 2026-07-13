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
		});
	}
});
