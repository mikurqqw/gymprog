import type { OnboardingDraft } from '../lib/onboardingDraft';
import { nextMonday, today } from '../lib/formulas';
import { liftIds } from '../lib/schema';
import { useI18n } from '../i18n';
import { OnboardingInjuries } from './OnboardingInjuries';
import { Field, Num, Select } from './ui';
export function OnboardingSchedule({
  draft,
  edit,
}: {
  draft: OnboardingDraft;
  edit: (patch: Partial<OnboardingDraft>) => void;
}) {
  const { t } = useI18n();
  return (
    <>
      <div className="form-grid">
        <Select
          label={t('equipment')}
          value={draft.equipment}
          options={['gym', 'limited', 'home'].map((value) => ({ value, label: t(value) }))}
          onChange={(value) => edit({ equipment: value as OnboardingDraft['equipment'] })}
        />
        {draft.goal === 'powerlifting' ? (
          <p className="notice">{t('powerliftingFixed')}</p>
        ) : (
          <Num
            label={t('days')}
            min={2}
            max={5}
            value={draft.days}
            onChange={(days) => edit({ days })}
          />
        )}
        <Num
          label={t('minutes')}
          min={30}
          max={180}
          value={draft.minutes}
          onChange={(minutes) => edit({ minutes })}
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
      <OnboardingInjuries draft={draft} edit={edit} />
      <section className="onboarding-summary">
        <h2>{t('setupSummary')}</h2>
        <p>
          {t(draft.goal)} · {draft.goal === 'powerlifting' ? 3 : draft.days} {t('days')} ·{' '}
          {draft.start ?? nextMonday(today())}
        </p>
        <p>
          {draft.age} · {draft.height} cm · {draft.weight} kg
        </p>
        <ul>
          {liftIds.map((lift) => (
            <li key={lift}>
              {t(lift)}:{' '}
              {draft.strengthInputs[lift].method === 'unknown'
                ? t('setupUnknown')
                : draft.strengthInputs[lift].method === 'set'
                  ? t('setupEstimated')
                  : `${draft.lifts[lift].current ?? '—'} kg`}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
