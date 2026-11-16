import { useEffect, useRef, useState } from 'react';
import { dataAllowed, PREFERENCES_KEY, readPreferences } from '../lib/consent';
import { useI18n } from '../i18n';
export function StoragePreferences() {
  const { t } = useI18n(),
    ref = useRef<HTMLDialogElement>(null),
    [media, setMedia] = useState(false);
  useEffect(() => {
    const show = () => {
      if (!dataAllowed()) {
        location.hash = '/legal/storage';
        return;
      }
      setMedia(readPreferences()?.optionalMedia ?? false);
      ref.current?.showModal();
    };
    window.addEventListener('ironcycle:storage-dialog', show);
    return () => window.removeEventListener('ironcycle:storage-dialog', show);
  }, []);
  const save = (allowed: boolean) => {
    const previous = readPreferences();
    if (previous)
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({
          ...previous,
          optionalMedia: allowed,
          selectedAt: new Date().toISOString(),
        }),
      );
    window.dispatchEvent(new Event('ironcycle:media-preference'));
    ref.current?.close();
  };
  return (
    <dialog className="settings-dialog" ref={ref} aria-labelledby="storage-dialog-title">
      <h2 id="storage-dialog-title">{t('storageChoices')}</h2>
      <p>{t('storageExplanation')}</p>
      <label className="checkbox-label">
        <input type="checkbox" checked disabled />
        {t('necessaryStorage')}
      </label>
      <label className="checkbox-label">
        <input type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} />
        {t('optionalMedia')}
      </label>
      <div className="storage-actions">
        <button className="button secondary" onClick={() => save(true)}>
          {t('acceptStorage')}
        </button>
        <button className="button secondary" onClick={() => save(false)}>
          {t('rejectOptional')}
        </button>
        <button className="button secondary" onClick={() => save(media)}>
          {t('save')}
        </button>
      </div>
      <button className="text-button" onClick={() => ref.current?.close()}>
        {t('close')}
      </button>
    </dialog>
  );
}
