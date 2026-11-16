import { useState } from 'react';
import type { Lift } from '../lib/schema';
import { useI18n } from '../i18n';
import { update, useStore } from '../lib/store';
import { Num } from './ui';
export function WeeklyAdjustment({ lift, suggestion }: { lift: Lift; suggestion: number }) {
  const s = useStore(),
    { t } = useI18n(),
    key = `${s.week + 1}-${lift}`,
    [value, setValue] = useState((s.adjustments[key] ?? suggestion) * 100),
    [saved, setSaved] = useState(false);
  return (
    <div>
      <Num
        label={`${t(lift)} · ${t('week')} ${Math.min(8, s.week + 1)} (%)`}
        value={value}
        min={-25}
        max={10}
        step={2.5}
        onChange={(v) => {
          setValue(v);
          setSaved(false);
        }}
      />
      <p className="micro muted">
        {t('proposed')}: {(suggestion * 100).toFixed(1)}%
      </p>
      <button
        className="button secondary"
        disabled={s.week >= 8 || !Number.isFinite(value) || value < -25 || value > 10}
        onClick={() => {
          update({ adjustments: { ...s.adjustments, [key]: value / 100 } });
          setSaved(true);
        }}
      >
        {t(saved ? 'saved' : 'acceptAdjustment')}
      </button>
    </div>
  );
}
