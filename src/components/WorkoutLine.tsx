import { FocusSets } from './FocusSets';
import { FocusTechnique } from './FocusTechnique';
import { useWorkoutLog } from '../lib/useWorkoutLog';
import { ReplacementControl } from './ReplacementControl';
import { Warmup } from './Warmup';
import { useEffect, useState } from 'react';
import { Check, ChevronDown, Minus, Plus, Timer, Video } from 'lucide-react';
import { useI18n } from '../i18n';
import { useProfileStore as useStore } from '../lib/store';
import { compatible, exerciseById } from '../lib/program';
import { displayWeight, e1rm, fromWeight, plates, roundTo } from '../lib/formulas';
import { immediateAdjustment } from '../lib/autoregulation';
import { getVideo, saveVideo } from '../lib/video';
import { type Planned } from '../lib/schema';
import { Card, Field, Num, Weight } from './ui';
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
    { t, local, units, weightUnit } = useI18n(),
    ex = exerciseById(row.exercise),
    { log, sets: setRecords, write, error } = useWorkoutLog(row),
    [expanded, setExpanded] = useState(false),
    [videoUrl, setVideoUrl] = useState(''),
    [message, setMessage] = useState('');
  const previous = s.logs
    .filter(
      (item) => item.exercise === row.exercise && item.date < row.date && item.sets.some(Boolean),
    )
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const complete = log.sets.every(Boolean),
    estimated = log.lift && log.sets.some(Boolean) ? e1rm(log.weight, log.reps, log.rpe) : null;
  const reduction = immediateAdjustment(
      Math.max(...setRecords.map((record) => record.rpe)),
      row.rpe,
      setRecords.every((record) => record.technique),
    ),
    plate = plates(log.weight, s.bar, s.plateSizes),
    conflict = !compatible(ex, s.profile);
  useEffect(
    () => () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    },
    [videoUrl],
  );
  return (
    <Card className={'workout-line ' + (complete ? 'completed' : '')}>
      <div className="workout-line-heading">
        <span className="exercise-index">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <span className={'mode mode-' + row.mode}>{t(row.mode)}</span>
          <h2>{local(ex.name)}</h2>
          <p className="micro muted">{local(row.tip)}</p>
        </div>
        <button
          className="icon-button"
          aria-label={t('readMore') + ' ' + local(ex.name)}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown size={20} />
        </button>
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
      {focus ? (
        <FocusSets row={row} />
      ) : (
        <div className="workout-controls">
          <div className="weight-stepper">
            <button
              className="icon-button"
              disabled={conflict || log.weight <= 0}
              aria-label={t('weight') + ' −'}
              onClick={() => write({ weight: Math.max(0, log.weight - s.profile.step) })}
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
                max={units === 'metric' ? 800 : 1764}
                step="any"
                value={displayWeight(log.weight, units)}
                onChange={(e) => write({ weight: fromWeight(Number(e.target.value), units) })}
              />
              <small>{weightUnit}</small>
            </label>
            <button
              className="icon-button"
              disabled={conflict}
              aria-label={t('weight') + ' +'}
              onClick={() => write({ weight: log.weight + s.profile.step })}
            >
              <Plus size={19} />
            </button>
          </div>
          <div className="set-checkboxes">
            {log.sets.map((checked, i) => (
              <button
                disabled={conflict}
                className={checked ? 'checked' : ''}
                key={i}
                aria-label={t('sets') + ' ' + (i + 1) + ' ' + local(ex.name)}
                aria-pressed={checked}
                onClick={() =>
                  write({ sets: log.sets.map((n, j) => (i === j ? !n : n)) }, !checked)
                }
              >
                {checked ? <Check size={19} /> : i + 1}
              </button>
            ))}
          </div>
          <button
            className="button secondary complete-button"
            disabled={
              conflict || complete || (row.weight === null && row.lift !== null && log.weight === 0)
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
      {focus && (
        <button
          className="button secondary focus-options-button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {t('focusExerciseOptions')}
        </button>
      )}
      {expanded && (
        <div className="workout-detail">
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
            <ReplacementControl row={row} />
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
          <Field label={t('note')}>
            <textarea
              maxLength={2000}
              value={log.note}
              onChange={(e) => write({ note: e.target.value })}
            />
          </Field>
          {estimated && (
            <p>
              {t('e1rm')}:{' '}
              <b>
                <Weight value={Math.round(estimated * 10) / 10} />
              </b>
            </p>
          )}
          {row.lift && <Warmup lift={row.lift} ceiling={row.weight ?? undefined} />}
          <details>
            <summary>{t('plates')}</summary>
            <p>
              {t('bar')}: <Weight value={s.bar} /> · {t('perSide')}:{' '}
              {plate.result
                .map((x) => `${displayWeight(x.plate, units)} × ${x.count}`)
                .join(' + ') || '—'}
            </p>
            {(plate.remaining > 0 || plate.belowBar) && (
              <p className="warning">{t('unavailable')}</p>
            )}
          </details>
          <Field label={t('video')}>
            <input
              type="file"
              accept="video/*"
              capture="environment"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  await saveVideo(row.id, file);
                  write({ video: row.id });
                  setMessage(t('videoSaved'));
                } catch {
                  setMessage(t('videoError'));
                }
              }}
            />
          </Field>
          <p className="micro muted">{t('videoLocal')}</p>
          {log.video && (
            <button
              className="button secondary"
              onClick={async () => {
                try {
                  const blob = await getVideo(log.video);
                  if (blob) setVideoUrl(URL.createObjectURL(blob));
                  else setMessage(t('videoError'));
                } catch {
                  setMessage(t('videoError'));
                }
              }}
            >
              <Video size={16} />
              {t('viewVideo')}
            </button>
          )}
          {videoUrl && <video src={videoUrl} controls playsInline className="set-video" />}
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
      )}
      {error && <p role="alert">{error}</p>}
      {message && (
        <p role="status" className="micro">
          {message}
        </p>
      )}
    </Card>
  );
}
