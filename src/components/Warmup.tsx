import { useProfileStore as useStore } from '../lib/store';
import { warmup } from '../lib/formulas';
import type { Lift } from '../lib/schema';
import { useI18n } from '../i18n';
import { Weight } from './ui';
export function Warmup({ lift, ceiling }: { lift: Lift; ceiling?: number }) {
  const { profile: p } = useStore(),
    { t } = useI18n();
  if (p.strengthAssessment[lift] === 'unknown') return <p className="notice">{t('setupManual')}</p>;
  return (
    <details>
      <summary>{t('warmup')}</summary>
      <p>{t('warmupText')}</p>
      <div className="chip-list">
        {warmup(p.lifts[lift].current * p.lifts[lift].form, p.step, ceiling).map((set, i) => (
          <span className="chip" key={i}>
            <Weight value={set.weight} /> × {set.reps}
          </span>
        ))}
      </div>
    </details>
  );
}
