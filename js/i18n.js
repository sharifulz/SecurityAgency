const I18n = {
  currentLang: localStorage.getItem('lang') || 'en',
  contentData: null,

  async init() {
    try {
      const res = await fetch('content.json');
      this.contentData = await res.json();
      this.applyLanguage(this.currentLang);
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
        
        // Dispatch custom event for pages that need to re-render dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang, data: this.contentData }}));
      });
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
