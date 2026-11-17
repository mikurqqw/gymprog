import { useI18n } from '../i18n';
export function PreviewBanner() {
  const { t } = useI18n();
  return __LEGAL_PREVIEW__ ? (
    <aside className="preview-banner" aria-label={t('previewBanner')}>
      {t('previewBanner')}
    </aside>
  ) : null;
}
