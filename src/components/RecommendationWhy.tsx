import { AlgorithmChip } from './ContextNotice';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import type { Planned } from '../lib/schema';
import type { readiness } from '../lib/autoregulation';
type Readiness = ReturnType<typeof readiness>;
export function RecommendationWhy({
  before,
  after,
  readiness: result,
}: {
  before: Planned[];
  after: Planned[];
  readiness: Readiness | null;
}) {
  const { t } = useI18n(),
    sets = (rows: Planned[]) => rows.reduce((sum, row) => sum + row.sets, 0),
    cap = (rows: Planned[]) => (rows.length ? Math.max(...rows.map((row) => row.rpe)) : '—');
  return (
    <details className="recommendation-why">
      <summary>{t('sfWhy')}</summary>
      <p>
        {t(
          !result
            ? 'sfWhyDefault'
            : result.level === 'green'
              ? 'sfWhyGreen'
              : result.level === 'red'
                ? 'sfWhyStop'
                : 'sfWhyAdjusted',
        )}
      </p>
      {result && (
        <>
          <ul>
            {[...new Set(result.reasons)].map((reason) => (
              <li key={reason}>{t(reason)}</li>
            ))}
          </ul>
          <p className="micro">
            {t('sfBeforeAfter')}: {t('sets')} {sets(before)} → {sets(after)} · RPE ≤ {cap(before)} →{' '}
            {cap(after)}
          </p>
          <p className="micro muted">
            {t('readiness')}: {result.score}/100
          </p>
          {result.level === 'red' && <p className="notice danger">{t('emergencyHelp')}</p>}
        </>
      )}
      <p className="micro muted">{t('sfWhyLimits')}</p>
      <AlgorithmChip />
      <Link className="text-link" to="/program">
        {t('science')} →
      </Link>
    </details>
  );
}
