document.addEventListener('DOMContentLoaded', () => {
  const fallbackBranches = [
    { name: { en: "Dhaka (Gulshan, Motijheel, Badda)", bn: "ঢাকা (গুলশান, মতিঝিল, বাড্ডা)" }, zone: "North & South Zone" },
    { name: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" }, zone: "Industrial Zone" },
    { name: { en: "Chittagong", bn: "চট্টগ্রাম" }, zone: "Port & Commercial Zone" },
    { name: { en: "Cox's Bazar", bn: "কক্সবাজার" }, zone: "Coastal & Hospitality Zone" },
    { name: { en: "Cumilla", bn: "কুমিল্লা" }, zone: "Eastern Region Hub" },
    { name: { en: "Gazipur", bn: "গাজীপুর" }, zone: "Garments & Manufacturing Zone" },
    { name: { en: "Sylhet", bn: "সিলেট" }, zone: "Tea Estate & Expatriate Hub" },
    { name: { en: "Teknaf", bn: "টেকনাফ" }, zone: "Border & Logistics Outpost" }
  ];

  const initialLang = localStorage.getItem('lang') || 'en';

  if (window.I18n && window.I18n.contentData) {
    renderBranches(window.I18n.contentData, window.I18n.currentLang || initialLang);
  } else {
    renderBranchesList(fallbackBranches, initialLang);
  }

  window.addEventListener('contentLoaded', (e) => {
    if (e.detail?.data) renderBranches(e.detail.data, e.detail.lang || initialLang);
  });

  window.addEventListener('languageChanged', (e) => {
    if (e.detail?.data) {
      renderBranches(e.detail.data, e.detail.lang);
    } else {
      renderBranchesList(fallbackBranches, e.detail?.lang || initialLang);
    }
  });

  function renderBranches(data, lang) {
    const list = data?.inner?.branches?.locations || fallbackBranches;
    renderBranchesList(list, lang);
  }

  function renderBranchesList(locations, lang) {
    const grid = document.getElementById('branches-grid');
    if (!grid || !locations) return;

    grid.innerHTML = '';

    const hotline = window.AppConfig?.data?.contact?.hotline || "09606-773355";
    const hotlineRaw = window.AppConfig?.data?.contact?.hotlineRaw || "09606773355";
    const zonalLabel = lang === 'bn' ? 'আঞ্চলিক কার্যালয়' : 'Regional Branch';
    const supportLabel = lang === 'bn' ? '২৪/৭ সহায়তা:' : '24/7 Support:';

    locations.forEach((loc) => {
      const name = (loc.name && (loc.name[lang] || loc.name['en'])) || loc.name || loc;
      const zoneName = loc.zone || 'Operational Zone';

      const card = document.createElement('div');
      card.className = 'grid-card';
      card.innerHTML = `
        <div style="font-size: 2.5rem; color: var(--color-primary); margin-bottom: 16px;">
          <i class="ph-fill ph-map-pin"></i>
        </div>
        <h3>${name}</h3>
        <p style="color: var(--color-primary); font-weight: 600; margin-bottom: 6px;">${zonalLabel}</p>
        <p style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: 16px;">${zoneName}</p>
        <a href="tel:${hotlineRaw}" class="btn btn-secondary" style="font-size: 0.85rem; padding: 8px 16px; width: 100%;">
          <i class="ph ph-phone-call"></i> ${supportLabel} ${hotline}
        </a>
      `;

      grid.appendChild(card);
    });
  }
});
