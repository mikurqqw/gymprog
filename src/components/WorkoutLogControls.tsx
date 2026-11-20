import { Check, Minus, Plus } from 'lucide-react';
import { useI18n } from '../i18n';
import { workoutEquipment } from '../lib/equipment';
import { canonical, shown } from '../lib/measurements';
import { exerciseById } from '../lib/program';
import type { Planned } from '../lib/schema';
import { useProfileStore } from '../lib/store';
import type { useWorkoutLog } from '../lib/useWorkoutLog';
import { SetControl } from './SetControl';

export function WorkoutLogControls({
  row,
  log,
  write,
  conflict,
}: Pick<ReturnType<typeof useWorkoutLog>, 'log' | 'write'> & { row: Planned; conflict: boolean }) {
  const { t, local, units, weightUnit } = useI18n();
  const equipment = workoutEquipment(useProfileStore());
  const ex = exerciseById(row.exercise);
  const complete = log.sets.every(Boolean);
  return (
    <div className="workout-controls">
      <div className="weight-stepper">
        <button
          className="icon-button"
          disabled={conflict || log.weight <= 0}
          aria-label={t('weight') + ' −'}
          onClick={() => write({ weight: Math.max(0, log.weight - equipment.step) })}
        >
          <Minus size={19} />
        </button>
        <label>
          <span className="sr-only">
            {t('actual')} {t('weight')}
          </span>
          <input
            type="number"
            min={0}
            max={shown(800, units)}
            step="any"
            value={shown(log.weight, units)}
            onChange={(e) =>
              write({ weight: canonical(Number(e.target.value), units, 'weight', [0, 800]) })
            }
          />
          <small>{weightUnit}</small>
        </label>
        <button
          className="icon-button"
          disabled={conflict || log.weight >= 800}
          aria-label={t('weight') + ' +'}
          onClick={() => write({ weight: Math.min(800, log.weight + equipment.step) })}
        >
          <Plus size={19} />
        </button>
      </div>
      <div className="set-checkboxes">
        {log.sets.map((checked, i) => (
          <SetControl
            key={i}
            index={i}
            checked={checked}
            disabled={conflict}
            label={t('sets') + ' ' + (i + 1) + ' ' + local(ex.name)}
            onClick={() => write({ sets: log.sets.map((n, j) => (i === j ? !n : n)) }, !checked)}
          />
        ))}
      </div>
      <button
        className="button secondary complete-button"
        disabled={
          conflict ||
          complete ||
          (row.weight === null && row.lift !== null && log.weight === 0 && !row.loadUnassessed)
        }
        onClick={() =>
          write(
            {
              sets: log.sets.map(() => true),
              status: log.weight === row.weight && log.reps === row.reps ? 'done' : 'modified',
            },
            true,
          )
        }
      >
        <Check size={17} />
        {t(complete ? 'done' : 'complete')}
      </button>
    </div>
  );
}
