import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
export function WorkoutTools() {
  const { t } = useI18n(),
    [enabled, setEnabled] = useState(false),
    [message, setMessage] = useState(''),
    lock = useRef<WakeLockSentinel | null>(null);
  useEffect(() => {
    let disposed = false;
    const request = async () => {
      if (!enabled || document.visibilityState !== 'visible') return;
      try {
        if (!('wakeLock' in navigator)) throw Error('Unavailable');
        const active = await navigator.wakeLock.request('screen');
        if (disposed) await active.release();
        else lock.current = active;
      } catch {
        if (!disposed) setMessage(t('wakeUnavailable'));
      }
    };
    void request();
    document.addEventListener('visibilitychange', request);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', request);
      void lock.current?.release();
      lock.current = null;
    };
  }, [enabled, t]);
  return (
    <div className="workout-tools">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setMessage('');
            setEnabled(e.target.checked);
          }}
        />
        {t('keepAwake')}
      </label>
      <button className="button secondary" onClick={() => window.print()}>
        {t('printWorkout')}
      </button>
      {message && <p role="status">{message}</p>}
      <details>
        <summary>{t('medicalContext')}</summary>
        <p>{t('emergencyHelp')}</p>
      </details>
    </div>
  );
}
