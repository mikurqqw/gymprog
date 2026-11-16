import { describe, it, expect } from 'vitest';
import { initialState } from './storage';
import { fixtureProfile } from './schema';
import { generate } from './program';
import { parseProgram, programDocumentSchema } from './programDocument';
import { moveRow, duplicateDay, duplicateWeek } from './programEditing';
import { rankedAlternatives, replaceExercise } from './replacements';
const profile = { ...fixtureProfile, goal: 'strength' as const };
const document = () =>
  programDocumentSchema.parse({
    schemaVersion: 1,
    id: 'test',
    name: { ru: 'План', kk: 'Жоспар', en: 'Plan' },
    rows: generate(profile).map((row) => ({
      ...row,
      tip: { ...row.tip, kk: row.tip.kk ?? row.tip.en },
    })),
  });
describe('program documents', () => {
  it('accepts the existing powerlifting prescriptions in the editor', () => {
    expect(() =>
      programDocumentSchema.parse({
        schemaVersion: 1,
        id: 'pl',
        name: { ru: 'План', kk: 'Жоспар', en: 'Plan' },
        rows: generate(fixtureProfile).map((row) => ({ ...row, rpe: Math.min(9, row.rpe) })),
      }),
    ).not.toThrow();
  });
  it('round-trips without losing prescriptions', () => {
    const doc = document();
    expect(parseProgram(JSON.stringify(doc))).toEqual(doc);
  });
  it('rejects arbitrary exercise IDs, invalid quantities and prototype keys', () => {
    const doc = document();
    for (const patch of [
      { exercise: 'unknown' },
      { sets: 0 },
      { rpe: 99 },
      { lift: 'deadlift', exercise: 'ex-10' },
    ])
      expect(() =>
        parseProgram(JSON.stringify({ ...doc, rows: [{ ...doc.rows[0], ...patch }] })),
      ).toThrow();
    expect(() => parseProgram('{"__proto__":{}}')).toThrow();
  });
  it('moves a row within its session and duplicates days/weeks with unique IDs', () => {
    const doc = document(),
      first = doc.rows[0];
    expect(moveRow(doc, first.id, 1).rows[1].id).toBe(first.id);
    const duplicated = duplicateWeek(duplicateDay(doc, 1, 0, 4), 1, 2);
    expect(new Set(duplicated.rows.map((row) => row.id)).size).toBe(duplicated.rows.length);
    expect(duplicated.rows.filter((row) => row.week === 2 && row.day === 4).length).toBeGreaterThan(
      0,
    );
  });
  it('applies custom rows and progression but preserves injury constraints', () => {
    const doc = document();
    const rows = generate({ ...profile, goal: 'custom' }, {}, {}, {}, doc);
    expect(rows.length).toBe(doc.rows.length);
    const injured = {
      ...profile,
      goal: 'custom' as const,
      injuryRecords: [
        {
          id: 'i',
          area: 'elbow' as const,
          side: 'left' as const,
          status: 'postFracture' as const,
          severity: 3 as const,
          cleared: false,
          notes: '',
        },
      ],
    };
    expect(
      generate(injured, {}, {}, {}, doc).every(
        (row) => !['ex-0', 'ex-10', 'ex-5'].includes(row.exercise),
      ),
    ).toBe(true);
  });
});
describe('scoped replacements', () => {
  it('session only changes matching movement; original loads are cleared', () => {
    const rows = generate(profile),
      row = rows.find((item) => item.exercise === 'ex-10')!;
    const state = { ...initialState, profile };
    const next = replaceExercise(
      state,
      row,
      rankedAlternatives(row.exercise, profile)[0].id,
      'session',
    );
    expect(
      Object.keys(next.swaps).every((id) =>
        rows.some((item) => item.id === id && item.week === row.week && item.day === row.day),
      ),
    ).toBe(true);
    const changed = generate(profile, {}, {}, next.swaps).find((item) => item.id === row.id)!;
    expect(changed.weight).toBeNull();
    expect(changed.lift).toBeNull();
    expect(replaceExercise(next, changed, null, 'session').swaps).toEqual({});
  });
  it('rest-of-cycle scope leaves previous weeks unchanged', () => {
    const row = generate(profile).find((item) => item.exercise === 'ex-10' && item.week === 3)!;
    const next = replaceExercise(
      { ...initialState, profile },
      row,
      rankedAlternatives(row.exercise, profile)[0].id,
      'cycle',
    );
    expect(Object.keys(next.swaps).length).toBeGreaterThan(1);
    for (const r of generate(profile).filter((item) => item.week < 3))
      expect(next.swaps[r.id]).toBeUndefined();
  });
});
