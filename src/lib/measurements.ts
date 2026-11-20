import { fromWeight } from './formulas';

export type Units = 'metric' | 'imperial';
export type Measure = 'weight' | 'height';
const factor = (units: Units, measure: Measure) =>
  units === 'metric' ? 1 : measure === 'height' ? 1 / 2.54 : 1 / fromWeight(1, units);

export const shown = (
  value: number | null | undefined,
  units: Units,
  measure: Measure = 'weight',
) =>
  value == null || !Number.isFinite(value)
    ? undefined
    : Number((value * factor(units, measure)).toFixed(2));

export function canonical(
  value: number,
  units: Units,
  measure: Measure = 'weight',
  limits?: readonly [number, number],
) {
  if (limits) {
    for (const boundary of limits) if (value === shown(boundary, units, measure)) return boundary;
  }
  return value / factor(units, measure);
}
