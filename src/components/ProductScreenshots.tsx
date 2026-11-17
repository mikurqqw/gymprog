import { useI18n } from '../i18n';
export function ProductScreenshots() {
  const { t } = useI18n();
  return (
    <section className="sf-section sf-container product-screens">
      <div>
        <span className="sf-index">IRONCYCLE</span>
        <h2>{t('landingScreens')}</h2>
        <p>{t('landingScreensText')}</p>
      </div>
      <div className="product-device-pair">
        {['dark', 'light'].map((theme) => (
          <figure key={theme} className={'product-device ' + theme}>
            <div className="device-sensor" aria-hidden="true" />
            <img
              src={'./screenshots/focus-' + theme + '.webp'}
              width={375}
              height={812}
              loading="lazy"
              decoding="async"
              alt={t('landingScreensAlt') + ' · ' + t(theme)}
            />
            <figcaption>{t(theme)}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
