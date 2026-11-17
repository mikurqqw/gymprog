import { useCallback } from 'react';
import { useI18n } from './index';
import { diaryStrings } from './diaryStrings';
export function useDiaryI18n() {
  const base = useI18n(),
    { language, t } = base;
  return {
    ...base,
    t: useCallback((key: string) => diaryStrings[key]?.[language] ?? t(key), [language, t]),
  };
}
