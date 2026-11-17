import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useStore } from '../lib/store';
const titles: Record<string, string> = {
  welcome: 'sfTitle',
  about: 'compactAbout',
  catalog: 'sfPrograms',
  demo: 'sfDemo',
  start: 'onboarding',
  profile: 'profile',
  program: 'program',
  workout: 'today',
  checkin: 'checkin',
  nutrition: 'nutrition',
  progress: 'progress',
  library: 'library',
  reference: 'reference',
  settings: 'settings',
  test: 'test',
  builder: 'builder',
  injuries: 'injuryModule',
  'privacy-consent': 'privacyConsent',
};
export function RouteMetadata() {
  const location = useLocation(),
    state = useStore(),
    { t } = useI18n();
  const path = location.pathname.split('/')[1],
    key = titles[path] ?? (path ? 'notFound' : state.onboarded ? 'sfDashboardTitle' : 'sfTitle'),
    title = t(key).replace(/\s+/g, ' ') + ' · IronCycle',
    language = state.language;
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = language;
    const site = new URL(import.meta.env.VITE_SITE_URL || 'https://mikurqqw.github.io/gymprog/');
    if (language !== 'ru') site.searchParams.set('lang', language);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', site.href);
  }, [title, language]);
  return null;
}
