import type { Checkin } from '../lib/schema';
import type { CheckinEdit } from './CheckinRecoveryFields';
import { PainLocationPicker } from './PainLocationPicker';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Select } from './ui';
export function CheckinSafetyFields({ value, change }: { value: Checkin; change: CheckinEdit }) {
  const { t } = useI18n();
  return (
    <section className="checkin-safety" aria-labelledby="checkin-safety-title">
      <h2 id="checkin-safety-title">{t('safety')}</h2>
      <div className="form-grid">
        <Select
          label={t('pain')}
          value={value.pain}
          options={['none', 'mild', 'sharp'].map((value) => ({ value, label: t(value) }))}
          onChange={(next) => change('pain', next as Checkin['pain'])}
        />
        <Select
          label={t('speed')}
          value={value.speed}
          options={['fast', 'normal', 'slow'].map((value) => ({ value, label: t(value) }))}
          onChange={(next) => change('speed', next as Checkin['speed'])}
        />
      </div>
      <PainLocationPicker value={value.location} onChange={(next) => change('location', next)} />
      <div className="check-grid">
        {(
          [
            'meal',
            'dizziness',
            'weakness',
            'worsening',
            'numbness',
            'swelling',
            'chestPain',
          ] as const
        ).map((key) => (
          <label className="checkbox-label" key={key}>
            <input
              type="checkbox"
              checked={value[key] ?? false}
              onChange={(event) => change(key, event.target.checked)}
            />
            {t(key)}
          </label>
        ))}
      </div>
    </section>
  );
}
