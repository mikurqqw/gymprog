import { Disclosure } from '../components/Disclosure';
import { AlgorithmChip } from '../components/ContextNotice';
import { HomeSupportingCards } from '../components/HomeSupportingCards';
import { ArrowRight, CalendarDays, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProfileStore as useStore, update } from '../lib/store';
import { generate } from '../lib/plannedProgram';
import { exerciseById } from '../lib/program';
import { dailyReadiness } from '../lib/dailyReadiness';
import { regulate } from '../lib/autoregulation';
import {
  resumeSession,
  nextOpenSession,
  sessionGroups,
  sessionStats,
  sessionKey,
} from '../lib/sessionInsights';
import { formatDate } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, PageTitle, ProgressBar } from '../components/ui';
import { StrengthCards } from '../components/StrengthCards';
import { RecommendationWhy } from '../components/RecommendationWhy';
export function Home() {
  const state = useStore(),
    { t, local, locale } = useI18n(),
    rows = generate(
      state.profile,
      state.adjustments,
      state.shifts,
      state.swaps,
      state.customProgram,
    ),
    resume = resumeSession(state, rows),
    selected = rows.find((row) => row.week === state.week && row.day === state.day),
    selectedDone =
      selected && state.sessionCompletions[sessionKey(state, selected.week, selected.day)],
    next = nextOpenSession(state, rows),
    target = resume ?? (selectedDone ? next : selected) ?? next;
  const session = target
      ? rows.filter((row) => row.week === target.week && row.day === target.day)
      : [],
    checkin = state.checkins.find((entry) => entry.date === session[0]?.date),
    readiness = checkin
      ? dailyReadiness(checkin, state.profile, state.checkins, state.foodLogs)
      : null,
    adjusted = readiness ? regulate(session, readiness, state.profile) : session,
    stats = sessionStats(session, state.logs),
    weekGroups = sessionGroups(rows.filter((row) => row.week === state.week));
  return (
    <>
      <PageTitle
        title={t('sfDashboardTitle')}
        description={t('compactHomeLead')}
        action={
          <Link className="button secondary" to="/catalog">
            {t('sfPrograms')}
            <ArrowRight size={16} />
          </Link>
        }
      />
      {!state.onboarded && (
        <Link className="onboarding-banner" to="/profile">
          <span>
            <b>{t('onboarding')}</b>
            <span>{t('sfSetupText')}</span>
          </span>
          <ArrowRight size={20} />
        </Link>
      )}
      <div className="home-focus-grid">
        <Card className="home-next">
          <div className="section-heading">
            <span className="pill">
              {t('week')} {target?.week ?? state.week}/8 · {t(state.profile.goal)}
            </span>
            <CalendarDays size={22} />
          </div>
          <p className="eyebrow">{t(resume ? 'sfResumeTitle' : 'sfTodayTitle')}</p>
          <h2>
            {session[0] ? local(exerciseById(session[0].exercise).name) : t('sfCycleComplete')}
          </h2>
          <p className="muted">
            {session[0]
              ? formatDate(session[0].date, locale, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : t('sfFullToolsText')}
          </p>
          {resume && <p>{t('sfResumeText')}</p>}
          {session.length > 0 && (
            <>
              <p>
                {session.length} {t('library').toLowerCase()} · {stats.done}/{stats.planned}{' '}
                {t('sfSetCount').toLowerCase()}
              </p>
              <ProgressBar
                label={t('completion')}
                value={(stats.done / Math.max(1, stats.planned)) * 100}
              />
              <Link
                className="button"
                to="/workout"
                onClick={() => {
                  if (target)
                    update({
                      week: target.week,
                      day: target.day,
                      workoutView: state.workoutView ?? 'focus',
                    });
                }}
              >
                {t(resume ? 'sfContinue' : 'startWorkout')}
                <ArrowRight size={20} />
              </Link>
            </>
          )}
          {!session.length && (
            <Link className="button" to="/catalog">
              {t('sfChoose')}
              <ArrowRight size={20} />
            </Link>
          )}
          <RecommendationWhy before={session} after={adjusted} readiness={readiness} />
        </Card>
        <Card className="home-readiness">
          <HeartPulse size={25} />
          <h2>{t('readiness')}</h2>
          <p>{t(readiness ? readiness.level + 'Text' : 'checkinText')}</p>
          {readiness?.reasons.slice(0, 2).map((reason) => (
            <p className="micro muted" key={reason}>
              {t(reason)}
            </p>
          ))}
          <Link className="button secondary" to="/checkin">
            {t('checkin')}
            <ArrowRight size={16} />
          </Link>
          <AlgorithmChip />
        </Card>
      </div>
      <Disclosure label="compactWeek">
        <Card className="home-week">
          <div className="section-heading">
            <h2>{t('weekOverview')}</h2>
            <Link className="text-link" to="/program">
              {t('viewPlan')} →
            </Link>
          </div>
          <div className="home-week-grid">
            {weekGroups.map((group) => {
              const first = group[0],
                summary = sessionStats(group, state.logs),
                finished = !!state.sessionCompletions[sessionKey(state, first.week, first.day)];
              return (
                <Link
                  className="home-week-session"
                  to="/workout"
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
                  <h3>{local(exerciseById(first.exercise).name)}</h3>
                  <span className="micro muted">
                    {finished ? t('sfFinished') : `${summary.done}/${summary.planned} ${t('sets')}`}
                  </span>
                  <ArrowRight size={18} />
                </Link>
              );
            })}
          </div>
        </Card>
      </Disclosure>
      <Disclosure label="compactMetrics">
        <HomeSupportingCards rows={rows} />
      </Disclosure>
      <details className="home-extra">
        <summary>{t('sfMoreMetrics')}</summary>
        <StrengthCards />
        <Link className="text-link" to="/progress">
          {t('progress')} →
        </Link>
      </details>
      <p className="micro muted">
        {t('sfAllTools')} ·{' '}
        <Link className="text-link" to="/welcome">
          IronCycle
        </Link>
      </p>
    </>
  );
}
