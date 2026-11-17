import { useEffect, useReducer, useState } from 'react';
import type { Profile } from './schema';
import type { mealPlan } from './nutrition';
type Day = 'heavy' | 'medium' | 'rest';
type Menu = ReturnType<typeof mealPlan>[];
export function useMealPlan(profile: Profile, seed: number, day: Day) {
  const [revision, retry] = useReducer((value: number) => value + 1, 0);
  const [result, setResult] = useState<{
    profile: Profile;
    seed: number;
    day: Day;
    menu: Menu | null;
    revision: number;
    failed?: boolean;
  } | null>(null);
  useEffect(() => {
    let cancelled = false,
      worker: Worker | null = null;
    // Keep calculations unchanged and local, while keeping the main thread responsive.
    void Promise.resolve()
      .then(() => {
        if (cancelled) return;
        worker = new Worker(new URL('./mealPlan.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (event: MessageEvent<{ menu: Menu | null }>) => {
          if (!cancelled) setResult({ profile, seed, day, menu: event.data.menu, revision });
          worker?.terminate();
        };
        worker.onerror = () => {
          if (!cancelled) setResult({ profile, seed, day, menu: null, revision, failed: true });
          worker?.terminate();
        };
        worker.postMessage({ profile, seed, day });
      })
      .catch(() => {
        if (!cancelled) setResult({ profile, seed, day, menu: null, revision, failed: true });
      });
    return () => {
      cancelled = true;
      worker?.terminate();
    };
  }, [profile, seed, day, revision]);
  const current =
    result?.profile === profile &&
    result.seed === seed &&
    result.day === day &&
    result.revision === revision;
  return {
    menu: current ? result.menu : null,
    pending: !current,
    failed: current && result.failed === true,
    retry,
  };
}
