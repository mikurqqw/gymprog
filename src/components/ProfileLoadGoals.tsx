import { useCallback } from 'react';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import { activeSeriesRun } from '../lib/activeSeries';
import { loadSeries, type SeriesRun } from '../lib/fitSeries';
import { baseGoalSchedule, importedGoalSchedule } from '../lib/loadGoalForecast';
import { useProfileStore } from '../lib/store';
import { LoadGoalsCard } from './LoadGoalsCard';
import { useSeriesData } from './useSeriesData';

function SeriesGoals({ run }: { run: SeriesRun }) {
  const { profile } = useProfileStore();
  const { language, t } = useI18n();
  const { profile: variant, mode, cycle } = run;
  const load = useCallback(
    (signal: AbortSignal) => loadSeries({ profile: variant, mode, cycle }, signal),
    [variant, mode, cycle],
  );
  const { result, retry } = useSeriesData(load);
  if (!result) return <LoadGoalsCard notice={<p role="status">{t('loading')}</p>} />;
  if ('failed' in result || result.data.program !== run.program)
    return (
      <LoadGoalsCard
        notice={
          <div>
            <p role="alert">{seriesStrings.error[language]}</p>
            <button type="button" className="button secondary" onClick={retry}>
              {seriesStrings.retry[language]}
            </button>
          </div>
        }
      />
    );
  return <LoadGoalsCard schedule={importedGoalSchedule(result.data, run, profile)} />;
}

export function ProfileLoadGoals() {
  const state = useProfileStore();
  const run = activeSeriesRun(state);
  return run ? (
    <SeriesGoals key={run.id} run={run} />
  ) : (
    <LoadGoalsCard schedule={baseGoalSchedule(state)} />
  );
}
