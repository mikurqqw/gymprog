import { injurySchema } from './injuries';
import { healthSchema, clearHealth } from './health';
import { z } from 'zod';
export const liftIds = ['squat', 'bench', 'deadlift'] as const;
export type Lift = (typeof liftIds)[number];
export type Localized = { ru: string; en: string; kk?: string };
const liftSchema = z.lazy(() =>
  z.object({
    current: z.number().min(1).max(600),
    pr: z.number().min(1).max(600),
    form: z.number().min(0.8).max(1.05),
  }),
);
export const profileSchema = z.lazy(() =>
  z.object({
    age: z.number().int().min(18).max(90),
    height: z.number().min(120).max(230),
    weight: z.number().min(35).max(250),
    sex: z.enum(['male', 'female']),
    sleep: z.number().min(4).max(12),
    experience: z.number().min(0).max(60),
    start: z.iso.date().refine((date) => new Date(date + 'T12:00:00Z').getUTCDay() === 1),
    days: z.number().int().min(2).max(5),
    minutes: z.number().min(30).max(180),
    step: z.number().min(0.25).max(10),
    equipment: z.enum(['gym', 'limited', 'home']),
    injuries: z.array(z.string().max(200)),
    injuryRecords: z.array(injurySchema).max(50).default([]),
    limitations: z.string().max(1000),
    health: healthSchema.default(clearHealth),
    healthScreenVersion: z.string().max(100).default(''),
    healthScreenedAt: z.string().max(100).default(''),
    lifts: z.object({ squat: liftSchema, bench: liftSchema, deadlift: liftSchema }),
    goal: z.enum([
      'powerlifting',
      'armwrestling',
      'arms',
      'bodybuilding',
      'strength',
      'fatloss',
      'fitness',
      'custom',
    ]),
    priorities: z.array(z.string()).max(12),
    special: z
      .record(z.string(), z.number().min(0).max(300))
      .default({ pronation: 15, cup: 20, rising: 10, side: 10, biceps: 20 }),
    specialPr: z.record(z.string(), z.number().min(0).max(300)).default({}),
    specialForm: z.record(z.string(), z.number().min(0.8).max(1.05)).default({}),
    nutritionGoal: z.enum(['maintain', 'gain', 'loss', 'recomp']),
    activity: z.number().min(1.2).max(2.2),
    pace: z.number().min(0.0025).max(0.005),
    diet: z.enum(['omnivore', 'vegetarian', 'halal', 'lactoseFree']),
    allergies: z.string().max(300),
    meals: z.number().int().min(3).max(5),
    steps: z.number().min(0).max(50000),
    budget: z.enum(['low', 'medium', 'high']),
    region: z.enum(['cis', 'international']),
  }),
);
export type Profile = z.infer<typeof profileSchema>;
export const defaultProfile: Profile = {
  age: 18,
  height: 183,
  weight: 77,
  sex: 'male',
  sleep: 7,
  experience: 2,
  start: '2026-11-16',
  days: 3,
  minutes: 90,
  step: 2.5,
  equipment: 'gym',
  injuries: [],
  injuryRecords: [],
  limitations: '',
  health: clearHealth,
  healthScreenVersion: '',
  healthScreenedAt: '',
  lifts: {
    squat: { current: 140, pr: 140, form: 1 },
    bench: { current: 90, pr: 100, form: 1 },
    deadlift: { current: 140, pr: 155, form: 1 },
  },
  goal: 'powerlifting',
  priorities: ['squat', 'bench', 'deadlift'],
  special: { pronation: 15, cup: 20, rising: 10, side: 10, biceps: 20 },
  specialPr: {},
  specialForm: {},
  nutritionGoal: 'maintain',
  activity: 1.55,
  pace: 0.0025,
  diet: 'omnivore',
  allergies: '',
  meals: 3,
  steps: 7000,
  budget: 'medium',
  region: 'cis',
};
export const checkinSchema = z.lazy(() =>
  z.object({
    date: z.iso.date(),
    sleep: z.number().min(0).max(16),
    quality: z.number().min(1).max(5).optional(),
    recovery: z.number().min(1).max(5).optional(),
    soreness: z.number().min(1).max(5).optional(),
    stress: z.number().min(1).max(5).optional(),
    mood: z.number().min(1).max(5).optional(),
    calories: z.number().min(0).max(12000).optional(),
    protein: z.number().min(0).max(600).optional(),
    carbs: z.number().min(0).max(1500).optional(),
    water: z.number().min(0).max(12).optional(),
    weight: z.number().min(35).max(250).optional(),
    meal: z.boolean().optional(),
    pain: z.enum(['none', 'mild', 'sharp']),
    location: z.string().max(200),
    speed: z.enum(['fast', 'normal', 'slow']),
    dizziness: z.boolean(),
    weakness: z.boolean(),
    worsening: z.boolean(),
    painScore: z.number().min(0).max(10).optional(),
    numbness: z.boolean().optional(),
    swelling: z.boolean().optional(),
    chestPain: z.boolean().optional(),
  }),
);
export type Checkin = z.infer<typeof checkinSchema>;
export const logSchema = z.lazy(() =>
  z.object({
    id: z.string(),
    session: z.string(),
    exercise: z.string(),
    lift: z.enum(liftIds).nullable(),
    date: z.iso.date(),
    weight: z.number().min(0).max(800),
    reps: z.number().int().min(0).max(3600),
    sets: z.array(z.boolean()).max(30),
    rpe: z.number().min(1).max(10),
    targetRpe: z.number().min(1).max(10),
    planned: z.number().nullable(),
    status: z.enum(['planned', 'done', 'modified', 'skipped']),
    note: z.string().max(2000),
    video: z.string().max(300),
    technique: z.boolean(),
    mode: z.string(),
  }),
);
export type Log = z.infer<typeof logSchema>;
export type Prescription = {
  tempo?: string;
  superset?: string;
  reference?: string;
  id: string;
  week: number;
  day: number;
  exercise: string;
  lift: Lift | null;
  mode: string;
  sets: number;
  reps: number;
  percent: number | null;
  rpe: number;
  rest: number;
  tip: Localized;
};
export type Planned = Prescription & {
  date: string;
  weight: number | null;
  injuryAdjusted?: boolean;
  adjustmentReasons?: string[];
  startingWeight?: number;
};
export type Exercise = {
  id: string;
  name: Localized;
  muscles: string[];
  secondary: string[];
  pattern: string;
  equipment: string;
  difficulty: string;
  jointStress?: Record<string, number>;
  loadingSide?: 'bilateral' | 'left' | 'right' | 'none';
  summary?: Localized;
  setup?: Localized;
  steps?: Localized[];
  breathing?: Localized;
  injuries: string[];
  substitutions: string[];
  cues: Localized[];
  mistakes: Localized;
  safety: Localized;
  videoCheck: Localized;
  media: { localPath?: string; youtubeId?: string; image?: string; gif?: string };
};
export type Food = {
  id: string;
  name: Localized;
  kcal: number;
  p: number;
  f: number;
  c: number;
  tags: string[];
};
