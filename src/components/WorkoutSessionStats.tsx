import { useI18n } from '../i18n';
import type { sessionStats } from '../lib/sessionInsights';
import { Disclosure } from './Disclosure';
import { Card, Weight } from './ui';

export function WorkoutSessionStats({ stats }: { stats: ReturnType<typeof sessionStats> }) {
  const { t } = useI18n();
  return (
    <Disclosure label="sfSummary">
      <Card>
        <h2>{t('progress')}</h2>
        <div className="stat-grid">
          <div>
            {t('tonnage')}
            <strong>
              <Weight value={stats.tonnage} />
            </strong>
          </div>
          <div>
            {t('averageRpe')}
            <strong>{stats.averageRpe?.toFixed(1) ?? '—'}</strong>
          </div>
          <div>
            {t('completion')}
            <strong>
              {Math.min(100, Math.round((stats.done / Math.max(1, stats.planned)) * 100))}%
            </strong>
          </div>
        </div>
      </Card>
    </Disclosure>
  );
}
