import { useEffect, useRef, lazy, Suspense } from 'react';
import { Search, X } from 'lucide-react';
import { useI18n } from '../i18n';
const GlobalSearch = lazy(() =>
  import('./GlobalSearch').then((module) => ({ default: module.GlobalSearch })),
);
export function SearchOverlay() {
  const { t } = useI18n(),
    dialog = useRef<HTMLDialogElement>(null);
  const open = () => dialog.current?.showModal();
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.key !== '/' ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        !matchMedia('(min-width:768px)').matches
      )
        return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      )
        return;
      event.preventDefault();
      dialog.current?.showModal();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <>
      <button
        className="icon-button"
        aria-label={t('search')}
        aria-haspopup="dialog"
        onClick={open}
      >
        <Search size={20} />
      </button>
      <dialog
        className="full-screen-sheet search-sheet"
        ref={dialog}
        aria-labelledby="search-title"
      >
        <header>
          <h2 id="search-title">{t('globalSearch')}</h2>
          <button
            className="icon-button"
            aria-label={t('close')}
            onClick={() => dialog.current?.close()}
          >
            <X size={23} />
          </button>
        </header>
        <Suspense fallback={<div className="skeleton" aria-busy="true" />}>
          <GlobalSearch expanded onNavigate={() => dialog.current?.close()} />
        </Suspense>
      </dialog>
    </>
  );
}
