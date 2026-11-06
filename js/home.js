document.addEventListener('DOMContentLoaded', () => {
  // Built-in fallback data so the page is NEVER empty even on file:/// or before fetch resolves
  const fallbackData = {
    testimonials: [
      {
        author: "Shams Mohammad",
        role: { en: "Head of Corporate Security", bn: "প্রধান কর্পোরেট নিরাপত্তা" },
        company: { en: "Apex Holdings Ltd.", bn: "এপেক্স হোল্ডিংস লিমিটেড" },
        rating: 5,
        review: {
          en: "One of the best security service providers. Manned guarding, cash carrying, security operators, and centralized monitoring are executed with utmost precision.",
          bn: "সেরা নিরাপত্তা পরিষেবা প্রদানকারীদের একজন। ম্যানড গার্ডিং, ক্যাশ ক্যারিং, সিকিউরিটি অপারেটর এবং সেন্ট্রালাইজড মনিটরিং সর্বোচ্চ নির্ভুলতার সাথে পরিচালিত হয়।"
        }
      },
      {
        author: "Samsul Arefin",
        role: { en: "Regional Operations Manager", bn: "আঞ্চলিক অপারেশন ম্যানেজার" },
        company: { en: "Global NGO Alliance", bn: "গ্লোবাল এনজিও অ্যালায়েন্স" },
        rating: 5,
        review: {
          en: "Reliable security partner providing seamless 24/7 protection for multinational companies, expatriates, and humanitarian missions across remote zones.",
          bn: "নির্ভরযোগ্য নিরাপত্তা অংশীদার যা দূরবর্তী অঞ্চলে বহুজাতিক কোম্পানি, প্রবাসী এবং মানবিক মিশনের জন্য নিরবচ্ছিন্ন ২৪/৭ সুরক্ষা প্রদান করে।"
        }
      },
      {
        author: "Farhana Rahman",
        role: { en: "VP, General Services", bn: "ভিপি, জেনারেল সার্ভিসেস" },
        company: { en: "Prime Commercial Bank", bn: "প্রাইম কমার্শিয়াল ব্যাংক" },
        rating: 5,
        review: {
          en: "Their Total Cash Management and ATM replenishment protection services are unmatched. Zero incident record over 5 continuous years of partnership.",
          bn: "তাদের টোটাল ক্যাশ ম্যানেজমেন্ট এবং এটিএম রিপ্লেনিশমেন্ট সুরক্ষা পরিষেবা অতুলনীয়। ৫ বছরের নিরবচ্ছিন্ন অংশীদারিত্বে শূন্য ঘটনার রেকর্ড।"
        }
      },
      {
        author: "Marcus Vance",
        role: { en: "Chief Security Officer", bn: "চিফ সিকিউরিটি অফিসার" },
        company: { en: "International Logistics Hub", bn: "আন্তর্জাতিক লজিস্টিকস হাব" },
        rating: 5,
        review: {
          en: "The static manpower and rapid-response units are exceptionally disciplined. Their intensive training standard reflects clearly in guard professionalism.",
          bn: "স্ট্যাটিক ম্যানপাওয়ার এবং দ্রুত-প্রতিক্রিয়া ইউনিটগুলি ব্যতিক্রমীভাবে সুশৃঙ্খল। তাদের নিবিড় প্রশিক্ষণ মান গার্ডদের পেশাদারিত্বে স্পষ্টভাবে প্রতিফলিত হয়।"
        }
      },
      {
        author: "Dr. Tariqul Islam",
        role: { en: "Director of Administration", bn: "প্রশাসন পরিচালক" },
        company: { en: "Central Specialized Hospital", bn: "সেন্ট্রাল স্পেশালাইজড হাসপাতাল" },
        rating: 5,
        review: {
          en: "Courteous personnel, effective access control, and electronic surveillance integration. Our patients, doctors, and staff feel completely safe around the clock.",
          bn: "ভদ্র কর্মী, কার্যকর অ্যাক্সেস নিয়ন্ত্রণ এবং ইলেকট্রনিক নজরদারি ইন্টিগ্রেশন। আমাদের রোগী, ডাক্তার এবং কর্মীরা চব্বিশ ঘন্টা সম্পূর্ণ নিরাপদ বোধ করেন।"
        }
      }
    ]
  };

  let carouselState = {
    currentIndex: 0,
    totalItems: 0,
    autoPlayTimer: null,
    itemsData: fallbackData.testimonials
  };

  // Immediate first render using fallback or existing contentData
  const initialLang = localStorage.getItem('lang') || 'en';
  if (window.I18n && window.I18n.contentData) {
    renderDynamicContent(window.I18n.contentData, initialLang);
  } else {
    // Render fallback reviews immediately so cards are visible 0ms on load
    renderTestimonialsCarousel(carouselState.itemsData, initialLang);
  }

  // Listen for contentLoaded & languageChanged events
  window.addEventListener('contentLoaded', (e) => {
    if (e.detail?.data) {
      renderDynamicContent(e.detail.data, e.detail.lang || initialLang);
    }
  });

  window.addEventListener('languageChanged', (e) => {
    if (e.detail?.data) {
      renderDynamicContent(e.detail.data, e.detail.lang);
    } else {
      renderTestimonialsCarousel(carouselState.itemsData, e.detail?.lang || initialLang);
    }
  });

  function renderDynamicContent(data, lang) {
    if (!data) return;
    const currentLang = lang || 'en';

    // 1. Services Grid
    const servicesGrid = document.getElementById('services-grid');
    if (servicesGrid && data.home?.services?.items) {
      servicesGrid.innerHTML = '';
      data.home.services.items.forEach(item => {
        const title = item.title[currentLang] || item.title['en'];
        const desc = item.desc[currentLang] || item.desc['en'];

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

    // 2. Testimonials Carousel
    const items = data.home?.testimonials?.items || fallbackData.testimonials;
    carouselState.itemsData = items;
    renderTestimonialsCarousel(items, currentLang);

    // 3. Quick Links
    const quickLinks = document.getElementById('quick-links');
    if (quickLinks && data.global?.footer?.quickLinks) {
      quickLinks.innerHTML = '';
      data.global.footer.quickLinks.forEach(link => {
        const text = link[currentLang] || link['en'] || link;
        const url = link.url || 'contact.html';
        const li = document.createElement('li');
        li.innerHTML = `<a href="${url}"><i class="ph ph-caret-right"></i> ${text}</a>`;
        quickLinks.appendChild(li);
      });
    }
  }

  function renderTestimonialsCarousel(items, lang) {
    const track = document.getElementById('testimonial-track');
    const currentEl = document.getElementById('review-current');
    const totalEl = document.getElementById('review-total');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    const dotsContainer = document.getElementById('review-dots');

    if (!track || !items || !items.length) return;

    carouselState.totalItems = items.length;

    if (totalEl) {
      totalEl.textContent = String(items.length).padStart(2, '0');
    }

    // Render cards
    track.innerHTML = '';
    items.forEach(item => {
      const reviewText = (item.review && (item.review[lang] || item.review['en'])) || item.review || '';
      const initial = item.author ? item.author.charAt(0) : 'U';
      const roleText = item.role ? (item.role[lang] || item.role['en'] || '') : '';
      const companyText = item.company ? (item.company[lang] || item.company['en'] || '') : '';
      const rating = item.rating || 5;

      const starIcons = Array(rating).fill('<i class="ph-fill ph-star"></i>').join('');
      const verifiedText = lang === 'bn' ? 'যাচাইকৃত ক্লায়েন্ট' : 'Verified Client';

      const card = document.createElement('div');
      card.className = 'feedback-card';
      card.innerHTML = `
        <div class="feedback-card-header">
          <div class="review-stars">${starIcons}</div>
          <span class="verified-pill">
            <i class="ph-fill ph-check-circle"></i> ${verifiedText}
          </span>
        </div>
        <p class="feedback-text">"${reviewText}"</p>
        <div class="feedback-author-row">
          <div class="author-left">
            <div class="feedback-avatar">${initial}</div>
            <div class="author-meta">
              <h4>${item.author}</h4>
              <p>${roleText}${roleText && companyText ? ' • ' : ''}${companyText}</p>
            </div>
          </div>
          <i class="ph-fill ph-quotes feedback-quote-icon"></i>
        </div>
      `;
      track.appendChild(card);
    });

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 600) return 1;
      if (w <= 992) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, carouselState.totalItems - visible);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIdx = getMaxIndex();
      const dotCount = maxIdx + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = `review-dot ${i === carouselState.currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => {
          carouselState.currentIndex = i;
          updatePosition();
          restartAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updatePosition(animate = true) {
      const maxIdx = getMaxIndex();
      if (carouselState.currentIndex > maxIdx) {
        carouselState.currentIndex = maxIdx;
      }
      if (carouselState.currentIndex < 0) {
        carouselState.currentIndex = 0;
      }

      const cards = track.querySelectorAll('.feedback-card');
      if (cards.length > 0) {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 24;
        const offset = carouselState.currentIndex * (cardWidth + gap);
        track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translateX(-${offset}px)`;
      }

      if (currentEl) {
        currentEl.textContent = String(carouselState.currentIndex + 1).padStart(2, '0');
      }

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.review-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === carouselState.currentIndex);
        });
      }
    }

    if (nextBtn) {
      const newNext = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNext, nextBtn);
      newNext.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        carouselState.currentIndex = (carouselState.currentIndex >= maxIdx) ? 0 : carouselState.currentIndex + 1;
        updatePosition();
        restartAutoPlay();
      });
    }

    if (prevBtn) {
      const newPrev = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrev, prevBtn);
      newPrev.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        carouselState.currentIndex = (carouselState.currentIndex <= 0) ? maxIdx : carouselState.currentIndex - 1;
        updatePosition();
        restartAutoPlay();
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      carouselState.autoPlayTimer = setInterval(() => {
        const maxIdx = getMaxIndex();
        if (maxIdx > 0) {
          carouselState.currentIndex = (carouselState.currentIndex >= maxIdx) ? 0 : carouselState.currentIndex + 1;
          updatePosition();
        }
      }, 5000);
    }

    function stopAutoPlay() {
      if (carouselState.autoPlayTimer) {
        clearInterval(carouselState.autoPlayTimer);
        carouselState.autoPlayTimer = null;
      }
    }

    function restartAutoPlay() {
      startAutoPlay();
    }

    const wrapper = document.querySelector('.review-carousel-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoPlay);
      wrapper.addEventListener('mouseleave', startAutoPlay);
      wrapper.addEventListener('touchstart', stopAutoPlay, { passive: true });
      wrapper.addEventListener('touchend', startAutoPlay, { passive: true });
    }

    buildDots();
    // Delay position update slightly so layout widths have computed accurately
    requestAnimationFrame(() => {
      updatePosition(false);
    });
    startAutoPlay();

    window.addEventListener('resize', () => {
      buildDots();
      updatePosition(false);
    });
  }

  // Visual counter animation for stats
  const workforce = document.getElementById('workforce-counter');
  if (workforce) {
    workforce.style.opacity = '0';
    setTimeout(() => {
      workforce.style.transition = 'opacity 1s ease';
      workforce.style.opacity = '1';
    }, 400);
  }
});
