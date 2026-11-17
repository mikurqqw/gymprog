(() => {
  let preference = 'dark';
  try {
    const raw = localStorage.getItem('ironcycle:preferences');
    if (raw && raw.length <= 10000) {
      const saved = JSON.parse(raw);
      const value = saved.themePreference;
      if (['dark', 'light', 'system'].includes(value)) preference = value;
    }
  } catch {
    /* Blocked or invalid storage falls back to the default without writing. */
  }
  const theme =
    preference === 'system'
      ? matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : preference;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = theme;
})();
