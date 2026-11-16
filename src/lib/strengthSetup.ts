import { z } from 'zod';
import { e1rm } from './formulas';
export const assessmentSchema = z.object({
  squat: z.enum(['known', 'estimated', 'unknown']),
  bench: z.enum(['known', 'estimated', 'unknown']),
  deadlift: z.enum(['known', 'estimated', 'unknown']),
});
export const knownAssessments = { squat: 'known', bench: 'known', deadlift: 'known' } as const;
export const strengthInputSchema = z.object({
  method: z.enum(['known', 'set', 'unknown']),
  weight: z.number().min(0.25).max(300).nullable(),
  reps: z.number().int().min(1).max(10),
  rpe: z.number().min(6).max(10),
});
export type StrengthInput = z.infer<typeof strengthInputSchema>;
export const legacyStrengthInputs = {
  squat: { method: 'known', weight: null, reps: 5, rpe: 8 },
  bench: { method: 'known', weight: null, reps: 5, rpe: 8 },
  deadlift: { method: 'known', weight: null, reps: 5, rpe: 8 },
} as const;
export const strengthInputsSchema = z.object({
  squat: strengthInputSchema,
  bench: strengthInputSchema,
  deadlift: strengthInputSchema,
});
export function assessedStrength(current: number | null, input: StrengthInput) {
  if (current !== null && input.method !== 'set')
    return { value: current, assessment: 'known' as const };
  if (input.method === 'unknown') {
    // Numeric compatibility floor for the protected engine, never a displayed strength or prescribed load.
    return { value: 1, assessment: 'unknown' as const };
  }
  if (input.method === 'set' && input.weight !== null) {
    const parsed = strengthInputSchema.parse(input),
      value = e1rm(parsed.weight!, parsed.reps, parsed.rpe);
    if (value !== null && value >= 1 && value <= 600)
      return { value, assessment: 'estimated' as const };
  }
  throw Error('Strength input incomplete');
}
