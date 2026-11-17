export type ThemePreference = 'dark' | 'light' | 'system';
export function resolveTheme(preference: ThemePreference, lightSystem: boolean): 'dark' | 'light' {
  return preference === 'system' ? (lightSystem ? 'light' : 'dark') : preference;
}
export const systemTheme = () =>
  resolveTheme('system', matchMedia('(prefers-color-scheme: light)').matches);
