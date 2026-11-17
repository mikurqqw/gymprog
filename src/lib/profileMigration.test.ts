import { expect, it } from 'vitest';
import { fixtureProfile } from './schema';
import { newUserProfile } from './onboardingDraft';
import { initialState, parseBackup } from './storage';
import { completeDraft } from './completeDraft';
it('starts with no personal profile and truly empty draft measurements', () => {
  expect(initialState.profile).toBeNull();
  expect(newUserProfile).toMatchObject({
    age: null,
    height: null,
    weight: null,
    sex: null,
    start: null,
  });
  for (const lift of Object.values(newUserProfile.lifts)) expect(lift.current).toBeNull();
});
it('migrates the current v1 backup without altering existing profile, logs or dates', () => {
  const legacy = { ...initialState, version: 1, profile: fixtureProfile, onboarded: true };
  const result = parseBackup(JSON.stringify(legacy));
  expect(result.version).toBe(6);
  expect(result.profile).toEqual(fixtureProfile);
  expect(result.logs).toEqual(legacy.logs);
  expect(result.onboarded).toBe(true);
});
it('rejects unfinished profiles and accepts explicitly completed draft values', () => {
  expect(() => completeDraft(newUserProfile)).toThrow();
  const ready = completeDraft({
    ...newUserProfile,
    age: 30,
    height: 175,
    weight: 70,
    sex: 'male',
    lifts: {
      squat: { current: 60, pr: null, form: 1 },
      bench: { current: 40, pr: null, form: 1 },
      deadlift: { current: 80, pr: null, form: 1 },
    },
  });
  expect(ready.lifts.squat.current).toBe(60);
  expect(ready.lifts.squat.pr).toBe(60);
  expect(ready.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
