import { NavLink } from 'react-router-dom';
import { primaryNavigation } from './navigationItems';
import { NavigationGroups } from './NavigationGroups';
import { useI18n } from '../i18n';
export function SidebarNavigation() {
  const { t } = useI18n();
  return (
    <aside className="navigation-sidebar">
      <NavLink to="/" className="brand">
        IronCycle
      </NavLink>
      <nav aria-label={t('trainingCycle')}>
        <div className="nav-primary">
          {primaryNavigation.map(({ path, label, icon: Icon }) => (
            <NavLink className="nav-item" to={path} key={path}>
              <Icon size={20} />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </div>
        <NavigationGroups onNavigate={() => undefined} />
      </nav>
    </aside>
  );
}
