import { useState } from 'react';
import { useStore } from '../lib/store';
import { readConsent, revokeConsent } from '../lib/consent';
import { closeDatabase } from '../lib/database';
import { deleteAllAppData } from '../lib/dataManagement';
import { fullBackup } from '../lib/fullBackup';
import { download } from '../lib/storage';
import { useI18n } from '../i18n';
import { Card, PageTitle } from '../components/ui';
export default function PrivacyConsent() {
  const state = useStore(),
    { t } = useI18n(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    consent = readConsent();
  const action = async (task: () => Promise<void>) => {
    setBusy(true);
    try {
      await task();
    } catch {
      setError(t('storageError'));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageTitle title={t('privacyConsent')} />
      <Card>
        <h2>{t('storageInventory')}</h2>
        <p className="reading">{t('storageInventoryText')}</p>
        <p>{consent?.acceptedAt}</p>
        <dl>
          {Object.entries(consent?.versions ?? {}).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p>{t('exportPrivate')}</p>
        <button
          className="button secondary"
          disabled={busy}
          onClick={() =>
            void action(async () =>
              download('ironcycle-full-backup.json', JSON.stringify(await fullBackup(state))),
            )
          }
        >
          {t('exportAll')}
        </button>
      </Card>
      <Card>
        <h2>{t('withdrawHealth')}</h2>
        <p>{t('withdrawalInfo')}</p>
        <button
          className="button secondary"
          disabled={busy}
          onClick={() => {
            closeDatabase();
            revokeConsent();
          }}
        >
          {t('withdrawHealth')}
        </button>
        <hr />
        <button
          className="button danger-button"
          disabled={busy}
          onClick={() => {
            if (confirm(t('eraseWarning'))) void action(deleteAllAppData);
          }}
        >
          {t('eraseAll')}
        </button>
        {error && <p role="alert">{error}</p>}
      </Card>
    </>
  );
}
