import { InstallHint } from './InstallHint';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useStore, update, hasStorageError, hasUndo, undo } from '../lib/store';
import { useI18n } from '../i18n';
import { SidebarNavigation } from './SidebarNavigation';
import { MobileNavigation } from './MobileNavigation';
import { SearchOverlay } from './SearchOverlay';
import { OfflineStatus } from './OfflineStatus';
import { LegalFooter } from './LegalFooter';
import { RestTimer } from './RestTimer';
import { usePreviewInset } from '../lib/usePreviewInset';
export function Layout() {
  const state = useStore(),
    { t } = useI18n(),
    location = useLocation();
  usePreviewInset();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div className="app-shell navigation-shell">
      <SidebarNavigation />
      <div className="main-shell">
        <header className="app-header">
          <Link className="app-header-brand" to="/">
            IronCycle
          </Link>
          <div className="top-actions">
            <span
              className="autosave"
              aria-label={t(hasStorageError() ? 'storageError' : 'autoSaved')}
            >
              <span className="live-dot" />
              {t(hasStorageError() ? 'storageError' : 'autoSaved')}
            </span>
            <SearchOverlay />
            <button
              className="icon-button"
              aria-label={t('theme') + ' ' + t(state.theme)}
              onClick={() => update({ theme: state.theme === 'dark' ? 'light' : 'dark' })}
            >
              {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="language-button"
              aria-label={state.language.toUpperCase() + ' ' + t('language')}
              onClick={() =>
                update({
                  language: state.language === 'ru' ? 'kk' : state.language === 'kk' ? 'en' : 'ru',
                })
              }
            >
              {state.language.toUpperCase()}
            </button>
          </div>
        </header>
        <main
          id="main-content"
          className={location.pathname === '/' ? 'dashboard-main-content' : undefined}
        >
          {hasStorageError() && (
            <p className="notice danger" role="alert">
              {t('storageError')}
            </p>
          )}
          {hasUndo() && (
            <div className="notice">
              <button className="text-button" onClick={undo}>
                {t('undo')}
              </button>
            </div>
          )}
          <OfflineStatus />
          <Outlet />
          <InstallHint />
        </main>
        <LegalFooter />
        <RestTimer />
      </div>
      <MobileNavigation />
    </div>
  );
}
