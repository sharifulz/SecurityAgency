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
    } else if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
      if (href === 'index.html' || href === '/') {
        link.classList.add('active');
      }
    }
  });

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

  // Populate Quick Links in Footer across all pages
  function renderQuickLinks(data, lang) {
    const quickLinks = document.getElementById('quick-links');
    if (!quickLinks || !data?.global?.footer?.quickLinks) return;
    const currentLang = lang || localStorage.getItem('lang') || 'en';

    quickLinks.innerHTML = '';
    data.global.footer.quickLinks.forEach(link => {
      const text = link[currentLang] || link['en'] || link;
      const url = link.url || 'contact.html';
      const li = document.createElement('li');
      li.innerHTML = `<a href="${url}"><i class="ph ph-caret-right"></i> ${text}</a>`;
      quickLinks.appendChild(li);
    });
  }

  window.addEventListener('languageChanged', (e) => {
    renderQuickLinks(e.detail.data, e.detail.lang);
  });

  if (window.I18n && window.I18n.contentData) {
    renderQuickLinks(window.I18n.contentData, window.I18n.currentLang);
  } else {
    setTimeout(() => {
      if (window.I18n && window.I18n.contentData) {
        renderQuickLinks(window.I18n.contentData, window.I18n.currentLang);
      }
    }, 200);
  }

  // Handle contact form submission
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentLang = localStorage.getItem('lang') || 'en';
      const successMsg = currentLang === 'bn' 
        ? 'ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমাদের নিরাপত্তা প্রতিনিধি দ্রুত যোগাযোগ করবেন।'
        : 'Thank you! Your inquiry has been sent successfully. Our security coordination desk will contact you shortly.';
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="ph-fill ph-check-circle"></i> ${currentLang === 'bn' ? 'বার্তা পাঠানো হয়েছে!' : 'Message Sent!'}`;
        submitBtn.style.background = '#10B981';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
        }, 4000);
      }

      alert(successMsg);
      contactForm.reset();
    });
  }
});
