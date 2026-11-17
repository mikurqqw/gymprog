import type { Checkin, Profile } from './schema';
import type { FoodLog } from './foodLog';
import { dateOffset } from './formulas';
export function checkinDraft(
  date: string,
  profile: Pick<Profile, 'weight' | 'sleep'>,
  foods: FoodLog[],
): Checkin {
  const previous = foods.filter((food) => food.date === dateOffset(date, -1));
  return {
    date,
    sleep: profile.sleep,
    weight: profile.weight,
    pain: 'none',
    location: '',
    speed: 'normal',
    dizziness: false,
    weakness: false,
    worsening: false,
    ...(previous.length
      ? {
          calories: previous.reduce((n, f) => n + f.kcal, 0),
          protein: previous.reduce((n, f) => n + f.protein, 0),
          ...(previous.every((f) => f.carbs !== undefined)
            ? { carbs: previous.reduce((n, f) => n + (f.carbs ?? 0), 0) }
            : {}),
        }
      : {}),
  };
}
