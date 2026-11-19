import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import type { SeriesPlan } from '../lib/fitSeries';
import { Card } from './ui';

const range = (low?: string, high?: string) =>
  low && high && Number(low) !== Number(high) ? low + '–' + high : low || high || '';
const reference = (value?: string) => value?.split('/').at(-1);
export function SeriesDay({ day, index }: { day: SeriesPlan['calendar'][number]; index: number }) {
  const { language, t } = useI18n();
  const s = seriesStrings,
    session = day.session;
  const warmup = range(session?.warmup_min, session?.warmup_max);
  return (
    <Card className="series-day">
      <h2>
        {t('day')} {index + 1} · {day.work ? day.name || day.kind : s.recoveryDay[language]}
      </h2>
      <p className="micro muted">{day.phase}</p>
      {day.work && (
        <>
          {warmup && Number(warmup) !== 0 && (
            <p>
              {s.warmup[language]} {warmup}
            </p>
          )}
          <ol className="series-exercises">
            {day.work.map((work, i) => {
              const timed = work.quantity_unit === 'second';
              const amount = timed
                ? range(work.work_seconds_min, work.work_seconds_max)
                : range(work.reps_min, work.reps_max);
              const rest = range(work.rest_seconds_min, work.rest_seconds_max);
              const effort = range(work.effort_min, work.effort_max);
              return (
                <li key={i}>
                  <strong>{work.exercise_original}</strong>
                  <p>
                    {[
                      work.sets && work.sets + ' ×',
                      amount,
                      amount && t(timed ? 'sec' : 'reps'),
                      work.quantity_scope === 'per_side' && s.perSide[language],
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  </p>
                  <p className="muted">
                    {[
                      rest && t('rest') + ' ' + rest + ' ' + t('sec'),
                      effort && work.effort_scale + ' ' + effort,
                      work.load_fraction_1rm &&
                        (Number(work.load_fraction_1rm) * 100).toFixed(1) + '% 1RM',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <details>
                    <summary>{s.original[language]}</summary>
                    <p>{work.equipment}</p>
                    {work.sides && Number(work.sides) > 1 && (
                      <p>
                        {s.sides[language]} {work.sides}
                      </p>
                    )}
                    {work.load_unit && (
                      <p>
                        {t('weight')} {work.load_unit}
                      </p>
                    )}
                    {work.reference_lift && <p>1RM · {work.reference_lift}</p>}
                    {(work.short_sets || work.short_quantity_min || work.short_seconds_min) && (
                      <p>
                        {s.shortDose[language]} ·{' '}
                        {[
                          work.short_sets && work.short_sets + ' ×',
                          range(work.short_quantity_min, work.short_quantity_max) ||
                            range(work.short_seconds_min, work.short_seconds_max),
                          work.short_quantity_min
                            ? t(timed ? 'sec' : 'reps')
                            : work.short_seconds_min && t('sec'),
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    )}
                    {work.variation_note && <p>{work.variation_note}</p>}
                    <p className="micro muted">{reference(work.source_ref)}</p>
                  </details>
                </li>
              );
            })}
          </ol>
          <p className="micro muted">
            {s.source[language]} · {reference(session?.source_ref)}
          </p>
        </>
      )}
    </Card>
  );
}
