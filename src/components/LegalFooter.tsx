import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useStore, update } from '../lib/store';
export function LegalFooter() {
  const { t } = useI18n(),
    state = useStore();
  return (
    <footer className="legal-footer compact-legal-footer">
      <b>IronCycle · 18+</b>
      <Link to="/about">{t('compactAbout')}</Link>
      <nav aria-label={t('legalTerms')}>
        {['terms', 'privacy', 'storage'].map((id) => (
          <Link key={id} to={'/legal/' + id}>
            {t('legal' + id[0].toUpperCase() + id.slice(1))}
          </Link>
        ))}
        <details>
          <summary>{t('moreLegal')}</summary>
          <div className="more-legal-links">
            {[
              'medical',
              'ai',
              'advertising',
              'operator',
              'sources',
              'accessibility',
              'contact',
            ].map((id) => (
              <Link key={id} to={'/legal/' + id}>
                {t('legal' + id[0].toUpperCase() + id.slice(1))}
              </Link>
            ))}
            <Link to="/privacy-consent">{t('privacyConsent')}</Link>
          </div>
        </details>
      </nav>
      <select
        aria-label={t('footerLanguage')}
        value={state.language}
        onChange={(event) => update({ language: event.target.value as typeof state.language })}
      >
        <option value="ru">Русский</option>
        <option value="kk">Қазақша</option>
        <option value="en">English</option>
      </select>
    </footer>
  );
}
