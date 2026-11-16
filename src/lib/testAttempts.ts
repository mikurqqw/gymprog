import { roundTo } from './formulas';
export type Attempt = { weight: number; rpe: number; success: boolean | null };
export function nextAttempt(current: number, step: number, previous: Attempt[], ready = true) {
  if (!ready) return null;
  if (!previous.length) return roundTo(current * 0.9, step);
  const last = previous.at(-1)!;
  if (last.success === null) return null;
  if (!last.success)
    return previous.length === 1
      ? last.weight
      : Math.min(last.weight, ...previous.filter((a) => a.success).map((a) => a.weight));
  if (previous.length === 1) return last.rpe >= 9 ? last.weight : roundTo(current, step);
  if (previous.length === 2) {
    const increase = last.rpe <= 7 ? Math.min(5, Math.max(2.5, step)) : last.rpe <= 8 ? 2.5 : 0;
    return Math.max(last.weight, Math.floor((last.weight + increase + 1e-9) / step) * step);
  }
  return null;
}
