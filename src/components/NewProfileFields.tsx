import { ExperienceField } from './ExperienceField';
import type { OnboardingDraft } from '../lib/onboardingDraft';
import { useI18n } from '../i18n';
import { Field } from './ui';
import { DraftNumber } from './DraftNumber';
import { MeasurementInput } from './MeasurementInput';
export function NewProfileFields({
  draft,
  edit,
}: {
  draft: OnboardingDraft;
  edit: (patch: Partial<OnboardingDraft>) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="form-grid">
      <DraftNumber
        label={t('age')}
        value={draft.age}
        min={18}
        max={90}
        example={30}
        onChange={(age) => edit({ age })}
      />
      <MeasurementInput
        label={t('height')}
        measure="height"
        value={draft.height}
        limits={[120, 230]}
        example={175}
        onChange={(height) => edit({ height })}
      />
      <MeasurementInput
        label={t('bodyweight')}
        value={draft.weight}
        limits={[35, 250]}
        example={70}
        onChange={(weight) => edit({ weight })}
      />
      <ExperienceField value={draft.experience} onChange={(experience) => edit({ experience })} />
      <Field label={t('sex')}>
        <select
          aria-label={t('sex')}
          required
          value={draft.sex ?? ''}
          onChange={(event) => edit({ sex: event.target.value as 'male' | 'female' })}
        >
          <option disabled value="">
            {t('selectValue')}
          </option>
          <option value="male">{t('male')}</option>
          <option value="female">{t('female')}</option>
        </select>
      </Field>
    </div>
  );
}
