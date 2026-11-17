import { languages, type Language } from './language';
export function languageFromSearch(search: string): Language | undefined {
  const value = new URLSearchParams(search).get('lang');
  return languages.find((language) => language === value);
}
export function syncLanguageUrl(language: Language) {
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(history.state, '', url);
}
