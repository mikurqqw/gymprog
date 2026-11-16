import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useProfileStore as useStore, replaceWithUndo, update } from '../lib/store';
import {
  finishSession,
  sessionKey,
  sessionStats,
  previousExerciseLog,
  nextOpenSession,
} from '../lib/sessionInsights';
import { generate } from '../lib/plannedProgram';
import { exerciseById } from '../lib/program';
import type { Planned } from '../lib/schema';
import { useI18n } from '../i18n';
import { Card, Weight } from './ui';
export function WorkoutResult({ rows }: { rows: Planned[] }) {
  const state = useStore(),
    { t, local } = useI18n(),
    stats = sessionStats(rows, state.logs),
    key = sessionKey(state, state.week, state.day),
    completed = state.sessionCompletions[key],
    allRows = generate(
      state.profile,
      state.adjustments,
      state.shifts,
      state.swaps,
      state.customProgram,
    ),
    next = nextOpenSession(state, allRows, { week: state.week, day: state.day });
  if (!stats.done && !completed) return null;
  return (
    <div id="workout-result">
      <Card className="workout-result">
        <div className="section-heading">
          <h2>{t(completed ? 'sfFinished' : 'sfSummary')}</h2>
          {completed && <CheckCircle2 size={24} />}
        </div>
        <p className="micro muted">{t('sfSummaryIntro')}</p>
        <div className="stat-grid">
          <div>
            {t('sfSetCount')}
            <strong>
              {stats.done}/{stats.planned}
            </strong>
          </div>
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
        </div>
        <div className="result-comparisons">
          {stats.matched.map(({ row, log, sets }) => {
            const previous = previousExerciseLog(log, state.logs);
            return (
              <article key={log.id}>
                <h3>{local(exerciseById(row.exercise).name)}</h3>
                <p>
                  {t('sfCurrentResult')}: {sets} × {log.reps} · <Weight value={log.weight} />
                </p>
                {previous ? (
                  <p className="micro muted">
                    {t('sfPreviousResult')} ({previous.date}):{' '}
                    {previous.sets.filter(Boolean).length} × {previous.reps} ·{' '}
                    <Weight value={previous.weight} />
                  </p>
                ) : (
                  <p className="micro muted">{t('sfFirstResult')}</p>
                )}
              </article>
            );
          })}
        </div>
        <p className="micro muted">{t('sfNoAutomaticIncrease')}</p>
        <div className="inline">
          {completed ? (
            <button
              className="button secondary"
              onClick={() => {
                const sessionCompletions = { ...state.sessionCompletions };
                delete sessionCompletions[key];
                replaceWithUndo({
                  ...state,
                  sessionCompletions,
                  activeSession: {
                    week: state.week,
                    day: state.day,
                    touchedAt: new Date().toISOString(),
                  },
                });
              }}
            >
              {t('sfReopen')}
            </button>
          ) : (
            <button
              className="button"
              onClick={() => {
                if (stats.done < stats.planned && !confirm(t('sfFinishPartial'))) return;
                replaceWithUndo(finishSession(state, rows, new Date().toISOString()));
              }}
            >
              {t('sfFinish')}
            </button>
          )}
          {completed &&
            (next ? (
              <Link
                className="button"
                to="/workout"
                onClick={() => update({ week: next.week, day: next.day })}
              >
                {t('sfNextWorkout')}
                <ArrowRight size={17} />
              </Link>
            ) : (
              <Link className="button secondary" to="/catalog">
                {t('sfChoose')}
              </Link>
            ))}
        </div>
      </Card>
    </div>
  );
}
