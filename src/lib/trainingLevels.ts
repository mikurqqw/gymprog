import type { SeriesVariant } from './fitSeries';

export const trainingLevels = [
  'trainingBeginner',
  'trainingIntermediate',
  'trainingAdvanced',
] as const;
type TrainingLevel = (typeof trainingLevels)[number];

const sourceLevels: Record<string, TrainingLevel> = {
  Новичок: 'trainingBeginner',
  Освоение: 'trainingBeginner',
  Средний: 'trainingIntermediate',
  'Занимаюсь регулярно': 'trainingIntermediate',
  'С опытом': 'trainingIntermediate',
  Базовый: 'trainingIntermediate',
  'Продв 3д': 'trainingAdvanced',
  Продвинутый: 'trainingAdvanced',
  Опытный: 'trainingAdvanced',
};

export function groupSeriesVariants(variants: SeriesVariant[]) {
  const groups: Record<TrainingLevel | 'other', SeriesVariant[]> = {
    trainingBeginner: [],
    trainingIntermediate: [],
    trainingAdvanced: [],
    other: [],
  };
  for (const variant of variants) {
    const sourceLevel = variant.title
      .split(/ \/ | · /)
      .find((part) => Object.hasOwn(sourceLevels, part));
    groups[sourceLevel ? sourceLevels[sourceLevel] : 'other'].push(variant);
  }
  return groups;
}
