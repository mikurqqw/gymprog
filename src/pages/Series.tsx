import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import { loadVariants, matchesVariant, seriesId, type SeriesId } from '../lib/fitSeries';
import { useProfileStore } from '../lib/store';
import { Card, PageTitle, Select } from '../components/ui';
import { SeriesVariantPicker } from '../components/SeriesVariantPicker';
import { SeriesTraining } from '../components/SeriesTraining';
import { useSeriesData } from '../components/useSeriesData';

function SeriesPage({ id }: { id: SeriesId }) {
  const { t, language } = useI18n(),
    s = seriesStrings;
  const state = useProfileStore();
  const history = state.seriesRuns.filter((run) => run.program === id);
  const run = history.at(-1);
  const [selected, setSelected] = useState('');
  const [mode, setMode] = useState<'gym' | 'home'>('gym');
  const load = useCallback((signal: AbortSignal) => loadVariants(id, signal), [id]);
  const { result, retry } = useSeriesData(load);
  const variants =
    result && 'data' in result
      ? result.data.filter((variant) =>
          matchesVariant(variant, state.profile.age, state.profile.sex),
        )
      : [];
  const variant = variants.find((item) => item.id === (run?.profile ?? selected));
  const selectedMode = run?.mode ?? (variant?.modes.includes(mode) ? mode : variant?.modes[0]);
  const selection =
    variant && selectedMode
      ? { profile: variant.id, mode: selectedMode, cycle: run?.cycle ?? 1 }
      : null;
  return (
    <>
      <PageTitle title={s[id][language]} />
      <div className="inline">
        <Link className="text-link" to="/profile?training=1">
          {t('chooseTrainingPlan')} →
        </Link>
        <Link className="text-link" to="/catalog">
          {t('sfBackCatalog')} →
        </Link>
      </div>
      <Card>
        {!result && <p role="status">{t('loading')}</p>}
        {result && 'failed' in result && (
          <>
            <p role="alert">{s.error[language]}</p>
            <button className="button secondary" onClick={retry}>
              {s.retry[language]}
            </button>
          </>
        )}
        {result && 'data' in result && (!variants.length || (run && !variant)) && (
          <p>{s.unavailable[language]}</p>
        )}
        {!run && variants.length > 0 && (
          <>
            <p>{s.choose[language]}</p>
            <SeriesVariantPicker value={selected} variants={variants} onChange={setSelected} />
            {variant && selectedMode && (
              <Select
                label={t('equipment')}
                value={selectedMode}
                options={variant.modes.map((value) => ({ value, label: t(value) }))}
                onChange={(value) => setMode(value === 'home' ? 'home' : 'gym')}
              />
            )}
          </>
        )}
        {history.length > 0 && (
          <details>
            <summary>
              {s.history[language]} · {history.length}
            </summary>
            <ul>
              {history.toReversed().map((entry) => (
                <li key={entry.id}>
                  {s.cycle[language]} {['I', 'II', 'III'][entry.cycle - 1]} ·{' '}
                  {entry.started.slice(0, 10)} · {s.completed[language]}{' '}
                  {Object.keys(entry.days).length}
                </li>
              ))}
            </ul>
          </details>
        )}
      </Card>
      {selection && (
        <SeriesTraining
          key={run?.id ?? variant?.id + '-' + selectedMode}
          selection={selection}
          run={run}
          program={id}
        />
      )}
    </>
  );
}
export default function Series() {
  const { id } = useParams(),
    { t } = useI18n();
  const result = seriesId.safeParse(id);
  return result.success ? (
    <SeriesPage key={result.data} id={result.data} />
  ) : (
    <PageTitle title={t('notFound')} />
  );
}
