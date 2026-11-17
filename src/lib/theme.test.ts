import { expect, it } from 'vitest';
import { resolveTheme } from './theme';
import { initialState, parseBackup } from './storage';
it('resolves system and explicit theme choices predictably', () => {
  expect(resolveTheme('dark', true)).toBe('dark');
  expect(resolveTheme('light', false)).toBe('light');
  expect(resolveTheme('system', true)).toBe('light');
  expect(resolveTheme('system', false)).toBe('dark');
});
it('preserves older manual theme, logs and profiles while adding dismissible install preference', () => {
  const old = { ...initialState, version: 4, theme: 'light' };
  delete (old as Partial<typeof old>).themePreference;
  const migrated = parseBackup(JSON.stringify(old));
  expect(migrated.version).toBe(6);
  expect(migrated.themePreference).toBe('light');
  expect(migrated.installHintDismissed).toBe(false);
  expect(migrated.logs).toEqual(old.logs);
});

it('does not coerce malformed backup schema versions', () => {
  expect(() => parseBackup(JSON.stringify({ ...initialState, version: '4' }))).toThrow();
});
