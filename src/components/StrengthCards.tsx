import { UnassessedStrength } from './UnassessedStrength';
import { ArrowUpRight } from 'lucide-react';
import { liftIds } from '../lib/schema';
import { useProfileStore as useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { Weight } from './ui';
export function StrengthCards() {
  const { profile: p } = useStore(),
    { t } = useI18n();
  if (Object.values(p.strengthAssessment).includes('unknown')) return <UnassessedStrength />;
  return (
    <div className="strength-grid">
      {liftIds.map((lift, i) => (
        <section className="strength-card" key={lift}>
          <div className="strength-top">
            <span>
              <i className={'lift-dot lift-' + i} />
              {t(lift)}
            </span>
            <ArrowUpRight size={18} />
          </div>
          <div className="strength-value">
            <Weight value={p.lifts[lift].current} />
          </div>
          <div className="strength-meta">
            <span>
              {t('pr')}{' '}
              <b>
                <Weight value={p.lifts[lift].pr} />
              </b>
            </span>
            <span className={p.lifts[lift].current < p.lifts[lift].pr ? 'muted' : 'accent'}>
              {p.lifts[lift].current - p.lifts[lift].pr > 0 ? '+' : ''}
              <Weight value={p.lifts[lift].current - p.lifts[lift].pr} />
            </span>
          </div>
          <div className="strength-rule">
            <span
              style={{
                width: `${Math.min(100, (p.lifts[lift].current / p.lifts[lift].pr) * 100)}%`,
              }}
            />
          </div>
        </section>
      ))}
      <section className="strength-card total-card">
        <div className="strength-top">
          <span>Σ {t('total')}</span>
          <ArrowUpRight size={18} />
        </div>
        <div className="strength-value">
          <Weight value={liftIds.reduce((a, l) => a + p.lifts[l].current, 0)} />
        </div>
        <div className="strength-meta">
          <span>
            {t('pr')}{' '}
            <b>
              <Weight value={liftIds.reduce((a, l) => a + p.lifts[l].pr, 0)} />
            </b>
          </span>
          <span>
            <Weight value={liftIds.reduce((a, l) => a + p.lifts[l].current - p.lifts[l].pr, 0)} />
          </span>
        </div>
        <div className="strength-rule">
          <span style={{ width: '94%' }} />
        </div>
      </section>
    </div>
  );
}
