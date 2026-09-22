/** Shared VCF Tools theme preference: light | dark | system (default). */
(function () {
  const KEY = 'vcf-tools.theme';

  function resolve(pref) {
    if (pref === 'light' || pref === 'dark') return pref;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function apply(pref) {
    const mode = resolve(pref);
    document.documentElement.dataset.themePref = pref;
    document.documentElement.style.colorScheme = mode;
    if (document.body) document.body.setAttribute('cds-theme', mode);
    syncSwitcher(pref);
  }

  function syncSwitcher(pref) {
    const root = document.getElementById('theme-switcher');
    if (!root) return;
    root.querySelectorAll('[data-theme]').forEach((button) => {
      const active = button.dataset.theme === pref;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function get() {
    return localStorage.getItem(KEY) || 'system';
  }

  function set(pref) {
    localStorage.setItem(KEY, pref);
    apply(pref);
  }

  apply(get());

  document.addEventListener('DOMContentLoaded', () => {
    apply(get());
    const root = document.getElementById('theme-switcher');
    if (!root) return;
    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-theme]');
      if (!button || !root.contains(button)) return;
      set(button.dataset.theme);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (get() === 'system') apply('system');
  });

  window.__vcfTheme = { key: KEY, get, set, resolve, apply };
})();
