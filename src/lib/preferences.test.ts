import { expect, it } from 'vitest';
import { parsePreferences } from './preferences';
const legacy = {
  language: 'kk',
  necessary: true,
  optionalMedia: false,
  selectedAt: '2026-11-17T00:00:00Z',
};
it('migrates unversioned preferences without fabricating consent or reading journals', () => {
  expect(parsePreferences(legacy)).toEqual({
    ...legacy,
    schemaVersion: 2,
    themePreference: 'dark',
  });
});
it('preserves current theme choice and rejects malformed preferences', () => {
  expect(
    parsePreferences({ ...legacy, schemaVersion: 2, themePreference: 'light' }).themePreference,
  ).toBe('light');
  expect(() =>
    parsePreferences({ ...legacy, schemaVersion: 2, themePreference: 'unsafe' }),
  ).toThrow();
  expect(() => parsePreferences({ ...legacy, schemaVersion: 99 })).toThrow();
});
