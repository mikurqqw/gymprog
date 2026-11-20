import { HeartPulse } from 'lucide-react';
import type { dailyReadiness } from '../lib/dailyReadiness';
import { useI18n } from '../i18n';
import { AlgorithmChip } from './ContextNotice';
import { Card } from './ui';
export function HomeReadiness({
  readiness,
}: {
  readiness: ReturnType<typeof dailyReadiness> | null;
}) {
  const { t } = useI18n();
  return (
    <Card className="home-readiness compact-readiness">
      <div className="section-heading">
        <h2>
          <HeartPulse size={20} /> {t('readiness')}
        </h2>
      </div>
      {readiness?.level === 'red' && (
        <div className="notice danger">
          <p>{t('redText')}</p>
          {readiness.reasons.map((reason) => (
            <p key={reason}>{t(reason)}</p>
          ))}
        </div>
      )}
      <details className="page-help">
        <summary>{t('calculationDetails')}</summary>
        {readiness?.level !== 'red' && (
          <p>{t(readiness ? readiness.level + 'Text' : 'checkinText')}</p>
        )}
        {readiness?.level !== 'red' &&
          readiness?.reasons.map((reason) => (
            <p className="micro muted" key={reason}>
              {t(reason)}
            </p>
          ))}
        <AlgorithmChip />
      </details>
    </Card>
  );
}
