import { useI18n } from '../i18n';
import { Field } from './ui';
export function DraftNumber({
  label,
  value,
  onChange,
  min,
  max,
  example,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  example: number;
}) {
  const { t } = useI18n();
  return (
    <Field label={label}>
      <input
        type="number"
        required
        min={min}
        max={max}
        step="any"
        value={value ?? ''}
        placeholder={t('examplePlaceholder') + ' ' + example}
        onChange={(event) =>
          onChange(event.target.value === '' ? null : Number(event.target.value))
        }
      />
    </Field>
  );
}
