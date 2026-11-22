import { exercises } from './program';

const normalize = (name: string) =>
  name.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/\s+/g, ' ').trim();

const byName = new Map(
  exercises.flatMap((exercise) =>
    Object.values(exercise.name).map((name) => [normalize(name), exercise] as const),
  ),
);

const exactAliases: Record<string, string> = {
  'мертвый жук': 'ex-9',
  'боковая планка': 'ex-15',
  'ягодичный мост с пола': 'ex-30',
  гиперэкстензия: 'ex-34',
  'жим гантелей лежа': 'ex-39',
  'жим гантелей сидя': 'ex-44',
  'румынская тяга с гантелями': 'ex-35',
  'сгибание ног лежа': 'ex-36',
  'сгибание ног лежа в тренажере': 'ex-36',
  'сгибание рук со штангой': 'ex-58',
  'сгибание рук с гантелями': 'ex-59',
  'подъемы гантелей в стороны': 'ex-55',
  'разведение гантелей в стороны': 'ex-55',
};

export function seriesTechnique(name: string) {
  const key = normalize(name);
  return byName.get(key) ?? exercises.find((exercise) => exercise.id === exactAliases[key]);
}
