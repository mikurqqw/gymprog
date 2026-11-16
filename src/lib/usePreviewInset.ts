import { useEffect } from 'react';
export function usePreviewInset() {
  useEffect(() => {
    const banner = document.querySelector('.preview-banner');
    if (!banner) return;
    const resize = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--preview-inset',
        `${banner.getBoundingClientRect().height}px`,
      );
    });
    resize.observe(banner);
    return () => {
      resize.disconnect();
      document.documentElement.style.removeProperty('--preview-inset');
    };
  }, []);
}
