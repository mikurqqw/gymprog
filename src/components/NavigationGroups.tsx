import { FeedbackActions } from './FeedbackActions';
import { NavLink } from 'react-router-dom';
import { navigationGroups, legalNavigation } from './navigationItems';
import { useI18n } from '../i18n';
export function NavigationGroups({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useI18n();
  return (
    <>
      {navigationGroups.map((group) => (
        <section className="nav-group" key={group.label}>
          <h2>{t(group.label)}</h2>
          {group.items.map(({ path, label, icon: Icon }) => (
            <NavLink
              className="nav-item"
              key={path + label}
              to={path}
              end={path === '/'}
              onClick={onNavigate}
            >
              <Icon size={19} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </section>
      ))}
      <details className="compact-disclosure">
        <summary>{t('feedbackTitle')}</summary>
        <FeedbackActions />
      </details>
      <details className="compact-disclosure">
        <summary>{t('navLegal')}</summary>
        <section className="nav-group">
          {legalNavigation.map((id) => (
            <NavLink className="nav-item" key={id} to={'/legal/' + id} onClick={onNavigate}>
              {t('legal' + id[0].toUpperCase() + id.slice(1))}
            </NavLink>
          ))}
          <NavLink className="nav-item" to="/privacy-consent" onClick={onNavigate}>
            {t('privacyConsent')}
          </NavLink>
          <NavLink className="nav-item" to="/privacy-consent" onClick={onNavigate}>
            {t('eraseAll')}
          </NavLink>
          <button
            className="nav-item"
            onClick={() => window.dispatchEvent(new Event('ironcycle:storage-dialog'))}
          >
            {t('storageChoices')}
          </button>
        </section>
      </details>
    </>
  );
}
