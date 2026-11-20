import { useDiaryI18n } from '../i18n/useDiaryI18n';
import { calorieSafety } from '../lib/calorieSafety';
import type { Profile } from '../lib/schema';
import { update, useProfileStore } from '../lib/store';
import { Card, Select } from './ui';

const nutritionGoals = (profile: Profile) =>
  [
    'maintain',
    'gain',
    ...(calorieSafety(profile).deficitAllowed ? ['loss', 'recomp'] : []),
  ] as const;

export function NutritionTargetsControls({ resetMenu }: { resetMenu: () => void }) {
  const { profile, nutritionDayType } = useProfileStore();
  const { t } = useDiaryI18n();
  const goals = nutritionGoals(profile);
  return (
    <Card>
      <div className="form-grid">
        <Select
          label={t('nutritionGoal')}
          value={profile.nutritionGoal}
          options={[...new Set([...goals, profile.nutritionGoal])].map((value) => ({
            value,
            label: t(value),
          }))}
          onChange={(value) => {
            if (!goals.some((goal) => goal === value)) return;
            update((old) =>
              old.profile
                ? { profile: { ...old.profile, nutritionGoal: value as Profile['nutritionGoal'] } }
                : {},
            );
            resetMenu();
          }}
        />
        <Select
          label={t('nutritionDayType')}
          value={nutritionDayType}
          options={(['heavy', 'medium', 'rest'] as const).map((value) => ({
            value,
            label: t(value === 'heavy' ? 'heavy' : value === 'medium' ? 'mediumDay' : 'restDay'),
          }))}
          onChange={(value) => {
            if (value !== 'heavy' && value !== 'medium' && value !== 'rest') return;
            update({ nutritionDayType: value });
            resetMenu();
          }}
        />
      </div>
    </Card>
  );
}
