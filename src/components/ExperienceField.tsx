import { z } from 'zod';
import { useI18n } from '../i18n';
import { trainingLevels } from '../lib/trainingLevels';
import { Num, Select } from './ui';
const experienceInput = z.number().min(0).max(60);
export function ExperienceField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useI18n();
  const change = (next: number) => {
    const parsed = experienceInput.safeParse(next);
    if (parsed.success) onChange(parsed.data);
  };
  const level = value < 1 ? 0 : value < 3 ? 1 : 2;
  return (
    <div className="experience-field">
      <Select
        label={t('experienceLevel')}
        value={String(level)}
        options={trainingLevels.map((label, level) => ({
          value: String(level),
          label: t(label),
        }))}
        onChange={(next) => change([0, 2, 4][Number(next)])}
      />
      <details>
        <summary>{t('experienceExact')}</summary>
        <Num label={t('experience')} value={value} min={0} max={60} step="any" onChange={change} />
      </details>
    </div>
  );
}
