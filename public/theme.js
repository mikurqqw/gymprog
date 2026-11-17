(() => {
  let preference = 'dark';
  try {
    const raw = localStorage.getItem('ironcycle:data');
    if (raw) {
      const saved = JSON.parse(raw);
      const value = saved.themePreference ?? saved.theme;
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
