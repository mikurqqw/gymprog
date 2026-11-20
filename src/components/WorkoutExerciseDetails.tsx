import { useI18n } from '../i18n';
import { workoutEquipment } from '../lib/equipment';
import { e1rm, plates } from '../lib/formulas';
import { shown } from '../lib/measurements';
import type { Planned } from '../lib/schema';
import { useProfileStore } from '../lib/store';
import type { useWorkoutLog } from '../lib/useWorkoutLog';
import { ReplacementControl } from './ReplacementControl';
import { Warmup } from './Warmup';
import { Num, Weight } from './ui';
import { WorkoutVideo } from './WorkoutVideo';

export function WorkoutExerciseDetails({
  row,
  log,
  write,
  conflict,
}: Pick<ReturnType<typeof useWorkoutLog>, 'log' | 'write'> & { row: Planned; conflict: boolean }) {
  const state = useProfileStore();
  const { t, units } = useI18n();
  const equipment = workoutEquipment(state);
  const plate = plates(log.weight, equipment.bar, equipment.plates);
  const estimated = log.lift && log.sets.some(Boolean) ? e1rm(log.weight, log.reps, log.rpe) : null;
  const previous = state.logs
    .filter(
      (item) => item.exercise === row.exercise && item.date < row.date && item.sets.some(Boolean),
    )
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return (
    <div className="workout-detail">
      <details>
        <summary>{t('changeExercise')}</summary>
        <ReplacementControl row={row} />
      </details>
      {row.lift && state.profile.strengthAssessment[row.lift] !== 'unknown' && (
        <Warmup lift={row.lift} ceiling={row.weight ?? undefined} />
      )}
      <details>
        <summary>{t('recordedSetDetails')}</summary>
        <div className="form-grid">
          <Num
            label={t('actual') + ' ' + t('reps')}
            value={log.reps}
            min={0}
            max={3600}
            onChange={(v) => write({ reps: v })}
          />
          <Num
            label={t('actual') + ' RPE'}
            value={log.rpe}
            min={1}
            max={10}
            step={0.5}
            onChange={(v) => write({ rpe: v })}
          />
        </div>
        {previous && (
          <button
            className="button secondary"
            disabled={conflict}
            onClick={() =>
              write({
                weight: row.injuryAdjusted
                  ? Math.min(previous.weight, row.weight ?? 0)
                  : row.weight === null
                    ? 0
                    : Math.min(previous.weight, row.weight),
                reps: Math.min(previous.reps, row.reps),
              })
            }
          >
            {t('sameLast')}
          </button>
        )}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={log.technique}
            onChange={(e) => write({ technique: e.target.checked })}
          />
          {t('techniqueStable')}
        </label>
        {estimated && (
          <p>
            {t('e1rm')}:{' '}
            <b>
              <Weight value={Math.round(estimated * 10) / 10} />
            </b>
          </p>
        )}
      </details>
      <details>
        <summary>{t('plates')}</summary>
        <p>
          {t('bar')}: <Weight value={equipment.bar} /> · {t('perSide')}:{' '}
          {plate.result.map((x) => `${shown(x.plate, units)} × ${x.count}`).join(' + ') || '—'}
        </p>
        {(plate.remaining > 0 || plate.belowBar) && <p className="warning">{t('unavailable')}</p>}
      </details>
      <WorkoutVideo rowId={row.id} log={log} write={write} />
      <button
        className="text-button"
        onClick={() =>
          write({
            status: log.status === 'skipped' ? 'planned' : 'skipped',
            sets: log.sets.map(() => false),
          })
        }
      >
        {t(log.status === 'skipped' ? 'planned' : 'skip')}
      </button>
    </div>
  );
}
