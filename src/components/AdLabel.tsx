import { useI18n } from '../i18n';
export function AdLabel({ sponsor }: { sponsor?: string }) {
  const { t } = useI18n();
  return (
    <span className="ad-label">
      {t('adLabel')}
      {sponsor ? ' · ' + sponsor : ''}
    </span>
  );
}
