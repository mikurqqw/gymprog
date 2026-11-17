import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { StorefrontPreview } from '../components/StorefrontPreview';
export default function Landing() {
  const { t } = useI18n();
  return (
    <>
      <section className="sf-hero sf-container compact-hero">
        <div className="sf-hero-copy">
          <p className="sf-kicker">IronCycle · 18+</p>
          <h1>{t('sfTitle')}</h1>
          <p className="sf-lead">{t('compactHomeLead')}</p>
          <div className="sf-actions">
            <Link className="button" to="/start">
              {t('landingStart')}
              <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/demo">
              {t('sfDemo')}
            </Link>
          </div>
          <ul className="sf-trust">
            <li>{t('sfEightWeeks')}</li>
            <li>{t('sfOffline')}</li>
            <li>RU · ҚАЗ · EN</li>
          </ul>
        </div>
        <StorefrontPreview />
      </section>
      <section className="compact-entry-links sf-container">
        <Link to="/catalog">
          <strong>{t('sfPrograms')}</strong>
          <span>{t('setupGoal')} →</span>
        </Link>
        <Link to="/about">
          <strong>{t('compactAbout')}</strong>
          <span>{t('compactHelp')} →</span>
        </Link>
      </section>
      <p className="landing-safety sf-container">{t('landingSafety')}</p>
    </>
  );
}
