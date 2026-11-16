import { NewProfileFields } from './NewProfileFields';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, update } from '../lib/store';
import type { OnboardingDraft } from '../lib/onboardingDraft';
import { completeDraft } from '../lib/completeDraft';
import { liftIds } from '../lib/schema';
import { nextMonday, today } from '../lib/formulas';
import { useI18n } from '../i18n';
import { DraftNumber } from './DraftNumber';
import { Card, Field, PageTitle, Select, Num } from './ui';
export function NewProfileSetup() {
  const state = useStore(),
    { t, units } = useI18n(),
    navigate = useNavigate(),
    [step, setStep] = useState(0),
    [error, setError] = useState('');
  const draft = state.draftProfile,
    edit = (patch: Partial<OnboardingDraft>) => update({ draftProfile: { ...draft, ...patch } });
  const lift = (key: (typeof liftIds)[number], value: number | null) =>
    edit({ lifts: { ...draft.lifts, [key]: { ...draft.lifts[key], current: value, pr: value } } });
  return (
    <>
      <PageTitle title={t('onboarding')} description={t('emptyProfileNotice')} />
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
          if (step < 2) {
            setStep(step + 1);
            return;
          }
          try {
            update({ profile: completeDraft(draft), onboarded: true });
            navigate('/');
          } catch {
            setError(t('invalid'));
          }
        }}
      >
        <Card>
          {step === 0 ? (
            <NewProfileFields draft={draft} edit={edit} />
          ) : step === 1 ? (
            <>
              <p>{t('knownStrengthOnly')}</p>
              <div className="form-grid">
                {liftIds.map((key, index) => (
                  <DraftNumber
                    key={key}
                    label={t(key) + ' (kg)'}
                    value={draft.lifts[key].current}
                    min={1}
                    max={600}
                    example={[60, 40, 80][index]}
                    onChange={(value) => lift(key, value)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="form-grid">
                <Select
                  label={t('equipment')}
                  value={draft.equipment}
                  options={['gym', 'limited', 'home'].map((value) => ({ value, label: t(value) }))}
                  onChange={(value) => edit({ equipment: value as OnboardingDraft['equipment'] })}
                />
                <Num
                  label={t('days')}
                  min={2}
                  max={5}
                  value={draft.days}
                  onChange={(days) => edit({ days })}
                />
                <Field label={t('startDate')}>
                  <input
                    type="date"
                    required
                    value={draft.start ?? nextMonday(today())}
                    onChange={(event) => edit({ start: event.target.value })}
                  />
                </Field>
              </div>
              <p className="notice">{t('sfRequirementsText')}</p>
            </>
          )}
        </Card>
        {units === 'imperial' && <p className="micro muted">{t('onboardingMetricNotice')}</p>}
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
