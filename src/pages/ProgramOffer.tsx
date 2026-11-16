import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { programOffers } from '../data/programOffers';
import { useI18n } from '../i18n';
import { useStore } from '../lib/store';
import { ProgramEvidence } from '../components/ProgramEvidence';
const Sample = lazy(() =>
  import('../components/ProgramSample').then((module) => ({ default: module.ProgramSample })),
);
export default function ProgramOffer() {
  const { id } = useParams(),
    { t, local } = useI18n(),
    state = useStore(),
    offer = programOffers.find((item) => item.goal === id);
  if (!offer)
    return (
      <div className="sf-container sf-catalog">
        <h1>{t('notFound')}</h1>
        <Link className="button" to="/catalog">
          {t('sfBackCatalog')}
        </Link>
      </div>
    );
  return (
    <div className="sf-container sf-offer-detail">
      <Link className="text-link" to="/catalog">
        ← {t('sfBackCatalog')}
      </Link>
      <div className="sf-offer-heading">
        <div>
          <p className="sf-kicker">IRONCYCLE / 08 WEEKS</p>
          <h1>{t(offer.goal)}</h1>
          <p className="sf-lead">{local(offer.description)}</p>
          <p>{local(offer.focus)}</p>
        </div>
        <aside className="sf-offer-cta">
          <span className="sf-index">{t('sfFormat')}</span>
          <strong>{t('sfEightWeeks')}</strong>
          <p>
            {offer.goal === 'powerlifting' ? '3' : '2–5'} {t('sfDaysWeek')}
          </p>
          <Link
            className="button"
            to={state.onboarded ? '/builder?program=' + offer.goal : '/start?program=' + offer.goal}
          >
            {t(state.onboarded ? 'sfConfigure' : 'sfSelect')}
            <ArrowRight size={18} />
          </Link>
          <Link className="text-link" to="/demo">
            {t('sfDemo')}
          </Link>
          <p className="sf-small">{t('sfPreviewTerms')}</p>
        </aside>
      </div>
      <section className="sf-offer-info">
        <div>
          <h2>{t('sfForWhom')}</h2>
          <p>{local(offer.audience)}</p>
        </div>
        <div>
          <h2>{t('sfIncluded')}</h2>
          <ul>
            {['sfEightWeeks', 'sfStep2', 'sfStep3', 'sfFullTools'].map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sf-section">
        <h2>{t('sfSampleWeek')}</h2>
        <Suspense fallback={<div className="skeleton" aria-busy="true" />}>
          <Sample goal={offer.goal} />
        </Suspense>
      </section>
      <section className="sf-section">
        <h2>{t('sfRequirements')}</h2>
        <p className="reading">{t('sfRequirementsText')}</p>
      </section>
      <ProgramEvidence goal={offer.goal} />
    </div>
  );
}
