import { OnboardingGoals } from './OnboardingGoals';
import { LiftStrengthEntry } from './LiftStrengthEntry';
import { OnboardingSchedule } from './OnboardingSchedule';
import { assessedStrength } from '../lib/strengthSetup';
import { NewProfileFields } from './NewProfileFields';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, update } from '../lib/store';
import type { OnboardingDraft } from '../lib/onboardingDraft';
import { completeDraft } from '../lib/completeDraft';
import { liftIds } from '../lib/schema';
import { useI18n } from '../i18n';
import { Card, PageTitle } from './ui';
export function NewProfileSetup() {
  const state = useStore(),
    { t } = useI18n(),
    navigate = useNavigate(),
    [step, setStep] = useState(0),
    [error, setError] = useState('');
  const draft = state.draftProfile,
    edit = (patch: Partial<OnboardingDraft>) => update({ draftProfile: { ...draft, ...patch } });
  return (
    <>
      <PageTitle compact title={t('onboarding')} description={t('setupFast')} />
      <div className="wizard-steps">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            aria-current={step === index ? 'step' : undefined}
            className={step === index ? 'active' : ''}
            disabled={index > step}
            onClick={() => setStep(index)}
          >
            {index + 1} · {t(['profile', 'strengthSummary', 'settings'][index])}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          try {
            if (step === 1)
              for (const lift of liftIds)
                assessedStrength(draft.lifts[lift].current, draft.strengthInputs[lift]);
            if (step < 2) {
              setError('');
              setStep(step + 1);
              return;
            }
            update({ profile: completeDraft(draft), onboarded: true });
            navigate('/');
          } catch {
            setError(t('invalid'));
          }
        }}
      >
        <Card>
          {step === 0 ? (
            <>
              <NewProfileFields draft={draft} edit={edit} />
              <p className="micro muted">{t('simpleProfileNote')}</p>
            </>
          ) : step === 1 ? (
            <>
              {liftIds.map((lift) => (
                <LiftStrengthEntry key={lift} lift={lift} draft={draft} edit={edit} />
              ))}
            </>
          ) : (
            <>
              <OnboardingGoals goal={draft.goal} onChange={(goal) => edit({ goal })} />
              <OnboardingSchedule draft={draft} edit={edit} />
            </>
          )}
        </Card>
        {error && <p role="alert">{error}</p>}
        <div className="form-actions">
          {step > 0 && (
            <button type="button" className="button secondary" onClick={() => setStep(step - 1)}>
              {t('back')}
            </button>
          )}
          <button className="button" type="submit">
            {t(step === 2 ? 'finish' : 'next')}
          </button>
        </div>
      </form>
    </>
  );
}
