import faq from '../data/landing-faq.json';
import features from '../data/landing-features.json';
import { useI18n } from '../i18n';
export function LandingFeatures() {
  const { t, local } = useI18n();
  return (
    <section className="sf-section sf-container landing-features">
      <h2>{t('sfFullTools')}</h2>
      <div>
        {features.map((feature, index) => (
          <article key={feature.title}>
            <span className="sf-index">0{index + 1}</span>
            <h3>{t(feature.title)}</h3>
            <p>{local(feature.text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function LandingFAQ() {
  const { t, language } = useI18n();
  return (
    <section className="sf-section sf-container sf-faq">
      <h2>{t('sfFaq')}</h2>
      {faq.map((entry, index) => (
        <details key={index}>
          <summary>{entry[language].question}</summary>
          <p>{entry[language].answer}</p>
        </details>
      ))}
    </section>
  );
}
