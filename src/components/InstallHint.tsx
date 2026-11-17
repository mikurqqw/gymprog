import { getInstallSnapshot, subscribeInstall, clearInstallPrompt } from '../lib/install';
import { useState, useSyncExternalStore } from 'react';
import { Download, X } from 'lucide-react';
import { update, useStore } from '../lib/store';
import { useI18n } from '../i18n';
export function InstallHint() {
  const state = useStore(),
    { t } = useI18n(),
    { prompt, installed } = useSyncExternalStore(subscribeInstall, getInstallSnapshot),
    [error, setError] = useState('');
  const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    standalone =
      matchMedia('(display-mode: standalone)').matches ||
      Reflect.get(navigator, 'standalone') === true;
  if (
    installed ||
    standalone ||
    state.installHintDismissed ||
    !Object.keys(state.sessionCompletions).length ||
    (!ios && !prompt && !error)
  )
    return null;
  return (
    <aside className="install-hint" aria-label={t('installTitle')}>
      <Download size={24} />
      <div>
        <h2>{t('installTitle')}</h2>
        <p>{t(ios ? 'installIos' : 'installIntro')}</p>
        {prompt && (
          <button
            className="button secondary"
            onClick={async () => {
              try {
                await prompt.prompt();
                await prompt.userChoice;
                clearInstallPrompt();
                update({ installHintDismissed: true });
              } catch {
                clearInstallPrompt();
                setError(t('installUnavailable'));
              }
            }}
          >
            {t('installAction')}
          </button>
        )}
        {error && <p role="status">{error}</p>}
      </div>
      <button
        className="icon-button"
        aria-label={t('close')}
        onClick={() => update({ installHintDismissed: true })}
      >
        <X size={20} />
      </button>
    </aside>
  );
}
