import { update, useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { Select } from './ui';
export function WeekSelector() {
  const { week } = useStore(),
    { t } = useI18n();
  return (
    <Select
      label={t('week')}
      value={String(week)}
      options={Array.from({ length: 8 }, (_, index) => ({
        value: String(index + 1),
        label: String(index + 1),
      }))}
      onChange={(value) => update({ week: Number(value), day: 0 })}
    />
  );
}
