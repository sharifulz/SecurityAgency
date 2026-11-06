document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;
  
  function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
      return;
    }

    // Use default theme from config.json (or fallback)
    const configTheme = window.AppConfig?.data?.defaultSettings?.theme || 'light';
    if (configTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = prefersDark ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', resolved);
      updateThemeIcon(resolved);
    } else {
      htmlEl.setAttribute('data-theme', configTheme);
      updateThemeIcon(configTheme);
    }
  }

  // Initial theme application
  applyTheme();

  // If config.json loads after theme.js
  window.addEventListener('configLoaded', () => {
    if (!localStorage.getItem('theme')) {
      applyTheme();
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    if (theme === 'dark') {
      themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
    }
  }
});
