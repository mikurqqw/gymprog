import { useDiaryI18n } from '../i18n/useDiaryI18n';
export function CuttingGuide() {
  const { t } = useDiaryI18n();
  return (
    <details className="compact-disclosure cutting-guide">
      <summary>{t('cuttingGuide')}</summary>
      <div className="disclosure-body">
        <p>{t('cuttingBasics')}</p>
        <p>{t('cuttingLimits')}</p>
        <a
          className="text-link"
          href="https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/tips-to-help-you-lose-weight/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('foodSourceGuide')} ↗
        </a>
      </div>
    </details>
  );
}
