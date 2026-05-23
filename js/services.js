document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('languageChanged', (e) => {
    renderServices(e.detail.data, e.detail.lang);
  });

  if (window.I18n && window.I18n.contentData) {
    renderServices(window.I18n.contentData, window.I18n.currentLang);
  } else {
    setTimeout(() => {
      if (window.I18n && window.I18n.contentData) {
        renderServices(window.I18n.contentData, window.I18n.currentLang);
      }
    }, 100);
  }

  function renderServices(data, lang) {
    const accordion = document.getElementById('services-accordion');
    if (!accordion || !data) return;

    accordion.innerHTML = '';
    
    // Combine core services and extra services for the detailed view
    const allServices = [
      ...data.home.services.items,
      ...(data.inner.services.extraServices || [])
    ];

    allServices.forEach((item, index) => {
      const title = item.title[lang] || item.title['en'];
      const desc = item.desc ? (item.desc[lang] || item.desc['en']) : '';
      const icon = item.icon || 'ph-check-circle';
      const image = item.image ? `<img src="${item.image}" alt="${title}" style="width:100%; border-radius:12px; margin-top:16px;">` : '';

      const accItem = document.createElement('div');
      // If a hash exists, open the matching item, else default to first item
      const isTarget = window.location.hash === `#${item.id}`;
      const isActive = window.location.hash ? isTarget : index === 0;
      accItem.className = `accordion-item ${isActive ? 'active' : ''}`;
      accItem.id = item.id;
      
      accItem.innerHTML = `
        <div class="accordion-header">
          <div style="display:flex; align-items:center; gap: 12px;">
            <i class="ph ${icon}" style="color: var(--color-primary); font-size: 1.5rem;"></i>
            ${title}
          </div>
          <i class="ph ph-caret-down accordion-icon"></i>
        </div>
        <div class="accordion-body">
          <p>${desc}</p>
          ${image}
        </div>
      `;

      // Accordion click logic
      accItem.querySelector('.accordion-header').addEventListener('click', () => {
        const isActive = accItem.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.accordion-item').forEach(el => {
          el.classList.remove('active');
        });

        // Toggle current
        if (!isActive) {
          accItem.classList.add('active');
        }
      });

      accordion.appendChild(accItem);
    });
  }
});
