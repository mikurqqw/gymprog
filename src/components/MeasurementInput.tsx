import { useI18n } from '../i18n';
import { canonical, shown, type Measure } from '../lib/measurements';
import { Field } from './ui';

export function MeasurementInput({
  label,
  value,
  onChange,
  measure = 'weight',
  limits,
  example,
  required = true,
}: {
  label: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  measure?: Measure;
  limits: readonly [number, number];
  example?: number;
  required?: boolean;
}) {
  const { t, units, weightUnit, heightUnit } = useI18n();
  const unit = measure === 'weight' ? weightUnit : heightUnit;
  return (
    <Field label={label + ' (' + unit + ')'}>
      <input
        type="number"
        inputMode="decimal"
        required={required}
        value={shown(value, units, measure) ?? ''}
        min={shown(limits[0], units, measure)}
        max={shown(limits[1], units, measure)}
        step="any"
        placeholder={
          example === undefined
            ? undefined
            : t('examplePlaceholder') + ' ' + shown(example, units, measure)
        }
        onChange={(event) =>
          onChange(
            event.target.value === ''
              ? null
              : canonical(event.target.valueAsNumber, units, measure, limits),
          )
        }
      />
    </Field>
  );
}
