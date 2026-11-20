import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import type { SeriesVariant } from '../lib/fitSeries';
import { groupSeriesVariants, trainingLevels } from '../lib/trainingLevels';
import { Field } from './ui';

export function SeriesVariantPicker({
  variants,
  value,
  onChange,
}: {
  variants: SeriesVariant[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { t, language } = useI18n();
  const groups = groupSeriesVariants(variants);
  const option = (variant: SeriesVariant) => (
    <option key={variant.id} value={variant.id}>
      {variant.title}
    </option>
  );
  return (
    <Field label={seriesStrings.variant[language]}>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{t('selectValue')}</option>
        {trainingLevels
          .filter((level) => groups[level].length)
          .map((level) => (
            <optgroup key={level} label={t(level)}>
              {groups[level].map(option)}
            </optgroup>
          ))}
        {groups.other.map(option)}
      </select>
    </Field>
  );
}
