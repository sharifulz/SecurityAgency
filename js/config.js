/**
 * Application Configuration Manager
 * Loads and applies settings from config.json dynamically
 */
const AppConfig = {
  data: null,

  // Fallback defaults if config.json is loaded in an environment with restricted fetch (e.g. file:///)
  defaultConfig: {
    company: {
      name: "Examplex",
      shortName: "Examplex",
      tagline: {
        en: "The Security Expert",
        bn: "নিরাপত্তা বিশেষজ্ঞ"
      },
      about: {
        en: "Pioneers since 1988, delivering trust and reliable security solutions.",
        bn: "১৯৮৮ সাল থেকে অগ্রগামী, বিশ্বস্ত এবং নির্ভরযোগ্য নিরাপত্তা সমাধান প্রদান করছি।"
      },
      establishedYear: 1988,
      certification: "ISO: 9001: 2008 Certified.",
      copyrightText: {
        en: "All rights reserved.",
        bn: "সর্বস্বত্ব সংরক্ষিত।"
      }
    },
    contact: {
      hotline: "09606-773355",
      hotlineRaw: "09606773355",
      hotlineLabel: {
        en: "24 Hours",
        bn: "২৪ ঘন্টা"
      },
      mobile: "+88 01787 650 583",
      mobileRaw: "+8801787650583",
      email: "sales@examplexbd.com",
      supportEmail: "info@examplexbd.com",
      address: {
        en: "House # 10, Block # B, Road No 1, Niketan, Gulshan-1, Dhaka 1212.",
        bn: "বাড়ি # ১০, ব্লক # বি, রোড নং ১, নিকেতন, গুলশান-১, ঢাকা ১২১২।"
      },
      googleMapsUrl: "https://maps.google.com"
    },
    socialMedia: {
      facebook: "https://facebook.com/examplex",
      whatsapp: "https://wa.me/8801787650583",
      youtube: "https://youtube.com/@examplex",
      linkedin: "https://linkedin.com/company/examplex",
      twitter: "https://twitter.com/examplex",
      instagram: "https://instagram.com/examplex"
    },
    defaultSettings: {
      theme: "light",
      language: "en"
    }
  },

  async init() {
    this.data = JSON.parse(JSON.stringify(this.defaultConfig));

    try {
      // cache: 'no-store' ensures live edits in config.json apply on page refresh without browser cache delay
      const res = await fetch('config.json', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        this.data = this.deepMerge(this.data, json);
      }
    } catch (err) {
      console.warn('[AppConfig] Unable to fetch config.json directly (using built-in defaults):', err);
    }

    // Apply defaults and render DOM
    this.applySettings();
    this.render();

    // Re-render when language changes
    window.addEventListener('languageChanged', (e) => {
      this.render(e.detail.lang);
    });

    // Notify other components
    window.dispatchEvent(new CustomEvent('configLoaded', { detail: this.data }));
  },

  deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const output = Object.assign({}, target);
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  },

  applySettings() {
    // 1. Default Theme Mode (if user has not set a preference in localStorage)
    const savedTheme = localStorage.getItem('theme');
    const defaultTheme = this.data.defaultSettings?.theme || 'light';
    const htmlEl = document.documentElement;

    if (!savedTheme) {
      if (defaultTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        htmlEl.setAttribute('data-theme', defaultTheme);
      }
    }

    // 2. Default Language (if user has not chosen language in localStorage)
    const savedLang = localStorage.getItem('lang');
    const defaultLang = this.data.defaultSettings?.language || 'en';
    if (!savedLang) {
      localStorage.setItem('lang', defaultLang);
      if (window.I18n) {
        window.I18n.currentLang = defaultLang;
      }
    }
  },

  render(lang) {
    if (!this.data) return;
    const currentLang = lang || localStorage.getItem('lang') || this.data.defaultSettings?.language || 'en';

    // 1. Render all [data-config] text bindings
    document.querySelectorAll('[data-config]').forEach(el => {
      const path = el.getAttribute('data-config');
      const val = this.resolveValue(this.data, path, currentLang);
      if (val !== undefined && val !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // 2. Dynamic Page Titles & Meta Description
    this.updateTitles(currentLang);
    this.updateMetaDescription(currentLang);

    // 3. Generic Attribute Bindings via [data-config-attr]
    // Syntax: data-config-attr="href:contact.googleMapsUrl" or "href:contact.googleMapsUrl,title:company.name"
    document.querySelectorAll('[data-config-attr]').forEach(el => {
      const bindingStr = el.getAttribute('data-config-attr');
      const pairs = bindingStr.split(',');
      pairs.forEach(pair => {
        const [attr, path] = pair.split(':').map(s => s.trim());
        if (attr && path) {
          const val = this.resolveValue(this.data, path, currentLang);
          if (val) el.setAttribute(attr, val);
        }
      });
    });

    // 4. Phone / Mobile / Email / Map Links
    const hotlineRaw = this.data.contact?.hotlineRaw || (this.data.contact?.hotline ? this.data.contact.hotline.replace(/[^0-9+]/g, '') : '');
    const mobileRaw = this.data.contact?.mobileRaw || (this.data.contact?.mobile ? this.data.contact.mobile.replace(/[^0-9+]/g, '') : '');

    document.querySelectorAll('.config-hotline-link').forEach(link => {
      if (hotlineRaw) link.setAttribute('href', `tel:${hotlineRaw}`);
    });

    document.querySelectorAll('.config-mobile-link').forEach(link => {
      if (mobileRaw) link.setAttribute('href', `tel:${mobileRaw}`);
    });

    document.querySelectorAll('.config-email-link').forEach(link => {
      if (this.data.contact?.email) link.setAttribute('href', `mailto:${this.data.contact.email}`);
    });

    document.querySelectorAll('.config-maps-link').forEach(link => {
      if (this.data.contact?.googleMapsUrl) link.setAttribute('href', this.data.contact.googleMapsUrl);
    });

    // 4. Floating Action Buttons
    document.querySelectorAll('.fab-call').forEach(btn => {
      if (hotlineRaw) btn.setAttribute('href', `tel:${hotlineRaw}`);
    });

    // WhatsApp: priority to socialMedia.whatsapp, then wa.me with mobileRaw
    let waUrl = this.data.socialMedia?.whatsapp;
    if (!waUrl && mobileRaw) {
      waUrl = `https://wa.me/${mobileRaw.replace(/[^0-9]/g, '')}`;
    }
    document.querySelectorAll('.config-whatsapp-link, .fab-whatsapp').forEach(btn => {
      if (waUrl) {
        btn.setAttribute('href', waUrl);
        btn.style.display = '';
      } else {
        btn.style.display = 'none';
      }
    });

    // 5. Social Media Links
    this.renderSocialLinks();

    // 6. Current Year in footer
    document.querySelectorAll('.current-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  },

  updateTitles(lang) {
    const companyName = this.data.company?.name || 'Examplex';
    const tagline = this.resolveValue(this.data, 'company.tagline', lang) || 'The Security Expert';

    const titleEl = document.querySelector('title');
    if (titleEl) {
      const pageTitle = titleEl.getAttribute('data-page-title');
      if (pageTitle) {
        titleEl.textContent = `${pageTitle} - ${companyName}`;
      } else if (titleEl.getAttribute('data-is-home') === 'true') {
        titleEl.textContent = `${companyName} - ${tagline}`;
      }
    }
  },

  updateMetaDescription(lang) {
    const desc = this.resolveValue(this.data, 'company.description', lang);
    if (desc) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', desc);
    }
  },

  renderSocialLinks() {
    if (!this.data?.socialMedia) return;
    const socials = this.data.socialMedia;

    const iconDefs = [
      { key: 'facebook', icon: 'ph-facebook-logo', label: 'Facebook' },
      { key: 'whatsapp', icon: 'ph-whatsapp-logo', label: 'WhatsApp' },
      { key: 'youtube', icon: 'ph-youtube-logo', label: 'YouTube' },
      { key: 'linkedin', icon: 'ph-linkedin-logo', label: 'LinkedIn' },
      { key: 'twitter', icon: 'ph-twitter-logo', label: 'Twitter / X' },
      { key: 'instagram', icon: 'ph-instagram-logo', label: 'Instagram' }
    ];

    const containers = document.querySelectorAll('.social-links, .top-bar-right, .config-social-container');
    containers.forEach(container => {
      container.innerHTML = '';
      iconDefs.forEach(item => {
        const url = socials[item.key];
        if (url && typeof url === 'string' && url.trim() !== '' && url !== '#') {
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.setAttribute('aria-label', item.label);
          a.title = item.label;
          a.innerHTML = `<i class="ph-fill ${item.icon}"></i>`;
          container.appendChild(a);
        }
      });
    });
  },

  resolveValue(obj, path, lang) {
    if (!obj || !path) return null;
    const parts = path.split('.');
    let cur = obj;
    for (const part of parts) {
      if (cur === undefined || cur === null) return null;
      cur = cur[part];
    }
    if (cur !== null && typeof cur === 'object') {
      return cur[lang] || cur['en'] || Object.values(cur)[0];
    }
    return cur;
  }
};

window.AppConfig = AppConfig;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AppConfig.init());
} else {
  AppConfig.init();
}

