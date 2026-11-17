import { onboardingDraftSchema, newUserProfile } from './onboardingDraft';
import { programDocumentSchema } from './programDocument';
import { z } from 'zod';
import { parseSafeJson } from './safeJson';
import exerciseIds from '../data/exercise-ids.json' with { type: 'json' };
import { checkinSchema, logSchema, profileSchema } from './schema';
export const stateSchema = z.lazy(() =>
  z.object({
    version: z.literal(5),
    themePreference: z.enum(['dark', 'light', 'system']).default('dark'),
    installHintDismissed: z.boolean().default(false),
    workoutView: z.enum(['focus', 'overview']).nullable().default(null),
    activeSession: z
      .object({
        week: z.number().int().min(1).max(8),
        day: z.number().int().min(0).max(4),
        touchedAt: z.iso.datetime(),
      })
      .nullable()
      .default(null),
    sessionCompletions: z
      .record(
        z.string().max(300),
        z.object({ completedAt: z.iso.datetime(), rowIds: z.array(z.string().max(200)).max(1200) }),
      )
      .refine((value) => Object.keys(value).length <= 1000)
      .default({}),
    customProgram: programDocumentSchema.nullable().default(null),
    profile: profileSchema.nullable(),
    draftProfile: onboardingDraftSchema.default(newUserProfile),
    onboarded: z.boolean(),
    language: z.enum(['ru', 'kk', 'en']),
    theme: z.enum(['dark', 'light']),
    units: z.enum(['metric', 'imperial']),
    week: z.number().int().min(1).max(8),
    day: z.number().int().min(0).max(4),
    logs: z.array(logSchema).max(20000),
    checkins: z.array(checkinSchema).max(10000),
    adjustments: z.record(z.string(), z.number().min(-0.25).max(0.1)),
    shifts: z.record(z.string(), z.iso.date()),
    swaps: z.record(z.string(), z.string()),
    timer: z.number().nullable(),
    foodLogs: z
      .array(
        z.object({
          id: z.string(),
          date: z.iso.date(),
          name: z.string().max(200),
          grams: z.number().min(0).max(10000),
          kcal: z.number().min(0).max(12000),
          protein: z.number().min(0).max(600),
        }),
      )
      .max(50000),
    attempts: z.record(
      z.string(),
      z
        .array(
          z.object({
            weight: z.number().min(0).max(800),
            rpe: z.number().min(1).max(10),
            success: z.boolean().nullable(),
          }),
        )
        .max(3),
    ),
    plateSizes: z.array(z.number().min(0.25).max(50)).min(1).max(20),
    bar: z.number().min(0).max(30),
  }),
);
export type AppState = z.infer<typeof stateSchema>;
export const initialState: AppState = {
  version: 5,
  themePreference: 'dark',
  installHintDismissed: false,
  workoutView: null,
  activeSession: null,
  sessionCompletions: {},
  customProgram: null,
  profile: null,
  draftProfile: newUserProfile,
  onboarded: false,
  language: 'ru',
  theme: 'dark',
  units: 'metric',
  week: 1,
  day: 0,
  logs: [],
  checkins: [],
  adjustments: {},
  shifts: {},
  swaps: {},
  timer: null,
  foodLogs: [],
  attempts: {},
  plateSizes: [25, 20, 15, 10, 5, 2.5, 1.25],
  bar: 20,
};
export const STORAGE_KEY = 'ironcycle:data';
export function parseBackup(raw: string): AppState {
  const result = stateSchema.parse(migrateState(parseSafeJson(raw)));
  const ids = new Set(exerciseIds);
  if (
    Object.values(result.swaps).some((id) => !ids.has(id)) ||
    result.logs.some((log) => !ids.has(log.exercise))
  )
    throw Error('Unknown exercise');
  return result;
}
export function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { data: raw ? parseBackup(raw) : initialState, error: false };
  } catch {
    return { data: initialState, error: true };
  }
}
export function download(name: string, data: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function migrateState(value: unknown): unknown {
  if (typeof value !== 'object' || value === null || !('version' in value)) return value;
  if (typeof value.version === 'number' && [0, 1, 2, 3, 4].includes(value.version))
    return {
      ...initialState,
      ...value,
      version: 5,
      themePreference:
        'theme' in value && (value.theme === 'dark' || value.theme === 'light')
          ? value.theme
          : 'dark',
      installHintDismissed: false,
      ...(value.version === 0 || value.version === 1
        ? { draftProfile: newUserProfile, workoutView: null }
        : {}),
    };
  return value;
}
