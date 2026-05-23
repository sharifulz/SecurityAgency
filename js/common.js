document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
      } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      }
    });
  }

  // Set active link
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentPath.includes(href)) {
      link.classList.add('active');
    } else if (currentPath === '/' || currentPath.endsWith('index.html')) {
        if (href === 'index.html' || href === '/') {
            link.classList.add('active');
        }
    }
  // Go to Top Button
  const goToTop = document.getElementById('go-to-top');
  if (goToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        goToTop.classList.add('visible');
      } else {
        goToTop.classList.remove('visible');
      }
    });

    goToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
