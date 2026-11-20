import { WorkoutExerciseDetails } from './WorkoutExerciseDetails';
import { WorkoutLogControls } from './WorkoutLogControls';
import { FocusSets } from './FocusSets';
import { FocusTechnique } from './FocusTechnique';
import { useWorkoutLog } from '../lib/useWorkoutLog';
import { useState } from 'react';
import { ChevronDown, Timer } from 'lucide-react';
import { useI18n } from '../i18n';
import { useProfileStore as useStore } from '../lib/store';
import { compatible, exerciseById } from '../lib/program';
import { roundTo } from '../lib/formulas';
import { immediateAdjustment } from '../lib/autoregulation';
import { type Planned } from '../lib/schema';
import { Card, Weight } from './ui';
export function WorkoutLine({
  row,
  index,
  focus = false,
}: {
  row: Planned;
  index: number;
  focus?: boolean;
}) {
  const s = useStore(),
    { t, local } = useI18n(),
    ex = exerciseById(row.exercise),
    { log, sets: setRecords, write, error } = useWorkoutLog(row),
    [expanded, setExpanded] = useState(false);
  const complete = log.sets.every(Boolean);
  const reduction = immediateAdjustment(
      Math.max(...setRecords.map((record) => record.rpe)),
      row.rpe,
      setRecords.every((record) => record.technique),
    ),
    conflict = !compatible(ex, s.profile);
  return (
    <Card
      className={'workout-line ' + (focus ? 'focus-exercise ' : '') + (complete ? 'completed' : '')}
    >
      <div className="workout-line-heading">
        {!focus && <span className="exercise-index">{String(index + 1).padStart(2, '0')}</span>}
        <div>
          {!focus && <span className={'mode mode-' + row.mode}>{t(row.mode)}</span>}
          <h2>{local(ex.name)}</h2>
          <p className="micro muted">{local(row.tip)}</p>
        </div>
        {!focus && (
          <button
            className="icon-button"
            aria-label={t('readMore') + ' ' + local(ex.name)}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDown size={20} />
          </button>
        )}
      </div>
      {conflict && <p className="notice danger">{t('injuryConflict')}</p>}
      {row.injuryAdjusted && (
        <div className="notice warning">
          <strong>{t('injuryAdjusted')}</strong>
          <span>{t('injuryAdjustmentText')}</span>
          <small>
            {row.adjustmentReasons
              ?.map((reason) => reason.split(':').map(t).join(' · '))
              .join('; ')}
          </small>
        </div>
      )}
      <div className="workout-plan">
        <span>
          {t('planned')}:{' '}
          <b>
            {row.sets} × {row.reps}
          </b>
        </span>
        <span>{row.weight === null ? t('manualLoad') : <Weight value={row.weight} />}</span>
        {row.percent !== null && <span>{Math.round(row.percent * 1000) / 10}%</span>}
        <span>RPE ≤ {row.rpe}</span>
        <span>
          <Timer size={14} />
          {row.rest} {t('min')}
        </span>
        {row.tempo && (
          <span>
            {t('tempo')}: {row.tempo}
          </span>
        )}
        {row.superset && (
          <span>
            {t('superset')}: {row.superset}
          </span>
        )}
      </div>
      {focus && <FocusTechnique exercise={ex} />}
      {focus && (
        <button
          className="button secondary focus-options-button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {t('exerciseDetails')}
        </button>
      )}
      {expanded && <WorkoutExerciseDetails row={row} log={log} write={write} conflict={conflict} />}
      {focus ? (
        <FocusSets row={row} />
      ) : (
        <WorkoutLogControls row={row} log={log} write={write} conflict={conflict} />
      )}

      {reduction < 0 && log.sets.some(Boolean) && (
        <div className="notice warning">
          {t('immediateReduce')}{' '}
          <button
            className="text-button"
            onClick={() => write({ weight: roundTo(log.weight * (1 + reduction), s.profile.step) })}
          >
            −5%
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </Card>
  );
}
