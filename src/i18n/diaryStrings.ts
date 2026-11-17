import { regionStrings } from './regionStrings';
import { recoveryDiaryStrings } from './recoveryDiaryStrings';
import { onlineFoodStrings } from './onlineFoodStrings';
import { nutritionGuideStrings } from './nutritionGuideStrings';
export const diaryStrings: Record<string, { ru: string; kk: string; en: string }> = {
  ...regionStrings,
  ...recoveryDiaryStrings,
  ...onlineFoodStrings,
  ...nutritionGuideStrings,
};
