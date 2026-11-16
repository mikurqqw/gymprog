import { programOffers } from '../data/programOffers';
import type { OnboardingDraft } from '../lib/onboardingDraft';
import { useI18n } from '../i18n';
export function OnboardingGoals({
  goal,
  onChange,
}: {
  goal: OnboardingDraft['goal'];
  onChange: (goal: OnboardingDraft['goal']) => void;
}) {
  const { t, local } = useI18n();
  return (
    <fieldset className="onboarding-goals">
      <legend>{t('setupGoal')}</legend>
      <div>
        {programOffers.map((offer) => (
          <label key={offer.goal} className={goal === offer.goal ? 'selected' : ''}>
            <input
              type="radio"
              name="setup-goal"
              value={offer.goal}
              checked={goal === offer.goal}
              onChange={() => onChange(offer.goal)}
            />
            <span>
              <strong>{t(offer.goal)}</strong>
              <small>{local(offer.description)}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
