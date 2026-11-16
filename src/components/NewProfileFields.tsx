import type { OnboardingDraft } from '../lib/onboardingDraft';
import { useI18n } from '../i18n';
import { Field } from './ui';
import { DraftNumber } from './DraftNumber';
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
      <DraftNumber
        label={t('height') + ' (cm)'}
        value={draft.height}
        min={120}
        max={230}
        example={175}
        onChange={(height) => edit({ height })}
      />
      <DraftNumber
        label={t('bodyweight') + ' (kg)'}
        value={draft.weight}
        min={35}
        max={250}
        example={70}
        onChange={(weight) => edit({ weight })}
      />
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
