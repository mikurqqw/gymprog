import { expect, it } from 'vitest';
import { defaultProfile as p, type Checkin } from './schema';
import { generate, exerciseById } from './program';
import {
  injuryEffect,
  jointStress,
  maxTestingAllowed,
  stopSymptoms,
  type Injury,
} from './injuries';
import { readiness } from './autoregulation';
const elbow: Injury = {
  id: 'left-elbow',
  area: 'elbow',
  side: 'left',
  status: 'postFracture',
  severity: 2,
  cleared: false,
  notes: '',
};
it('excludes every elbow-loading movement without clearance', () => {
  const profile = { ...p, injuryRecords: [elbow] };
  const rows = generate(profile);
  expect(rows.every((r) => jointStress(exerciseById(r.exercise), 'elbow') === 0)).toBe(true);
  expect(rows.some((r) => r.lift === 'bench')).toBe(false);
});
it('clearance never means full load or permission for a max test', () => {
  const profile = { ...p, injuryRecords: [{ ...elbow, cleared: true }] };
  expect(injuryEffect(exerciseById('ex-10'), profile).loadFactor).toBeLessThan(1);
  expect(maxTestingAllowed(profile)).toBe(false);
});
it('screening restricts intensity and removes max efforts', () => {
  const profile = { ...p, health: { ...p.health, heart: true } };
  expect(
    generate(profile).every((r) => r.rpe <= 6 && r.mode !== 'test' && r.mode !== 'single'),
  ).toBe(true);
  expect(maxTestingAllowed(profile)).toBe(false);
});
it.each(['painScore', 'numbness', 'swelling', 'chestPain'])('stops work for %s', (key) => {
  const c: Checkin = {
    date: '2026-11-16',
    sleep: 8,
    pain: 'none',
    location: '',
    speed: 'fast',
    dizziness: false,
    weakness: false,
    worsening: false,
    [key]: key === 'painScore' ? 4 : true,
  };
  expect(stopSymptoms(c)).toBeTruthy();
  expect(readiness(c, p).level).toBe('red');
});
