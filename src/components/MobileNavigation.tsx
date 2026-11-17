import { update } from '../lib/store';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { primaryNavigation } from './navigationItems';
import { NavigationGroups } from './NavigationGroups';
import { useI18n } from '../i18n';
export function MobileNavigation() {
  const { t } = useI18n(),
    dialog = useRef<HTMLDialogElement>(null),
    close = () => dialog.current?.close();
  return (
    <>
      <nav className="mobile-tabs" aria-label={t('navMain')}>
        {primaryNavigation.map(({ path, label, icon: Icon }) => (
          <NavLink
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
        ))}
        <button
          aria-label={t('navMore')}
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <Menu size={20} />
          <span>{t('navMore')}</span>
        </button>
      </nav>
      <dialog className="full-screen-sheet more-sheet" ref={dialog} aria-labelledby="more-title">
        <header>
          <h2 id="more-title">{t('navMore')}</h2>
          <button className="icon-button" aria-label={t('close')} onClick={close}>
            <X size={23} />
          </button>
        </header>
        <nav aria-label={t('menu')}>
          <NavigationGroups onNavigate={close} />
        </nav>
      </dialog>
    </>
  );
}
