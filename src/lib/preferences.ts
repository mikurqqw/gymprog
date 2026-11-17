import { z } from 'zod';
export const preferencesSchema = z.object({
  schemaVersion: z.literal(2),
  language: z.enum(['ru', 'kk', 'en']),
  necessary: z.literal(true),
  optionalMedia: z.boolean(),
  selectedAt: z.iso.datetime(),
  themePreference: z.enum(['dark', 'light', 'system']),
});
export type Preferences = z.infer<typeof preferencesSchema>;
export function parsePreferences(value: unknown): Preferences {
  const legacy =
    typeof value === 'object' &&
    value !== null &&
    (!('schemaVersion' in value) || value.schemaVersion === 1);
  return preferencesSchema.parse(
    legacy ? { ...value, schemaVersion: 2, themePreference: 'dark' } : value,
  );
}
