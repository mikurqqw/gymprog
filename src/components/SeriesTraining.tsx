import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import {
  loadSeries,
  nextSeries,
  seriesProgress,
  type SeriesKey,
  type SeriesRun,
  type SeriesId,
} from '../lib/fitSeries';
import { hasStorageError, update, useProfileStore } from '../lib/store';
import { stopSymptoms } from '../lib/injuries';
import { requiresClearance } from '../lib/health';
import { Card } from './ui';
import { SeriesSchedule } from './SeriesSchedule';
import { useSeriesData } from './useSeriesData';

export function SeriesTraining({
  selection,
  program,
  run,
}: {
  selection: SeriesKey;
  program: SeriesId;
  run?: SeriesRun;
}) {
  const { language, t } = useI18n(),
    s = seriesStrings;
  const state = useProfileStore(),
    { profile, mode, cycle } = selection;
  const load = useCallback(
    (signal: AbortSignal) => loadSeries({ profile, mode, cycle }, signal),
    [profile, mode, cycle],
  );
  const { result, retry } = useSeriesData(load);
  const [confirmed, confirm] = useState(false),
    [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const transfer =
    run &&
    state.seriesRuns.find((entry) => entry.previous === run.id && entry.program !== program)
      ?.program;
  const latestCheckin = state.checkins.at(-1);
  const blocked =
    requiresClearance(state.profile.health) ||
    state.profile.injuryRecords.some((injury) => !injury.cleared) ||
    (latestCheckin && stopSymptoms(latestCheckin)) ||
    false;
  if (!result) return <p role="status">{t('loading')}</p>;
  if ('failed' in result || result.data.program !== program)
    return (
      <Card>
        <p role="alert">{s.error[language]}</p>
        <button className="button secondary" onClick={retry}>
          {s.retry[language]}
        </button>
      </Card>
    );
  const plan = result.data;
  const complete = seriesProgress(plan, run).complete;
  const canStart = (!run || complete) && !blocked && !transfer;
  const target = run ? nextSeries(plan) : selection;
  const isTransfer = run && plan.following && plan.following.profile !== plan.profile;
  const label = !run ? 'start' : isTransfer ? 'transfer' : plan.following ? 'next' : 'repeat';
  const start = async () => {
    if (!canStart || !confirmed || saving) return;
    setSaving(true);
    setFailed(false);
    try {
      const next = run ? await loadSeries(target, AbortSignal.timeout(10000)) : plan;
      if (run && plan.following && next.plan !== plan.following.plan)
        throw Error('Transition plan mismatch');
      const entry: SeriesRun = {
        ...target,
        previous: run?.id,
        program: next.program,
        id: crypto.randomUUID(),
        started: new Date().toISOString(),
        days: {},
      };
      update((old) => {
        const previous = old.seriesRuns.findLast((item) => item.program === program);
        if (
          old.seriesRuns.length >= 1000 ||
          previous?.id !== run?.id ||
          (run && old.seriesRuns.some((item) => item.previous === run.id)) ||
          (run && !seriesProgress(plan, previous).complete)
        )
          return {};
        return { seriesRuns: [...old.seriesRuns, entry] };
      });
      if (hasStorageError()) setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <p className="notice warning">{t('emergencyHelp')}</p>
      <p className="micro muted">{s.sourceOnly[language]}</p>
      {blocked && <p className="notice warning">{s.blocked[language]}</p>}
      {failed && <p role="alert">{t('storageError')}</p>}
      {transfer && (
        <Link className="button" to={'/series/' + transfer}>
          {s.transfer[language]}
        </Link>
      )}
      <SeriesSchedule
        plan={plan}
        run={run}
        blocked={blocked || Boolean(transfer)}
        save={(index, remove) => {
          if (!run || !plan.calendar[index]?.work || blocked) return;
          update((old) => ({
            seriesRuns: old.seriesRuns.map((item) => {
              if (item.id !== run.id) return item;
              const days = { ...item.days };
              if (remove) delete days[index];
              else days[index] = new Date().toISOString();
              return { ...item, days };
            }),
          }));
          setFailed(hasStorageError());
        }}
        action={
          canStart && (
            <>
              {!run && <p>{s.preview[language]}</p>}
              {run && plan.following && <p>{plan.following.condition}</p>}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => confirm(event.target.checked)}
                />
                {s.confirm[language]}
              </label>
              <button
                className="button"
                disabled={!confirmed || saving || state.seriesRuns.length >= 1000}
                onClick={() => void start()}
              >
                {saving ? t('loading') : s[label][language]}
              </button>
            </>
          )
        }
      />
    </>
  );
}
