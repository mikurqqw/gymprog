import { expect, it } from 'vitest';
import { languageFromSearch } from './languageUrl';
it('accepts only the three supported language URL values', () => {
  for (const language of ['ru', 'kk', 'en'])
    expect(languageFromSearch('?lang=' + language)).toBe(language);
  for (const search of ['', '?lang=fr', '?lang=../../en', '?lang=%3Cscript%3E'])
    expect(languageFromSearch(search)).toBeUndefined();
});
