import { expect, it } from 'vitest';
import { assessedStrength } from './strengthSetup';
import { completeDraft } from './completeDraft';
import { newUserProfile } from './onboardingDraft';
import { fixtureProfile } from './schema';
import { generate } from './plannedProgram';
import { initialState, parseBackup } from './storage';
const body = { ...newUserProfile, age: 30, height: 175, weight: 70, sex: 'male' as const };
it('keeps unknown strength explicit and never prescribes a numeric barbell load', () => {
  const profile = completeDraft(body);
  expect(profile.strengthAssessment).toEqual({
    squat: 'unknown',
    bench: 'unknown',
    deadlift: 'unknown',
  });
  const rows = generate({ ...profile, goal: 'powerlifting' });
  expect(rows.filter((row) => row.lift)).not.toHaveLength(0);
  expect(
    rows
      .filter((row) => row.lift)
      .every((row) => row.weight === null && row.percent === null && row.loadUnassessed),
  ).toBe(true);
});
it('uses the existing e1RM helper only with explicitly entered recent-set data', () => {
  const result = assessedStrength(null, { method: 'set', weight: 50, reps: 5, rpe: 8 });
  expect(result.assessment).toBe('estimated');
  expect(result.value).toBeGreaterThan(50);
  expect(() =>
    assessedStrength(null, { method: 'known', weight: null, reps: 5, rpe: 8 }),
  ).toThrow();
  expect(() =>
    assessedStrength(null, { method: 'set', weight: 300, reps: 100, rpe: 11 }),
  ).toThrow();
});
it('preserves exact known strengths and legacy numeric program loads', () => {
  expect(assessedStrength(100, { method: 'known', weight: null, reps: 5, rpe: 8 })).toEqual({
    value: 100,
    assessment: 'known',
  });
  expect(generate(fixtureProfile)[0].weight).toBe(115);
});
it('migrates v3 backups without losing known profiles, prior logs or chosen workout view', () => {
  const legacy = { ...initialState, version: 3, profile: fixtureProfile, workoutView: 'focus' };
  const migrated = parseBackup(JSON.stringify(legacy));
  expect(migrated.version).toBe(5);
  expect(migrated.profile).toEqual(fixtureProfile);
  expect(migrated.workoutView).toBe('focus');
});
