import { Disclosure } from '../components/Disclosure';
import { BackupSecurity } from '../components/BackupSecurity';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useProfileStore as useStore, update, replaceWithUndo } from '../lib/store';
import { download, initialState, parseBackup } from '../lib/storage';
import { demoData } from '../lib/demo';
import { useI18n } from '../i18n';
import { Card, PageTitle, Select } from '../components/ui';
import { EquipmentSettings } from '../components/EquipmentSettings';
export default function Settings() {
  const s = useStore(),
    { t } = useI18n(),
    [message, setMessage] = useState('');
  return (
    <>
      <PageTitle title={t('settings')} />
      <div className="two-columns">
        <Card>
          <h2>{t('settings')}</h2>
          <div className="form-grid">
            <Select
              label={t('language')}
              value={s.language}
              options={[
                { value: 'ru', label: 'Русский' },
                { value: 'kk', label: 'Қазақша' },
                { value: 'en', label: 'English' },
              ]}
              onChange={(v) => update({ language: v as 'ru' | 'kk' | 'en' })}
            />
            <Select
              label={t('theme')}
              value={s.themePreference}
              options={['dark', 'light', 'system'].map((value) => ({
                value,
                label: t(value === 'system' ? 'systemTheme' : value),
              }))}
              onChange={(v) => update({ themePreference: v as 'dark' | 'light' | 'system' })}
            />
            <Select
              label={t('units')}
              value={s.units}
              options={['metric', 'imperial'].map((value) => ({ value, label: t(value) }))}
              onChange={(v) => update({ units: v as 'metric' | 'imperial' })}
            />
            <Disclosure label="compactEquipment">
              <EquipmentSettings key={s.units} announce={setMessage} />
            </Disclosure>
          </div>
        </Card>
        <Card>
          <h2>{t('backup')}</h2>
          <p className="muted">{t('localOnly')}</p>
          <div className="backup-buttons">
            <button
              className="button secondary"
              onClick={() => download('ironcycle-backup.json', JSON.stringify(s, null, 2))}
            >
              <Download size={17} />
              {t('export')}
            </button>
            <label className="button secondary file-button">
              <Upload size={17} />
              {t('import')}
              <input
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    if (file.size > 15000000) throw Error('size');
                    const data = parseBackup(await file.text());
                    if (confirm(t('importConfirm'))) {
                      replaceWithUndo(data);
                      setMessage(t('saved'));
                    }
                  } catch {
                    setMessage(t('importError'));
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </div>
          <p className="micro muted">{t('videoLocal')}</p>
          <Disclosure label="compactAdvanced">
            <button
              className="text-button"
              onClick={() => {
                if (confirm(t('demoConfirm'))) replaceWithUndo({ ...s, ...demoData(s) });
              }}
            >
              {t('loadDemo')}
            </button>
            <hr />
            <button
              className="button danger-button"
              onClick={() => {
                if (confirm(t('resetConfirm')))
                  replaceWithUndo({ ...initialState, language: s.language, theme: s.theme });
              }}
            >
              <RotateCcw size={16} />
              {t('reset')}
            </button>
          </Disclosure>
        </Card>
      </div>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      <Disclosure label="backup">
        <BackupSecurity />
      </Disclosure>
      <Card>
        <Link className="button secondary" to="/privacy-consent">
          {t('privacyConsent')}
        </Link>
      </Card>
      <Disclosure label="install">
        <Card>
          <h2>{t('install')}</h2>
          <p>{t('installHint')}</p>
        </Card>
      </Disclosure>
    </>
  );
}
