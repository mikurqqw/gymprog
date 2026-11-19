import { HomeWeek } from '../components/HomeWeek';
import { ActiveSeriesLink } from '../components/ActiveSeriesLink';
import { Disclosure } from '../components/Disclosure';
import { HomeSupportingCards } from '../components/HomeSupportingCards';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { HomeReadiness } from '../components/HomeReadiness';
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
        compact
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
      <ActiveSeriesLink />
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
        <HomeReadiness readiness={readiness} />
      </div>
      <Disclosure label="simpleMore">
        <Disclosure label="compactWeek">
          <HomeWeek groups={weekGroups} />
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
      </Disclosure>
    </>
  );
}
