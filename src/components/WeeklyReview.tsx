import type { Planned } from '../lib/schema';
import { liftIds } from '../lib/schema';
import { update, useProfileStore as useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { dateOffset, today } from '../lib/formulas';
import { weeklySuggestion, readiness } from '../lib/autoregulation';
import { Card } from './ui';
import { WeeklyAdjustment } from './WeeklyAdjustment';
export function WeeklyReview({ rows }: { rows: Planned[] }) {
  const s = useStore(),
    { t } = useI18n(),
    logs = s.logs.filter((l) => rows.some((r) => r.id === l.id) && l.sets.some(Boolean)),
    start = dateOffset(s.profile.start, (s.week - 1) * 7),
    checks = s.checkins.filter((c) => c.date >= start && c.date <= dateOffset(start, 6));
  const avg = (values: number[]) =>
    values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const adherence = logs.length / Math.max(1, rows.length),
    sleep = avg(checks.map((c) => c.sleep));
  return (
    <Card>
      <h2>{t('weeklyReview')}</h2>
      <div className="stat-grid">
        <div>
          {t('sleep')}
          <strong>
            {checks.length ? sleep.toFixed(1) : '—'} {t('hours')}
          </strong>
        </div>
        <div>
          {t('readiness')}
          <strong>
            {checks.length
              ? Math.round(avg(checks.map((c) => readiness(c, s.profile, s.checkins).score)))
              : '—'}
            /100
          </strong>
        </div>
        <div>
          Δ RPE
          <strong>
            {logs.length ? avg(logs.map((l) => l.rpe - l.targetRpe)).toFixed(1) : '—'}
          </strong>
        </div>
        <div>
          {t('completion')}
          <strong>{Math.round(adherence * 100)}%</strong>
        </div>
      </div>
      {today() > dateOffset(start, 6) && adherence < 0.6 && (
        <p className="notice warning">
          {t('repeatWeek')}{' '}
          <button className="text-button" onClick={() => update({ week: Math.max(1, s.week - 1) })}>
            {t('back')}
          </button>
        </p>
      )}
      <div className="form-grid">
        {liftIds.map((lift) => {
          const adjustment = weeklySuggestion(
            s.logs.filter((l) => l.date <= dateOffset(start, 6)),
            lift,
            s.week + 1,
            sleep >= s.profile.sleep - 1,
            checks.some((c) => (c.recovery ?? 5) <= 2),
          );
          return (
            <WeeklyAdjustment
              key={`${s.week}-${lift}-${adjustment}`}
              lift={lift}
              suggestion={adjustment}
            />
          );
        })}
      </div>
      <p className="muted">{t('reviewText')}</p>
    </Card>
  );
}
