import { assessedStrength } from './strengthSetup';
import { liftIds } from './schema';
import { profileSchema, type Profile } from './schema';
import { nextMonday, today } from './formulas';
import type { OnboardingDraft } from './onboardingDraft';
export function completeDraft(draft: OnboardingDraft): Profile {
  const assessed = Object.fromEntries(
    liftIds.map((lift) => [
      lift,
      assessedStrength(draft.lifts[lift].current, draft.strengthInputs[lift]),
    ]),
  );
  return profileSchema.parse({
    ...draft,
    days: draft.goal === 'powerlifting' ? 3 : draft.days,
    start: draft.start ?? nextMonday(today()),
    strengthAssessment: Object.fromEntries(
      liftIds.map((lift) => [lift, assessed[lift].assessment]),
    ),
    lifts: Object.fromEntries(
      liftIds.map((lift) => [
        lift,
        {
          current: assessed[lift].value,
          pr:
            assessed[lift].assessment === 'unknown'
              ? 1
              : (draft.lifts[lift].pr ?? assessed[lift].value),
          form: draft.lifts[lift].form,
        },
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
