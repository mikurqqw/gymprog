import { fromWeight } from './formulas';
import type { AppState } from './storage';

export const imperialEquipment = {
  bar: fromWeight(45, 'imperial'),
  step: fromWeight(5, 'imperial'),
  plates: [45, 35, 25, 10, 5, 2.5, 1.25].map((weight) => fromWeight(weight, 'imperial')),
};

export function workoutEquipment(state: AppState) {
  if (state.units === 'imperial') return state.imperialEquipment;
  return {
    bar: state.bar,
    step: state.profile?.step ?? state.draftProfile.step,
    plates: state.plateSizes,
  };
}
