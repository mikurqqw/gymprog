import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
export function UnassessedStrength() {
  const { t } = useI18n();
  return (
    <section className="notice">
      <p>{t('setupUnknownNotice')}</p>
      <Link className="button secondary" to="/profile">
        {t('strengthSummary')}
      </Link>
    </section>
  );
}
