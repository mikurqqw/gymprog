import type { ProgramDocument } from '../lib/programDocument';
import { exerciseById } from '../lib/program';
import { useI18n } from '../i18n';
import { Field, Num } from './ui';
type Row = ProgramDocument['rows'][number];
export function ProgramRowEditor({
  row,
  onChange,
  onMove,
  onDelete,
  onGrab,
  onDrop,
}: {
  row: Row;
  onChange: (patch: Partial<Row>) => void;
  onMove: (direction: number) => void;
  onDelete: () => void;
  onGrab: () => void;
  onDrop: () => void;
}) {
  const { t, local } = useI18n();
  return (
    <div
      className="editor-row"
      draggable
      onDragStart={onGrab}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
    >
      <h3>{local(exerciseById(row.exercise).name)}</h3>
      <div className="inline">
        <button type="button" className="button secondary" onClick={() => onMove(-1)}>
          {t('moveUp')}
        </button>
        <button type="button" className="button secondary" onClick={() => onMove(1)}>
          {t('moveDown')}
        </button>
        <button type="button" className="text-button" onClick={onDelete}>
          {t('delete')}
        </button>
      </div>
      <div className="form-grid">
        <Num
          label={t('sets')}
          value={row.sets}
          min={1}
          max={12}
          onChange={(sets) => onChange({ sets })}
        />
        <Num
          label={t('reps')}
          value={row.reps}
          min={1}
          max={3600}
          onChange={(reps) => onChange({ reps })}
        />
        <Num
          label="RPE"
          value={row.rpe}
          min={1}
          max={9}
          step={0.5}
          onChange={(rpe) => onChange({ rpe })}
        />
        <Num
          label={t('rest') + ' · ' + t('min')}
          value={row.rest}
          min={0}
          max={15}
          step={0.25}
          onChange={(rest) => onChange({ rest })}
        />
        {row.lift && (
          <Num
            label="% 1RM"
            value={(row.percent ?? 0.5) * 100}
            min={10}
            max={100}
            onChange={(percent) => onChange({ percent: percent / 100 })}
          />
        )}
        <Field label={t('tempo')}>
          <input
            maxLength={30}
            value={row.tempo}
            onChange={(event) => onChange({ tempo: event.target.value })}
          />
        </Field>
        <Field label={t('superset')}>
          <input
            maxLength={30}
            value={row.superset}
            onChange={(event) => onChange({ superset: event.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}
