import { useEffect, useState } from 'react';

export function useSeriesData<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<{ data: T } | { failed: true } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ data });
      },
      () => {
        if (!controller.signal.aborted) setResult({ failed: true });
      },
    );
    return () => controller.abort();
  }, [load, attempt]);
  return {
    result,
    retry: () => {
      setResult(null);
      setAttempt((n) => n + 1);
    },
  };
}
