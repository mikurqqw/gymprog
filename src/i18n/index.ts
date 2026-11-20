import { useCallback } from 'react';
import kk from './kk.json';
import { featureStrings } from './features';
import ru from './ru.json';
import en from './en.json';
import { useStore } from '../lib/store';
import type { Localized } from '../lib/schema';
export function useI18n() {
  const { language, units } = useStore();
  const dictionary: Record<string, string> = language === 'ru' ? ru : language === 'kk' ? kk : en;
  return {
    language,
    units,
    t: useCallback(
      (key: string) => featureStrings[key]?.[language] ?? dictionary[key] ?? key,
      [language, dictionary],
    ),
    local: (value: Localized) => value[language] ?? value.en,
    locale: language === 'ru' ? 'ru-RU' : language === 'kk' ? 'kk-KZ' : 'en-GB',
    weightUnit: units === 'metric' ? dictionary.kg : dictionary.lb,
    heightUnit: units === 'metric' ? dictionary.cm : dictionary.in,
  };
}
