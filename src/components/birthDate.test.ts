import { describe, expect, it } from 'vitest';
import { birthAge, birthDays } from './birthDate';
describe('birth date entry', () => {
  it('does not guess an age for empty, impossible or future dates', () => {
    for (const value of ['', '2025-02-29', '2026-11-18', '2000-00-10'])
      expect(birthAge(value, '2026-11-17')).toBeNull();
  });
  it('keeps the adult birthday boundary exact', () => {
    expect(birthAge('2008-11-17', '2026-11-17')).toBe(18);
    expect(birthAge('2008-11-18', '2026-11-17')).toBe(17);
    expect(birthAge('2000-02-29', '2026-02-28')).toBe(25);
    expect(birthAge('2000-02-29', '2026-03-01')).toBe(26);
  });
  it('limits available days by month and leap year without silently changing a birthday', () => {
    expect(birthDays('2000', '02')).toBe(29);
    expect(birthDays('2001', '02')).toBe(28);
    expect(birthDays('2000', '04')).toBe(30);
  });
});
