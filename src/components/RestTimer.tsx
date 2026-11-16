import { useEffect, useState } from 'react';
import { Timer, X } from 'lucide-react';
import { update, useStore } from '../lib/store';
import { useI18n } from '../i18n';
export function RestTimer() {
  const { timer } = useStore(),
    { t } = useI18n();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [timer]);
  if (!timer) return null;
  const seconds = Math.max(0, Math.ceil((timer - now) / 1000));
  return (
    <div className="rest-timer" role="status">
      <Timer size={22} />
      <div>
        <small>{seconds ? t('timer') : t('timerDone')}</small>
        <strong>
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
        </strong>
      </div>
      <button
        className="icon-button"
        aria-label={t('stopTimer')}
        onClick={() => update({ timer: null })}
      >
        <X size={20} />
      </button>
    </div>
  );
}
