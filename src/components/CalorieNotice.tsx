import { useState } from 'react';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { calibrateEnergy } from '../lib/calorieSafety';
import { nutrition } from '../lib/nutrition';
export function CalorieNotice() {
  const s = useStore(),
    { t } = useI18n(),
    [adaptive, setAdaptive] = useState(false),
    n = nutrition(s.profile);
  const rows = s.checkins.map((c) => ({
    ...c,
    calories:
      c.calories ??
      (s.foodLogs.some((f) => f.date === c.date)
        ? s.foodLogs.filter((f) => f.date === c.date).reduce((sum, f) => sum + f.kcal, 0)
        : undefined),
  }));
  const calibration = calibrateEnergy(rows, n.tdee);
  return (
    <section className="notice calorie-notice">
      <div>
        <p>{t('calorieEstimate')}</p>
        {n.underweight && <p className="warning">{t('underweightNotice')}</p>}
        {!n.automaticAllowed && <p className="warning">{t('medicalDietBlocked')}</p>}
        <details>
          <summary>{t('calculationDetails')}</summary>
          <p>
            BMR = 10 × {s.profile.weight} + 6.25 × {s.profile.height} − 5 × {s.profile.age}{' '}
            {s.profile.sex === 'male' ? '+ 5' : '− 161'} = {n.bmr} {t('kcal')}
          </p>
          <p>
            TDEE = BMR × {s.profile.activity} = {n.tdee} {t('kcal')}
          </p>
          {n.automaticAllowed && (
            <>
              <p>
                {t('protein')}: 1.8 × {s.profile.weight}; {t('fat')}: 0.9 × {s.profile.weight};{' '}
                {t('carbs')}: ({n.kcal} − {n.protein.toFixed(1)} × 4 − {n.fat.toFixed(1)} × 9) ÷ 4
              </p>
              <p>{t('calorieSafety')}</p>
            </>
          )}
        </details>
        {calibration && n.automaticAllowed && (
          <>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={adaptive}
                onChange={(e) => setAdaptive(e.target.checked)}
              />
              {t('calibration')}
            </label>
            {adaptive && (
              <p>
                {calibration.estimate} ({calibration.low}–{calibration.high}) {t('kcal')} ·{' '}
                {calibration.days} {t('day')}
              </p>
            )}
          </>
        )}
        <small>{t('algorithmLabel')}</small>
      </div>
    </section>
  );
}
