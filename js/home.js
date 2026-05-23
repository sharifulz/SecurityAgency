document.addEventListener('DOMContentLoaded', () => {
  // Listen for language updates to re-render dynamic content
  window.addEventListener('languageChanged', (e) => {
    renderDynamicContent(e.detail.data, e.detail.lang);
  });

  // Render initial content if I18n is already initialized
  if (window.I18n && window.I18n.contentData) {
    renderDynamicContent(window.I18n.contentData, window.I18n.currentLang);
  } else {
    // Alternatively, patch i18n.js to dispatch an initial event, but 
    // polling or timeout as a fallback in case DOMContentLoaded order differs.
    setTimeout(() => {
      if (window.I18n && window.I18n.contentData) {
        renderDynamicContent(window.I18n.contentData, window.I18n.currentLang);
      }
    }, 100);
  }

  function renderDynamicContent(data, lang) {
    if (!data) return;
    
    // Services Grid
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && data.home.services.items) {
      servicesGrid.innerHTML = '';
      data.home.services.items.forEach(item => {
        const title = item.title[lang] || item.title['en'];
        const desc = item.desc[lang] || item.desc['en'];
        
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
          <div class="service-icon">
            <i class="ph ${item.icon}"></i>
          </div>
          <h3>${title}</h3>
          <p>${desc}</p>
        `;
        servicesGrid.appendChild(card);
      });
    }

    // Testimonials Grid
    const testGrid = document.getElementById('testimonial-grid');
    if (testGrid && data.home.testimonials.items) {
      testGrid.innerHTML = '';
      data.home.testimonials.items.forEach(item => {
        const review = item.review[lang] || item.review['en'];
        const initial = item.author.charAt(0);
        
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
          <i class="ph-fill ph-quotes testimonial-icon"></i>
          <p class="testimonial-text">"${review}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">${initial}</div>
            <div class="author-info">
              <h4>${item.author}</h4>
            </div>
          </div>
        `;
        testGrid.appendChild(card);
      });
    }

    // Quick Links
    const quickLinks = document.getElementById('quick-links');
    if (quickLinks && data.global.footer.quickLinks) {
      quickLinks.innerHTML = '';
      data.global.footer.quickLinks.forEach(link => {
        const text = link[lang] || link['en'];
        const li = document.createElement('li');
        li.innerHTML = `<a href="#"><i class="ph ph-caret-right"></i> ${text}</a>`;
        quickLinks.appendChild(li);
      });
    }
  }

  // Add small delay to counter animation for effect
  const workforce = document.getElementById('workforce-counter');
  if (workforce) {
    // A simple visual effect on load
    workforce.style.opacity = '0';
    setTimeout(() => {
      workforce.style.transition = 'opacity 1s ease';
      workforce.style.opacity = '1';
    }, 500);
  }
});
