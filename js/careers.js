document.addEventListener('DOMContentLoaded', () => {
  const fallbackJobs = [
    {
      position: { en: "Security Operations Supervisor", bn: "নিরাপত্তা অপারেশন সুপারভাইজার" },
      requirements: { en: "Ex-military/Police preferred, 3+ years experience in team leadership", bn: "প্রাক্তন সামরিক/পুলিশ অগ্রাধিকার, দল পরিচালনায় ৩+ বছরের অভিজ্ঞতা" },
      location: { en: "Dhaka (Headquarters)", bn: "ঢাকা (প্রধান কার্যালয়)" }
    },
    {
      position: { en: "Executive Guard Specialist", bn: "এক্সিকিউটিভ গার্ড স্পেশালিস্ট" },
      requirements: { en: "Physical fitness, Height min 5'8\", Basic English communication", bn: "শারীরিক সুস্থতা, উচ্চতা ন্যূনতম ৫'৮\", প্রাথমিক ইংরেজি যোগাযোগ" },
      location: { en: "Chittagong & Dhaka", bn: "চট্টগ্রাম ও ঢাকা" }
    },
    {
      position: { en: "CCTV & Electronic Monitoring Operator", bn: "সিসিটিভি ও ইলেকট্রনিক মনিটরিং অপারেটর" },
      requirements: { en: "Diploma in IT or Electronics, Experience with surveillance software", bn: "আইটি বা ইলেকট্রনিক্সে ডিপ্লোমা, নজরদারি সফটওয়্যারে অভিজ্ঞতা" },
      location: { en: "Dhaka Control Center", bn: "ঢাকা নিয়ন্ত্রণ কেন্দ্র" }
    },
    {
      position: { en: "Cash-in-Transit (CIT) Armed Guard", bn: "ক্যাশ-ইন-ট্রানজিট (সিআইটি) সশস্ত্র প্রহরী" },
      requirements: { en: "Licensed firearm handler, disciplined background verification", bn: "লাইসেন্সপ্রাপ্ত আগ্নেয়াস্ত্র চালক, সুশৃঙ্খল ব্যাকগ্রাউন্ড যাচাইকরণ" },
      location: { en: "Sylhet, Narayanganj & Cumilla", bn: "সিলেট, নারায়ণগঞ্জ ও কুমিল্লা" }
    }
  ];

  const initialLang = localStorage.getItem('lang') || 'en';

  if (window.I18n && window.I18n.contentData) {
    renderCareers(window.I18n.contentData, window.I18n.currentLang || initialLang);
  } else {
    renderCareersList(fallbackJobs, initialLang);
  }

  window.addEventListener('contentLoaded', (e) => {
    if (e.detail?.data) renderCareers(e.detail.data, e.detail.lang || initialLang);
  });

  window.addEventListener('languageChanged', (e) => {
    if (e.detail?.data) {
      renderCareers(e.detail.data, e.detail.lang);
    } else {
      renderCareersList(fallbackJobs, e.detail?.lang || initialLang);
    }
  });

  function renderCareers(data, lang) {
    const list = data?.inner?.careers?.jobs || fallbackJobs;
    renderCareersList(list, lang);
  }

  function renderCareersList(jobs, lang) {
    const grid = document.getElementById('careers-grid');
    if (!grid || !jobs) return;

    grid.innerHTML = '';

    const email = window.AppConfig?.data?.contact?.email || 'sales@examplexbd.com';
    const applyLabel = lang === 'bn' ? 'আবেদন করুন' : 'Apply Now';
    const locLabel = lang === 'bn' ? 'অবস্থান:' : 'Location:';
    const reqLabel = lang === 'bn' ? 'যোগ্যতা:' : 'Requirements:';

    jobs.forEach((job) => {
      const position = (job.position && (job.position[lang] || job.position['en'])) || job.position;
      const requirements = (job.requirements && (job.requirements[lang] || job.requirements['en'])) || job.requirements;
      const location = (job.location && (job.location[lang] || job.location['en'])) || job.location;

      const card = document.createElement('div');
      card.className = 'grid-card';
      card.innerHTML = `
        <div style="font-size: 2rem; color: var(--color-primary); margin-bottom: 12px;">
          <i class="ph-fill ph-briefcase"></i>
        </div>
        <h3 style="margin-bottom: 12px;">${position}</h3>
        <p style="margin-bottom: 8px;"><strong><i class="ph ph-map-pin"></i> ${locLabel}</strong> ${location}</p>
        <p style="margin-bottom: 16px;"><strong><i class="ph ph-list-checks"></i> ${reqLabel}</strong> ${requirements}</p>
        <a href="mailto:${email}?subject=Job Application - ${encodeURIComponent(position)}" class="btn btn-secondary mt-2" style="width: 100%; text-align: center; justify-content: center;">
          <i class="ph ph-paper-plane-tilt"></i> ${applyLabel}
        </a>
      `;

      grid.appendChild(card);
    });
  }
});
