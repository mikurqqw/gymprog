import { useI18n } from '../i18n';
import { Num, Select } from './ui';
export function ExperienceField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useI18n();
  const level = value === 0 ? 0 : value < 1 ? 1 : value < 3 ? 2 : value < 5 ? 3 : 4;
  return (
    <div className="experience-field">
      <Select
        label={t('experienceLevel')}
        value={String(level)}
        options={[0, 1, 2, 3, 4].map((level) => ({
          value: String(level),
          label: t('experience' + level),
        }))}
        onChange={(next) => onChange([0, 0.5, 2, 4, 8][Number(next)])}
      />
      <details>
        <summary>{t('experienceExact')}</summary>
        <Num
          label={t('experience')}
          value={value}
          min={0}
          max={60}
          step={0.5}
          onChange={onChange}
        />
      </details>
    </div>
  );
}
