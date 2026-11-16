import { Check } from 'lucide-react';
import { useWorkoutLog } from '../lib/useWorkoutLog';
import { useProfileStore } from '../lib/store';
import { compatible, exerciseById } from '../lib/program';
import { displayWeight, fromWeight } from '../lib/formulas';
import type { Planned } from '../lib/schema';
import { useI18n } from '../i18n';
import { Stepper } from './Stepper';
export function FocusSets({ row }: { row: Planned }) {
  const { sets, write, error } = useWorkoutLog(row),
    state = useProfileStore(),
    { t, units, weightUnit } = useI18n();
  const blocked = !compatible(exerciseById(row.exercise), state.profile);
  return (
    <div className="focus-sets">
      {sets.map((log, index) => (
        <section
          className={'focus-set ' + (log.sets[0] ? 'is-done' : '')}
          key={log.id}
          aria-label={t('sets') + ' ' + (index + 1)}
        >
          <h3>
            {t('focusSet')} {index + 1}
            <span>{log.sets[0] ? t('done') : t('planned')}</span>
          </h3>
          <div className="focus-numbers">
            <Stepper
              label={t('weight')}
              value={displayWeight(log.weight, units)}
              max={units === 'metric' ? 800 : 1763}
              step={displayWeight(state.profile.step, units)}
              unit={weightUnit}
              disabled={blocked}
              onChange={(value) => write({ weight: fromWeight(value, units) }, false, index)}
            />
            <Stepper
              label={t('reps')}
              value={log.reps}
              max={3600}
              step={1}
              disabled={blocked}
              onChange={(reps) => write({ reps }, false, index)}
            />
          </div>
          <fieldset className="focus-rpe">
            <legend>RPE · {t('focusEffort')}</legend>
            {[6, 7, 8, 9, 10].map((rpe) => (
              <button
                type="button"
                key={rpe}
                disabled={blocked}
                aria-pressed={log.rpe === rpe}
                onClick={() => write({ rpe }, false, index)}
              >
                {rpe}
                <small>{t('focusRpe' + rpe)}</small>
              </button>
            ))}
          </fieldset>
          <button
            className={'button ' + (log.sets[0] ? 'secondary' : '')}
            disabled={
              blocked ||
              (!log.sets[0] && row.weight === null && row.lift !== null && log.weight === 0)
            }
            aria-pressed={log.sets[0]}
            onClick={() => write({ sets: [!log.sets[0]] }, !log.sets[0], index)}
          >
            <Check size={20} />
            {t(log.sets[0] ? 'focusUndoSet' : 'focusSetDone')}
          </button>
        </section>
      ))}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
