import type { CheckinEdit } from './CheckinRecoveryFields';
import type { Checkin } from '../lib/schema';
import { MeasurementInput } from './MeasurementInput';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Num } from './ui';
import { Disclosure } from './Disclosure';
export function CheckinMeasurements({ value, change }: { value: Checkin; change: CheckinEdit }) {
  const { t } = useI18n();
  return (
    <Disclosure label="compactMeasurements">
      <p className="micro muted">{t('measurementsProfile')}</p>
      <div className="form-grid">
        <MeasurementInput
          label={t('bodyweight')}
          value={value.weight}
          limits={[35, 250]}
          required={false}
          onChange={(next) => change('weight', next ?? NaN)}
        />
        {(['water', 'calories', 'protein', 'carbs'] as const).map((key) => (
          <Num
            key={key}
            required={false}
            label={t(key === 'water' ? key : key + 'Yesterday')}
            value={value[key]}
            min={0}
            max={{ calories: 12000, protein: 600, carbs: 1500, water: 12 }[key]}
            step={key === 'water' ? 0.1 : 1}
            onChange={(next) => change(key, next)}
          />
        ))}
      </div>
    </Disclosure>
  );
}
