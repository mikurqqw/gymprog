import ru from '../src/i18n/ru.json' with { type: 'json' };
import kk from '../src/i18n/kk.json' with { type: 'json' };
import en from '../src/i18n/en.json' with { type: 'json' };
import { featureStrings } from '../src/i18n/features';
export type JourneyLanguage = 'ru' | 'kk' | 'en';
export function journeyMessages(language: JourneyLanguage) {
  const dictionary: Record<string, string> = { ru, kk, en }[language];
  return (key: string) => featureStrings[key]?.[language] ?? dictionary[key] ?? key;
}
