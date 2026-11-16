import { z } from 'zod';
import { legalConfig } from '../config/legal.config';
export const CONSENT_KEY = 'ironcycle:consent';
export const PREFERENCES_KEY = 'ironcycle:preferences';
export const consentSchema = z.object({
  schemaVersion: z.literal(1),
  adult: z.literal(true),
  acceptedAt: z.iso.datetime(),
  language: z.enum(['ru', 'kk', 'en']),
  versions: z.record(z.string(), z.string()),
  terms: z.literal(true),
  privacy: z.literal(true),
  health: z.literal(true),
  medical: z.literal(true),
  calories: z.literal(true),
});
export type Consent = z.infer<typeof consentSchema>;
export const preferencesSchema = z.object({
  language: z.enum(['ru', 'kk', 'en']),
  necessary: z.literal(true),
  optionalMedia: z.boolean(),
  selectedAt: z.iso.datetime(),
});
export type Preferences = z.infer<typeof preferencesSchema>;
export function isAdult(birth: string, on: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth > on) return false;
  const d = new Date(birth + 'T12:00:00Z');
  if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== birth) return false;
  const [year, month, day] = on.split('-').map(Number);
  return (
    year -
      d.getUTCFullYear() -
      (month < d.getUTCMonth() + 1 || (month === d.getUTCMonth() + 1 && day < d.getUTCDate())
        ? 1
        : 0) >=
    18
  );
}
export function validConsent(value: unknown) {
  const parsed = consentSchema.safeParse(value);
  return (
    parsed.success &&
    Object.entries(legalConfig.documentVersions).every(
      ([key, version]) => parsed.data.versions[key] === version,
    )
  );
}
export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw || raw.length > 10000) return null;
    const parsed = consentSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
export function readPreferences(): Preferences | null {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw || raw.length > 10000) return null;
    const parsed = preferencesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
export function dataAllowed() {
  const c = readConsent();
  return validConsent(c) && readPreferences()?.necessary === true;
}
export function mediaAllowed() {
  return dataAllowed() && readPreferences()?.optionalMedia === true;
}
export function saveConsent(language: Consent['language'], optionalMedia: boolean) {
  const acceptedAt = new Date().toISOString();
  const record: Consent = {
    schemaVersion: 1,
    adult: true,
    acceptedAt,
    language,
    versions: { ...legalConfig.documentVersions },
    terms: true,
    privacy: true,
    health: true,
    medical: true,
    calories: true,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify({ language, necessary: true, optionalMedia, selectedAt: acceptedAt }),
  );
  window.dispatchEvent(new Event('ironcycle:consent'));
}
export function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new Event('ironcycle:consent'));
}
