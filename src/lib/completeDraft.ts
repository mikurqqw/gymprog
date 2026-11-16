import { profileSchema, type Profile } from './schema';
import { nextMonday, today } from './formulas';
import type { OnboardingDraft } from './onboardingDraft';
export function completeDraft(draft: OnboardingDraft): Profile {
  return profileSchema.parse({
    ...draft,
    start: draft.start ?? nextMonday(today()),
    lifts: Object.fromEntries(
      Object.entries(draft.lifts).map(([key, lift]) => [
        key,
        { ...lift, pr: lift.pr ?? lift.current },
      ]),
    ),
    priorities: ['squat', 'bench', 'deadlift'],
    special: { pronation: 0, cup: 0, rising: 0, side: 0, biceps: 0 },
    specialPr: {},
    specialForm: {},
    nutritionGoal: 'maintain',
    activity: 1.2,
    pace: 0.0025,
    diet: 'omnivore',
    allergies: '',
    meals: 3,
    steps: 0,
    budget: 'medium',
    region: 'cis',
  });
}
