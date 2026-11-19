import { useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import { seriesProgress, type SeriesPlan, type SeriesRun } from '../lib/fitSeries';
import { SeriesDay } from './SeriesDay';
import { Card, Select } from './ui';
import { dateOffset, formatDate } from '../lib/formulas';

export function SeriesSchedule({
  plan,
  run,
  save,
  action,
  blocked,
}: {
  plan: SeriesPlan;
  run?: SeriesRun;
  save: (index: number, remove: boolean) => void;
  action: ReactNode;
  blocked: boolean;
}) {
  const { t, language, locale } = useI18n(),
    s = seriesStrings;
  const progress = seriesProgress(plan, run);
  const [selection, setSelection] = useState<number>();
  const index = selection ?? progress.next ?? 0;
  const block = Math.floor(index / plan.days);
  const days = plan.calendar.slice(block * plan.days, (block + 1) * plan.days);
  const current = plan.calendar[index];
  return (
    <>
      <Card>
        <h2>
          {s.cycle[language]} {['I', 'II', 'III'][plan.cycle - 1]}
        </h2>
        <p>{plan.title}</p>
        <p>
          {s.block[language]} {block + 1}/{plan.blocks} · {s.days[language]} {plan.days}
        </p>
        <p role="status">
          {s.completed[language]} {progress.done}/{progress.total}
        </p>
        <div className="form-grid">
          <Select
            label={s.block[language]}
            value={String(block)}
            options={Array.from({ length: plan.blocks }, (_, i) => ({
              value: String(i),
              label: String(i + 1),
            }))}
            onChange={(value) => setSelection(Number(value) * plan.days)}
          />
          <Select
            label={t('day')}
            value={String(index)}
            options={days.map((day, i) => {
              const value = block * plan.days + i;
              return {
                value: String(value),
                label: `${i + 1} · ${day.work ? day.name || day.kind : s.recoveryDay[language]}${run?.days[value] ? ' ✓' : ''}`,
              };
            })}
            onChange={(value) => setSelection(Number(value))}
          />
        </div>
        {action}
      </Card>
      <SeriesDay day={current} index={index % plan.days} />
      {run && current.work && !blocked && (
        <Card>
          <p className="micro muted">
            {formatDate(dateOffset(run.started.slice(0, 10), index), locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <button
            className="button"
            type="button"
            onClick={() => {
              save(index, Boolean(run.days[index]));
              if (!run.days[index]) setSelection(undefined);
            }}
          >
            {s[run.days[index] ? 'unmark' : 'mark'][language]}
          </button>
        </Card>
      )}
    </>
  );
}
