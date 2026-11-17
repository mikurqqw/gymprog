import { useEffect } from 'react';
import { useStore } from '../lib/store';
export function ThemeController() {
  const { theme, themePreference } = useStore();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themePreference = themePreference;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0b1020' : '#f3f6ff');
  }, [theme, themePreference]);
  return null;
}
