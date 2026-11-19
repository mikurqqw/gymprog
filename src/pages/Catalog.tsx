import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { programOffers } from '../data/programOffers';
import { useI18n } from '../i18n';
import { SeriesLinks } from '../components/SeriesLinks';
export default function Catalog() {
  const { t, local } = useI18n(),
    [group, setGroup] = useState('all');
  return (
    <div className="sf-container sf-catalog">
      <p className="sf-kicker">IRONCYCLE / {t('sfPrograms')}</p>
      <h1>{t('sfCatalogTitle')}</h1>
      <p className="sf-lead">{t('sfCatalogIntro')}</p>
      {group !== 'specialist' && <SeriesLinks />}
      <div className="tabs" aria-label={t('sfPrograms')}>
        {['all', 'general', 'specialist'].map((value) => (
          <button
            aria-pressed={group === value}
            key={value}
            className={group === value ? 'active' : ''}
            onClick={() => setGroup(value)}
          >
            {t(value === 'all' ? 'sfAll' : value === 'general' ? 'sfGeneral' : 'sfSpecialist')}
          </button>
        ))}
      </div>
      <div className="sf-catalog-grid">
        {programOffers
          .filter((offer) => group === 'all' || offer.group === group)
          .map((offer, i) => (
            <article className="sf-program-card" key={offer.goal}>
              <div className="section-heading">
                <span className="sf-index">0{i + 1} / 08</span>
                <span className="pill">
                  {t(offer.group === 'general' ? 'sfGeneral' : 'sfSpecialist')}
                </span>
              </div>
              <h2>{t(offer.goal)}</h2>
              <p>{local(offer.description)}</p>
              <p className="sf-program-focus">{local(offer.focus)}</p>
              <p className="sf-small">
                {t('sfEightWeeks')} · {offer.goal === 'powerlifting' ? '3' : '2–5'}{' '}
                {t('sfDaysWeek')}
              </p>
              <Link className="button secondary" to={'/catalog/' + offer.goal}>
                {t('sfView')}
                <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
      </div>
      <p className="notice">{t('sfPreviewTerms')}</p>
    </div>
  );
}
