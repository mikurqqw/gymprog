import { dataAllowed } from '../lib/consent';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { legalConfig } from '../config/legal.config';
const legalIds = [
  'terms',
  'privacy',
  'storage',
  'ai',
  'medical',
  'advertising',
  'operator',
  'sources',
  'accessibility',
  'contact',
] as const;
export function LegalFooter() {
  const { t } = useI18n();
  return (
    <footer className="legal-footer">
      <div>
        <b>IronCycle · 18+</b>
        <p>
          {legalConfig.operator.name.includes('__REQUIRED')
            ? t('pendingOperator')
            : legalConfig.operator.name}
        </p>
        <small>{t('localOnly')}</small>
      </div>
      <nav aria-label={t('legalTerms')}>
        {legalIds.map((id) => (
          <Link key={id} to={'/legal/' + id}>
            {t('legal' + id[0].toUpperCase() + id.slice(1))}
          </Link>
        ))}
        <Link to="/privacy-consent">{t('privacyConsent')}</Link>
        <button
          className="text-button"
          onClick={() => {
            if (dataAllowed()) window.dispatchEvent(new Event('ironcycle:storage-dialog'));
            else location.hash = '/legal/storage';
          }}
        >
          {t('storageChoices')}
        </button>
      </nav>
    </footer>
  );
}
