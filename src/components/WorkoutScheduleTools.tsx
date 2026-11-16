import { useI18n } from '../i18n';
import { update, useProfileStore } from '../lib/store';
import { sessionKey } from '../lib/sessionInsights';
import { WeekSelector } from './WeekSelector';
import { WorkoutTools } from './WorkoutTools';
export function WorkoutScheduleTools({ days }: { days: number[] }) {
  const state = useProfileStore(),
    { t } = useI18n();
  const content = (
    <>
      <WorkoutTools
        active={
          state.workoutView === 'focus' &&
          !state.sessionCompletions[sessionKey(state, state.week, state.day)]
        }
      />
      <WeekSelector />
      <div className="tabs">
        {days.map((day) => (
          <button
            key={day}
            className={state.day === day ? 'active' : ''}
            onClick={() => update({ day })}
          >
            {t('session')} {day + 1}
          </button>
        ))}
      </div>
    </>
  );
  return state.workoutView === 'focus' ? (
    <details className="focus-schedule">
      <summary>
        {t('week')} {state.week} · {t('session')} {state.day + 1} · {t('focusSessionOptions')}
      </summary>
      {content}
    </details>
  ) : (
    content
  );
}
