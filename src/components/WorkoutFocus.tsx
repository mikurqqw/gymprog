import { useProfileStore } from '../lib/store';
import { sessionStats } from '../lib/sessionInsights';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Planned } from '../lib/schema';
import { useI18n } from '../i18n';
import { WorkoutLine } from './WorkoutLine';
import { ProgressBar } from './ui';
export function WorkoutFocus({ rows }: { rows: Planned[] }) {
  const state = useProfileStore();
  const [index, setIndex] = useState(0),
    { t } = useI18n(),
    current = Math.min(index, rows.length - 1);
  if (!rows.length) return null;
  return (
    <section className="workout-focus" aria-label={t('focusView')}>
      <div className="focus-progress">
        <p>
          {t('focusExercise')} {current + 1} / {rows.length}
        </p>
        <ProgressBar label={t('focusExercise')} value={((current + 1) / rows.length) * 100} />
      </div>
      <WorkoutLine
        key={rows[current].id + rows[current].exercise}
        row={rows[current]}
        index={current}
        focus
      />
      <nav className="focus-navigation" aria-label={t('focusExercise')}>
        <button
          className="button secondary"
          disabled={current === 0}
          onClick={() => setIndex(current - 1)}
        >
          {t('back')}
        </button>
        <Link className="button secondary" to={'/checkin?date=' + rows[current].date}>
          {t('pain')}
        </Link>
        <button
          className="button"
          disabled={current === rows.length - 1}
          onClick={() => setIndex(current + 1)}
        >
          {t('next')}
        </button>
      </nav>
      <button
        className="text-button focus-finish"
        disabled={!sessionStats(rows, state.logs).done}
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('workout-result')?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          });
        }}
      >
        {t('sfFinish')}
      </button>
    </section>
  );
}
