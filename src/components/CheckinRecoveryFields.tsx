import type { Checkin } from '../lib/schema';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
export type CheckinEdit = <K extends keyof Checkin>(key: K, value: Checkin[K]) => void;
export function CheckinRecoveryFields({ value, change }: { value: Checkin; change: CheckinEdit }) {
  const { t } = useI18n();
  return (
    <section className="recovery-primary" aria-labelledby="recovery-heading">
      <h2 id="recovery-heading">{t('compactRecovery')}</h2>
      <div className="rating-fields">
        {(['quality', 'recovery', 'soreness', 'stress', 'mood'] as const).map((key) => (
          <fieldset key={key}>
            <legend>{t(key === 'recovery' ? 'subjective' : key)}</legend>
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  aria-pressed={value[key] === n}
                  className={value[key] === n ? 'active' : ''}
                  onClick={() => change(key, value[key] === n ? undefined : n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="rating-scale">
              <span>
                {t(['soreness', 'stress'].includes(key) ? 'recoveryLow' : 'recoveryPoor')}
              </span>
              <span>
                {t(['soreness', 'stress'].includes(key) ? 'recoveryHigh' : 'recoveryGood')}
              </span>
            </p>
          </fieldset>
        ))}
      </div>
    </section>
  );
}
