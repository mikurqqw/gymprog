import { z } from 'zod';

export const MAX_LOAD_GOALS = 40;
export const loadGoalSchema = z.object({
  exercise: z
    .string()
    .regex(/^(?:ex-\d{1,4}|(?:series|custom):[^\r\n]{1,180}|variant:(?:strictCurl|extremeCurl))$/u),
  weight: z.number().min(0.01).max(800),
});
export type LoadGoal = z.infer<typeof loadGoalSchema>;
