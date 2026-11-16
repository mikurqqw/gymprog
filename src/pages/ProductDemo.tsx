import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
export default function ProductDemo() {
  const { t } = useI18n(),
    [step, setStep] = useState(0),
    [sets, setSets] = useState(0);
  return (
    <div className="sf-container sf-demo-page">
      <p className="sf-kicker">INTERACTIVE DEMO / 18+</p>
      <h1>{t('sfDemoTitle')}</h1>
      <p className="sf-lead">{t('sfDemoIntro')}</p>
      <div className="sf-demo-steps" aria-label={t('sfDemo')}>
        {['sfDemoPlan', 'sfDemoLog', 'sfDemoResult'].map((key, i) => (
          <button
            aria-current={step === i ? 'step' : undefined}
            className={step === i ? 'active' : ''}
            key={key}
            disabled={i === 2 && sets === 0}
            onClick={() => setStep(i)}
          >
            {t(key)}
          </button>
        ))}
      </div>
      <section className="sf-demo-panel" aria-live="polite">
        <span className="sf-index">{t('sfSample')}</span>
        {step === 0 ? (
          <>
            <h2>{t('sfSession')}</h2>
            <p>{t('sfExampleLift')} · 3 × 8 · RPE ≤ 7</p>
            <p>{t('sfStep2Text')}</p>
            <button className="button" onClick={() => setStep(1)}>
              {t('sfDemoOpen')}
              <ArrowRight size={18} />
            </button>
          </>
        ) : step === 1 ? (
          <>
            <h2>{t('sfExampleLift')}</h2>
            <p>
              {t('sets')}: {sets}/3 · 8 {t('reps')}
            </p>
            <div className="sf-demo-set-buttons">
              {[0, 1, 2].map((i) => (
                <button
                  className={i < sets ? 'checked' : ''}
                  aria-label={t('sfDemoMark') + ' ' + (i + 1)}
                  aria-pressed={i < sets}
                  key={i}
                  onClick={() => setSets(i < sets ? i : i + 1)}
                >
                  {i < sets ? <Check size={24} /> : i + 1}
                </button>
              ))}
            </div>
            <p>{t('sfDemoWhy')}</p>
            <button className="button" disabled={!sets} onClick={() => setStep(2)}>
              {t('sfDemoSummary')}
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <span className="sf-demo-complete">
              <Check size={30} />
            </span>
            <h2>{t('sfDemoResult')}</h2>
            <div className="sf-demo-result">
              <strong>
                {sets}
                <small>/ 3 {t('sets')}</small>
              </strong>
              <strong>
                {sets * 8}
                <small>{t('reps')}</small>
              </strong>
            </div>
            <p>{t('sfDemoResultText')}</p>
            <div className="sf-actions">
              <Link className="button" to="/catalog">
                {t('sfChoose')}
                <ArrowRight size={18} />
              </Link>
              <button
                className="button secondary"
                onClick={() => {
                  setSets(0);
                  setStep(0);
                }}
              >
                {t('sfDemoReset')}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
