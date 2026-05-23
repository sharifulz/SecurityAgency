document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('languageChanged', (e) => {
    renderBranches(e.detail.data, e.detail.lang);
  });

  if (window.I18n && window.I18n.contentData) {
    renderBranches(window.I18n.contentData, window.I18n.currentLang);
  } else {
    setTimeout(() => {
      if (window.I18n && window.I18n.contentData) {
        renderBranches(window.I18n.contentData, window.I18n.currentLang);
      }
    }, 100);
  }

  function renderBranches(data, lang) {
    const grid = document.getElementById('branches-grid');
    if (!grid || !data) return;

    grid.innerHTML = '';
    
    data.inner.branches.locations.forEach((loc) => {
      const name = loc.name[lang] || loc.name['en'];

      const card = document.createElement('div');
      card.className = 'grid-card';
      
      card.innerHTML = `
        <div style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: 16px;">
          <i class="ph-fill ph-map-pin"></i>
        </div>
        <h3>${name}</h3>
        <p>Zonal Office</p>
      `;

      grid.appendChild(card);
    });
  }
});
