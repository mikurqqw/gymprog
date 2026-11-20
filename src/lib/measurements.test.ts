import { expect, it } from 'vitest';
import { imperialEquipment, workoutEquipment } from './equipment';
import { canonical, shown } from './measurements';
import { initialState, parseBackup } from './storage';

it('converts profile inputs, including rounded boundaries', () => {
  expect(canonical(70, 'imperial', 'height')).toBeCloseTo(177.8);
  expect(canonical(200, 'imperial')).toBeCloseTo(90.718474);
  const limits = [35, 250] as const;
  for (const limit of limits)
    expect(canonical(shown(limit, 'imperial')!, 'imperial', 'weight', limits)).toBe(limit);
  expect(shown(NaN, 'metric')).toBeUndefined();
});

it('restores distinct imperial equipment and supplies defaults to older backups', () => {
  const previous: Partial<typeof initialState> = { ...initialState };
  delete previous.imperialEquipment;
  const migrated = parseBackup(JSON.stringify({ ...previous, units: 'imperial', bar: 15 }));
  expect(workoutEquipment(migrated)).toEqual(imperialEquipment);
  expect(shown(workoutEquipment(migrated).bar, 'imperial')).toBe(45);
  expect(shown(workoutEquipment(migrated).step, 'imperial')).toBe(5);
  const changed = { ...imperialEquipment, step: canonical(2.5, 'imperial') };
  const restored = parseBackup(JSON.stringify({ ...migrated, imperialEquipment: changed }));
  expect(shown(workoutEquipment(restored).step, 'imperial')).toBe(2.5);
  expect(workoutEquipment({ ...restored, units: 'metric' }).bar).toBe(15);
});
