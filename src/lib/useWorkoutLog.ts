import { useState } from 'react';
import { update, useProfileStore, startRest } from './store';
import { readRowLog, setLogs, writeRowLogs } from './workoutLogs';
import type { Log, Planned } from './schema';
import { useI18n } from '../i18n';
export function useWorkoutLog(row: Planned) {
  const state = useProfileStore(),
    { t } = useI18n(),
    [error, setError] = useState('');
  const write = (patch: Partial<Log>, timer = false, index?: number) => {
    try {
      // Functional writes also protect rapid stepper presses against stale render state.
      update((previous) => ({
        logs: writeRowLogs(previous.logs, row, patch, index),
        activeSession: { week: row.week, day: row.day, touchedAt: new Date().toISOString() },
      }));
      setError('');
      if (timer) {
        startRest(row.rest);
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate?.(30);
      }
      return true;
    } catch {
      setError(t('invalid'));
      return false;
    }
  };
  return { log: readRowLog(row, state.logs), sets: setLogs(row, state.logs), write, error };
}
