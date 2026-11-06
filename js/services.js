document.addEventListener('DOMContentLoaded', () => {
  const fallbackServices = [
    {
      id: "static-manpower",
      title: { en: "Static Manpower Services", bn: "কর্মী সেবা" },
      desc: { en: "Trained personnel handling access control, patrol services, and emergency response.", bn: "প্রশিক্ষিত কর্মী যারা প্রবেশাধিকার নিয়ন্ত্রণ, টহল সেবা এবং জরুরি প্রতিক্রিয়া পরিচালনা করে।" },
      icon: "ph-shield-check",
      image: "https://placehold.co/600x400/1E3A8A/FFF?text=Static+Manpower"
    },
    {
      id: "cash-in-transit",
      title: { en: "Cash in Transit Service", bn: "ক্যাশ-ইন-ট্রানজিট" },
      desc: { en: "Secure transportation of cash with armored vehicles and armed escort guards.", bn: "সাঁজোয়া যান এবং সশস্ত্র এসকর্ট গার্ড সহ নগদ অর্থের নিরাপদ পরিবহন।" },
      icon: "ph-truck",
      image: "https://placehold.co/600x400/1E3A8A/FFF?text=Cash+in+Transit"
    },
    {
      id: "escorting-service",
      title: { en: "Special Security / Escorting Service", bn: "বিশেষ নিরাপত্তা / এসকর্টিং পরিষেবা" },
      desc: { en: "Premium bodyguard, dignitary protection, and VIP executive escort services.", bn: "প্রিমিয়াম দেহরক্ষী, বিশিষ্ট ব্যক্তিত্ব সুরক্ষা এবং ভিআইপি নির্বাহী এসকর্ট পরিষেবা।" },
      icon: "ph-user-focus",
      image: "https://placehold.co/600x400/1E3A8A/FFF?text=Escorting+Service"
    },
    {
      id: "electronic-security",
      title: { en: "Electronic Security Service", bn: "ইলেকট্রনিক নিরাপত্তা পরিষেবা" },
      desc: { en: "Centralized monitoring, CCTV surveillance, access control, and alarm systems.", bn: "কেন্দ্রীভূত অপারেশন, সিসিটিভি নজরদারি, অ্যাক্সেস নিয়ন্ত্রণ এবং অ্যালার্ম সরঞ্জাম।" },
      icon: "ph-desktop",
      image: "https://placehold.co/600x400/1E3A8A/FFF?text=Electronic+Security"
    },
    {
      id: "cash-management",
      title: { en: "Total Cash Management", bn: "মোট ক্যাশ ব্যবস্থাপনা" },
      desc: { en: "Comprehensive management, ATM cash replenishment, vaulting, and cash sorting.", bn: "এটিএম ক্যাশের ব্যাপক ব্যবস্থাপনা, নিরাপত্তা, ভল্টিং এবং ক্যাশ বাছাইকরণ।" },
      icon: "ph-credit-card",
      image: "https://placehold.co/600x400/1E3A8A/FFF?text=Cash+Management"
    }
  ];

  const initialLang = localStorage.getItem('lang') || 'en';

  // Immediate initial render
  if (window.I18n && window.I18n.contentData) {
    renderServices(window.I18n.contentData, window.I18n.currentLang || initialLang);
  } else {
    renderServicesList(fallbackServices, initialLang);
  }

  // Listen to both contentLoaded and languageChanged
  window.addEventListener('contentLoaded', (e) => {
    if (e.detail?.data) renderServices(e.detail.data, e.detail.lang || initialLang);
  });

  window.addEventListener('languageChanged', (e) => {
    if (e.detail?.data) {
      renderServices(e.detail.data, e.detail.lang);
    } else {
      renderServicesList(fallbackServices, e.detail?.lang || initialLang);
    }
  });

  function renderServices(data, lang) {
    const allServices = [
      ...(data?.home?.services?.items || fallbackServices),
      ...(data?.inner?.services?.extraServices || [])
    ];
    renderServicesList(allServices, lang);
  }

  function renderServicesList(allServices, lang) {
    const accordion = document.getElementById('services-accordion');
    if (!accordion || !allServices) return;

    accordion.innerHTML = '';

    allServices.forEach((item, index) => {
      const title = item.title[lang] || item.title['en'] || item.title;
      const desc = item.desc ? (item.desc[lang] || item.desc['en'] || item.desc) : '';
      const icon = item.icon || 'ph-check-circle';
      const image = item.image ? `<img src="${item.image}" alt="${title}" style="width:100%; border-radius:12px; margin-top:16px;">` : '';

      const accItem = document.createElement('div');
      const isTarget = window.location.hash === `#${item.id}`;
      const isActive = window.location.hash ? isTarget : index === 0;
      accItem.className = `accordion-item ${isActive ? 'active' : ''}`;
      accItem.id = item.id;
      
      accItem.innerHTML = `
        <div class="accordion-header">
          <div style="display:flex; align-items:center; gap: 14px;">
            <i class="ph ${icon}" style="color: var(--color-primary); font-size: 1.5rem;"></i>
            <span>${title}</span>
          </div>
          <i class="ph ph-caret-down accordion-icon"></i>
        </div>
        <div class="accordion-body">
          <p>${desc}</p>
          ${image}
        </div>
      `;

      accItem.querySelector('.accordion-header').addEventListener('click', () => {
        const isOpen = accItem.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
        if (!isOpen) accItem.classList.add('active');
      });

      accordion.appendChild(accItem);
    });
  }
});
