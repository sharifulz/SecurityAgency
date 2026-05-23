document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('languageChanged', (e) => {
    renderCareers(e.detail.data, e.detail.lang);
  });

  if (window.I18n && window.I18n.contentData) {
    renderCareers(window.I18n.contentData, window.I18n.currentLang);
  } else {
    setTimeout(() => {
      if (window.I18n && window.I18n.contentData) {
        renderCareers(window.I18n.contentData, window.I18n.currentLang);
      }
    }, 100);
  }

  function renderCareers(data, lang) {
    const grid = document.getElementById('careers-grid');
    if (!grid || !data) return;

    grid.innerHTML = '';
    
    data.inner.careers.jobs.forEach((job) => {
      const position = job.position[lang] || job.position['en'];
      const requirements = job.requirements[lang] || job.requirements['en'];
      const location = job.location[lang] || job.location['en'];

      const card = document.createElement('div');
      card.className = 'grid-card';
      
      card.innerHTML = `
        <div style="font-size: 2rem; color: var(--color-primary); margin-bottom: 12px;">
          <i class="ph-fill ph-briefcase"></i>
        </div>
        <h3>${position}</h3>
        <p><strong><i class="ph ph-map-pin"></i> Location:</strong> ${location}</p>
        <p><strong><i class="ph ph-list-checks"></i> Requirements:</strong> ${requirements}</p>
        <button class="btn btn-secondary mt-4" style="width: 100%;">Apply Now</button>
      `;

      grid.appendChild(card);
    });
  }
});
