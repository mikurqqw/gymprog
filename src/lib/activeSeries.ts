import type { AppState } from './storage';

export function activeSeriesRun({ activeSeries, seriesRuns }: AppState) {
  if (activeSeries === null) return undefined;
  return activeSeries === undefined
    ? seriesRuns.at(-1)
    : seriesRuns.findLast((run) => run.program === activeSeries);
}
