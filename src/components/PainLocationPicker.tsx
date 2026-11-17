import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Field } from './ui';
const regions = [
  'hand',
  'wrist',
  'forearm',
  'elbow',
  'shoulder',
  'neck',
  'back',
  'lowerBack',
  'chest',
  'hip',
  'thigh',
  'knee',
  'calf',
  'ankle',
  'foot',
] as const;
export function PainLocationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useI18n();
  const pieces = value
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    <div className="pain-location-picker">
      <fieldset>
        <legend>{t('location')}</legend>
        <div className="pain-region-grid">
          {regions.map((region) => {
            const label = t('region_' + region),
              active = pieces.includes(label);
            const next = (
              active ? pieces.filter((part) => part !== label) : [...pieces, label]
            ).join('; ');
            return (
              <button
                type="button"
                className="chip"
                key={region}
                aria-pressed={active}
                disabled={!active && next.length > 200}
                onClick={() => onChange(next)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <Field label={t('painLocationNote')}>
        <input maxLength={200} value={value} onChange={(event) => onChange(event.target.value)} />
      </Field>
    </div>
  );
}
