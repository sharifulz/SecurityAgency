const I18n = {
  currentLang: localStorage.getItem('lang') || 'en',
  contentData: null,

  async init() {
    // If no language chosen yet, check config.json's default language
    if (!localStorage.getItem('lang') && window.AppConfig?.data?.defaultSettings?.language) {
      this.currentLang = window.AppConfig.data.defaultSettings.language;
    }

    try {
      const res = await fetch('content.json', { cache: 'no-store' });
      this.contentData = await res.json();
      this.syncWithConfig();
      this.applyLanguage(this.currentLang);

      // Dispatch event as soon as content is loaded so dynamic components render immediately
      window.dispatchEvent(new CustomEvent('contentLoaded', { detail: { lang: this.currentLang, data: this.contentData }}));
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang, data: this.contentData }}));
    } catch (err) {
      console.error('Failed to load content.json', err);
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      this.updateToggleButton(langToggle);
      langToggle.addEventListener('click', () => {
        this.currentLang = this.currentLang === 'en' ? 'bn' : 'en';
        localStorage.setItem('lang', this.currentLang);
        this.applyLanguage(this.currentLang);
        this.updateToggleButton(langToggle);
        
        // Dispatch custom event for pages and AppConfig to re-render dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang, data: this.contentData }}));
      });
    }

    // Keep synced if config loads afterwards
    window.addEventListener('configLoaded', () => {
      if (!localStorage.getItem('lang') && window.AppConfig?.data?.defaultSettings?.language) {
        this.currentLang = window.AppConfig.data.defaultSettings.language;
      }
      this.syncWithConfig();
      this.applyLanguage(this.currentLang);
      if (langToggle) this.updateToggleButton(langToggle);
    });
  },

  syncWithConfig() {
    if (!this.contentData || !window.AppConfig?.data) return;
    const config = window.AppConfig.data;

    // Sync global contact info and footer details from config.json
    if (!this.contentData.global) this.contentData.global = {};
    if (!this.contentData.global.contactInfo) this.contentData.global.contactInfo = {};

    if (config.contact) {
      if (config.contact.hotline) this.contentData.global.contactInfo.hotline = config.contact.hotline;
      if (config.contact.hotlineLabel) this.contentData.global.contactInfo.hotlineLabel = config.contact.hotlineLabel;
      if (config.contact.mobile) this.contentData.global.contactInfo.mobile = config.contact.mobile;
      if (config.contact.email) this.contentData.global.contactInfo.email = config.contact.email;

      if (!this.contentData.global.footer) this.contentData.global.footer = {};
      if (config.contact.address) this.contentData.global.footer.address = config.contact.address;
    }

    if (config.company) {
      if (!this.contentData.global.footer) this.contentData.global.footer = {};
      if (config.company.certification) this.contentData.global.footer.certification = config.company.certification;
      if (config.company.about) this.contentData.global.footer.about = config.company.about;
    }
  },

  updateToggleButton(btn) {
    btn.textContent = this.currentLang === 'en' ? 'বাংলা' : 'English';
  },

  applyLanguage(lang) {
    if (!this.contentData) return;
    
    document.documentElement.lang = lang;
    
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.resolvePath(this.contentData, key, lang);
      if (text) {
        if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
          el.value = text;
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
  },

  resolvePath(obj, path, lang) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current[part] === undefined) return null;
      current = current[part];
    }
    return current[lang] || current['en'] || current;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});
