import { update } from '../lib/store';
import { NavLink } from 'react-router-dom';
import { UserRound, Settings, LayoutDashboard } from 'lucide-react';
import { primaryNavigation, navigationGroups } from './navigationItems';
import { useI18n } from '../i18n';
export function SidebarNavigation() {
  const { t } = useI18n();
  return (
    <aside className="navigation-sidebar compact-sidebar">
      <NavLink to="/" className="brand">
        IronCycle
      </NavLink>
      <nav aria-label={t('trainingCycle')}>
        <div className="nav-primary">
          {[{ path: '/', label: 'overview', icon: LayoutDashboard }, ...primaryNavigation].map(
            ({ path, label, icon: Icon }) => (
              <NavLink
                className="nav-item"
                end={path === '/'}
                key={path}
                to={path}
                onClick={() => {
                  if (path === '/workout')
                    update((state) => ({ workoutView: state.workoutView ?? 'focus' }));
                }}
              >
                <Icon size={20} />
                <span>{t(label)}</span>
              </NavLink>
            ),
          )}
        </div>
        <details className="sidebar-tools">
          <summary>{t('compactTools')}</summary>
          {navigationGroups
            .filter((group) => group.label !== 'navSettings')
            .map((group) => (
              <section className="nav-group" key={group.label}>
                <h2>{t(group.label)}</h2>
                {group.items
                  .filter((item) => !['/', '/settings'].includes(item.path))
                  .map(({ path, label, icon: Icon }) => (
                    <NavLink className="nav-item" key={path} to={path}>
                      <Icon size={18} />
                      {t(label)}
                    </NavLink>
                  ))}
              </section>
            ))}
        </details>
        <div className="sidebar-account">
          <NavLink className="nav-item" to="/profile">
            <UserRound size={19} />
            {t('profile')}
          </NavLink>
          <NavLink className="nav-item" to="/settings">
            <Settings size={19} />
            {t('settings')}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
