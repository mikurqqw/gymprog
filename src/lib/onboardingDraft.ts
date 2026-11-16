import { z } from 'zod';
import { healthSchema, clearHealth } from './health';
import { injurySchema } from './injuries';
const optionalMetric = (min: number, max: number) => z.number().min(min).max(max).nullable();
const draftLift = z.object({
  current: optionalMetric(1, 600),
  pr: optionalMetric(1, 600),
  form: z.number().min(0.8).max(1.05),
});
export const onboardingDraftSchema = z.object({
  age: optionalMetric(18, 90),
  height: optionalMetric(120, 230),
  weight: optionalMetric(35, 250),
  sex: z.enum(['male', 'female']).nullable(),
  lifts: z.object({ squat: draftLift, bench: draftLift, deadlift: draftLift }),
  start: z.iso.date().nullable(),
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
  equipment: z.enum(['gym', 'limited', 'home']),
  days: z.number().int().min(2).max(5),
  minutes: z.number().min(30).max(180),
  sleep: z.number().min(4).max(12),
  experience: z.number().min(0).max(60),
  step: z.number().min(0.25).max(10),
  health: healthSchema,
  healthScreenVersion: z.string().max(100),
  healthScreenedAt: z.string().max(100),
  injuries: z.array(z.string()).max(50),
  injuryRecords: z.array(injurySchema).max(50),
  limitations: z.string().max(1000),
});
export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>;
export const newUserProfile: OnboardingDraft = {
  age: null,
  height: null,
  weight: null,
  sex: null,
  lifts: {
    squat: { current: null, pr: null, form: 1 },
    bench: { current: null, pr: null, form: 1 },
    deadlift: { current: null, pr: null, form: 1 },
  },
  start: null,
  goal: 'fitness',
  equipment: 'gym',
  days: 3,
  minutes: 60,
  sleep: 7,
  experience: 0,
  step: 2.5,
  health: { ...clearHealth },
  healthScreenVersion: '',
  healthScreenedAt: '',
  injuries: [],
  injuryRecords: [],
  limitations: '',
};
