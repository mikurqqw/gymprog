import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfileStore as useStore, update } from '../lib/store';
import type { Planned } from '../lib/schema';
import { exerciseById } from '../lib/program';
import { sessionStats, sessionKey } from '../lib/sessionInsights';
import { formatDate } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card } from './ui';
export function HomeWeek({ groups }: { groups: Planned[][] }) {
  const state = useStore(),
    { t, local, locale } = useI18n();
  return (
    <Card className="home-week">
      <div className="section-heading">
        <h2>{t('weekOverview')}</h2>
        <Link className="text-link" to="/program">
          {t('viewPlan')} →
        </Link>
      </div>
      <div className="home-week-grid">
        {groups.map((group) => {
          const first = group[0],
            summary = sessionStats(group, state.logs),
            finished = !!state.sessionCompletions[sessionKey(state, first.week, first.day)];
          return (
            <Link
              className="home-week-session"
              to="/workout?source=base"
              key={first.day}
              onClick={() => update({ day: first.day })}
            >
              <span className="eyebrow">
                {formatDate(first.date, locale, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <h3>
                {t('week')} {first.week} · {t('day')} {first.day + 1}
              </h3>
              <span>{local(exerciseById(first.exercise).name)}</span>
              <span className="micro muted">
                {finished ? t('sfFinished') : `${summary.done}/${summary.planned} ${t('sets')}`}
              </span>
              <ArrowRight size={18} />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
