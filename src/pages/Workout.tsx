import { sessionStats } from '../lib/sessionInsights';
import { RecommendationWhy } from '../components/RecommendationWhy';
import { WorkoutResult } from '../components/WorkoutResult';
import { WorkoutTools } from '../components/WorkoutTools';
import { formatDate } from '../lib/formulas';
import { sessionMinutes } from '../lib/templateProgression';
import { dailyReadiness } from '../lib/dailyReadiness';
import { Link } from 'react-router-dom';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { useProfileStore as useStore, update } from '../lib/store';
import { generate } from '../lib/program';
import { regulate } from '../lib/autoregulation';
import { useI18n } from '../i18n';
import { Card, Empty, PageTitle, Weight } from '../components/ui';
import { WorkoutLine } from '../components/WorkoutLine';
import { WeekSelector } from '../components/WeekSelector';
export default function Workout() {
  const s = useStore(),
    { t, locale } = useI18n(),
    rows = generate(s.profile, s.adjustments, s.shifts, s.swaps, s.customProgram).filter(
      (r) => r.week === s.week,
    ),
    days = [...new Set(rows.map((r) => r.day))],
    session = rows.filter((r) => r.day === s.day),
    date = session[0]?.date,
    c = s.checkins.find((c) => c.date === date),
    r = c ? dailyReadiness(c, s.profile, s.checkins, s.foodLogs) : null,
    lines = r ? regulate(session, r, s.profile) : session,
    stats = sessionStats(lines, s.logs);
  if (!s.onboarded)
    return (
      <>
        <PageTitle title={t('today')} />
        <Card>
          <h2>{t('sfSetupTitle')}</h2>
          <p>{t('sfSetupText')}</p>
          <Link className="button" to="/profile">
            {t('sfApplyProgram')}
          </Link>
        </Card>
      </>
    );
  return (
    <>
      <PageTitle
        title={t('today')}
        description={
          date
            ? formatDate(date, locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : ''
        }
      />
      <WorkoutTools />
      <WeekSelector />
      <div className="tabs">
        {days.map((day) => (
          <button
            key={day}
            className={s.day === day ? 'active' : ''}
            onClick={() => update({ day })}
          >
            {t('session')} {day + 1}
          </button>
        ))}
      </div>
      <div className={'notice readiness-notice ' + (r?.level ?? '')}>
        <HeartPulse size={22} />
        <div>
          <strong>{r ? `${r.score}/100 · ${t(r.level)}` : t('noCheckin')}</strong>
          <p>{r ? t(r.level + 'Text') : t('checkinText')}</p>
          {r?.reasons.map((reason) => (
            <p key={reason}>{t(reason)}</p>
          ))}
        </div>
        <Link to="/checkin" className="text-link">
          {t('checkin')}
          <ArrowRight size={17} />
        </Link>
      </div>
      <RecommendationWhy before={session} after={lines} readiness={r} />
      {s.profile.goal === 'powerlifting' && s.week === 8 && s.day === 2 ? (
        <Card>
          <p>{t('testSafety')}</p>
          <Link to="/test" className="button">
            {t('test')}
            <ArrowRight size={18} />
          </Link>
        </Card>
      ) : (
        <>
          {lines.some((l) => l.lift) && (
            <p className="warmup-notice">
              {t('warmupText')} <b>{t('ceiling')}</b>
            </p>
          )}
          {!lines.length ? (
            <Card>
              <Empty
                title={t(r?.level === 'red' ? 'red' : 'noSchedule')}
                text={t(r?.level === 'red' ? 'redText' : 'noAlternative')}
                action={
                  <Link className="button secondary" to="/builder">
                    {t('builder')}
                  </Link>
                }
              />
            </Card>
          ) : (
            <div className="workout-list">
              {sessionMinutes(lines) > s.profile.minutes && (
                <p className="notice warning">
                  {t('sessionLimit')} ~{sessionMinutes(lines)} {t('min')}
                </p>
              )}
              {lines.map((row, index) => (
                <WorkoutLine key={row.id + '-' + row.exercise} row={row} index={index} />
              ))}
            </div>
          )}
        </>
      )}
      <WorkoutResult rows={lines} />
      <Card>
        <h2>{t('session')}</h2>
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
    </>
  );
}
