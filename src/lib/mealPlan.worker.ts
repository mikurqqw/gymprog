import { mealPlan } from './nutrition';
import { profileSchema, type Food, type Profile } from './schema';
import foods from '../data/foods.json';
type Request = { profile: Profile; seed: number; day: 'heavy' | 'medium' | 'rest' };
self.onmessage = (event: MessageEvent<Request>) => {
  try {
    const { seed, day } = event.data,
      profile = profileSchema.parse(event.data.profile);
    if (!Number.isSafeInteger(seed) || seed < 0 || !['heavy', 'medium', 'rest'].includes(day))
      throw Error('Invalid menu request');
    const menu = Array.from({ length: 7 }, (_, offset) =>
      mealPlan(profile, foods as Food[], seed + offset, day),
    );
    self.postMessage({ menu });
  } catch {
    self.postMessage({ menu: null });
  }
};
