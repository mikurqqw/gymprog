import type { CheckinEdit } from './CheckinRecoveryFields';
import type { Checkin } from '../lib/schema';
import { displayWeight, fromWeight } from '../lib/formulas';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Num } from './ui';
import { Disclosure } from './Disclosure';
export function CheckinMeasurements({ value, change }: { value: Checkin; change: CheckinEdit }) {
  const { t, units, weightUnit } = useI18n();
  return (
    <Disclosure label="compactMeasurements">
      <p className="micro muted">{t('measurementsProfile')}</p>
      <div className="form-grid">
        {(['weight', 'water', 'calories', 'protein', 'carbs'] as const).map((key) => (
          <Num
            key={key}
            required={false}
            label={
              t(
                key === 'weight'
                  ? 'bodyweight'
                  : key === 'calories'
                    ? 'caloriesYesterday'
                    : key === 'protein'
                      ? 'proteinYesterday'
                      : key === 'carbs'
                        ? 'carbsYesterday'
                        : key,
              ) + (key === 'weight' ? ' (' + weightUnit + ')' : '')
            }
            value={
              key === 'weight' && value.weight !== undefined
                ? displayWeight(value.weight, units)
                : value[key]
            }
            min={key === 'weight' ? (units === 'metric' ? 35 : 77) : 0}
            max={
              {
                calories: 12000,
                protein: 600,
                carbs: 1500,
                water: 12,
                weight: units === 'metric' ? 250 : 551,
              }[key]
            }
            step={key === 'weight' || key === 'water' ? 0.1 : 1}
            onChange={(next) => change(key, key === 'weight' ? fromWeight(next, units) : next)}
          />
        ))}
      </div>
    </Disclosure>
  );
}
