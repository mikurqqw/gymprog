import { FeedbackActions } from './FeedbackActions';
import { NavLink } from 'react-router-dom';
import { navigationGroups, legalNavigation } from './navigationItems';
import { useI18n } from '../i18n';
import { useStore, update } from '../lib/store';
export function NavigationGroups({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useI18n(),
    state = useStore();
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
      <section className="nav-group">
        <h2>{t('navAppearance')}</h2>
        <label className="field">
          <span>{t('language')}</span>
          <select
            aria-label={t('navAppearance') + ': ' + t('language')}
            value={state.language}
            onChange={(event) => update({ language: event.target.value as typeof state.language })}
          >
            <option value="ru">Русский</option>
            <option value="kk">Қазақша</option>
            <option value="en">English</option>
          </select>
        </label>
        <button
          className="nav-item"
          onClick={() => update({ theme: state.theme === 'dark' ? 'light' : 'dark' })}
        >
          {t('theme')}: {t(state.theme)}
        </button>
      </section>
      <FeedbackActions />
      <section className="nav-group">
        <h2>{t('navLegal')}</h2>
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
    </>
  );
}
