import type { OnboardingDraft } from '../lib/onboardingDraft';
import type { Lift } from '../lib/schema';
import { assessedStrength, type StrengthInput } from '../lib/strengthSetup';
import { useI18n } from '../i18n';
import { MeasurementInput } from './MeasurementInput';
import { Num, Select, Weight } from './ui';
export function LiftStrengthEntry({
  lift,
  draft,
  edit,
}: {
  lift: Lift;
  draft: OnboardingDraft;
  edit: (patch: Partial<OnboardingDraft>) => void;
}) {
  const { t } = useI18n(),
    input = draft.strengthInputs[lift];
  const change = (patch: Partial<StrengthInput>) =>
    edit({ strengthInputs: { ...draft.strengthInputs, [lift]: { ...input, ...patch } } });
  let estimate: number | null = null;
  try {
    const result = assessedStrength(draft.lifts[lift].current, input);
    if (result.assessment === 'estimated') estimate = result.value;
  } catch {
    /* Incomplete drafts stay editable. */
  }
  return (
    <section className="strength-entry">
      <h2>{t(lift)}</h2>
      <Select
        label={t(lift) + ' · ' + t('setupStrengthMethod')}
        value={input.method}
        options={['known', 'set', 'unknown'].map((value) => ({
          value,
          label: t(
            value === 'known' ? 'setupKnown' : value === 'set' ? 'setupEstimate' : 'setupUnknown',
          ),
        }))}
        onChange={(value) =>
          edit({
            strengthInputs: {
              ...draft.strengthInputs,
              [lift]: { ...input, method: value as StrengthInput['method'] },
            },
            lifts: { ...draft.lifts, [lift]: { ...draft.lifts[lift], current: null, pr: null } },
          })
        }
      />
      {input.method === 'known' ? (
        <MeasurementInput
          label={t(lift)}
          value={draft.lifts[lift].current}
          limits={[1, 600]}
          example={40}
          onChange={(value) =>
            edit({
              lifts: {
                ...draft.lifts,
                [lift]: { ...draft.lifts[lift], current: value, pr: value },
              },
            })
          }
        />
      ) : input.method === 'set' ? (
        <>
          <div className="form-grid">
            <MeasurementInput
              label={t('setupRecentWeight')}
              value={input.weight}
              limits={[0.25, 300]}
              example={30}
              onChange={(weight) => change({ weight })}
            />
            <Num
              label={t('setupRecentReps')}
              value={input.reps}
              min={1}
              max={10}
              onChange={(reps) => change({ reps })}
            />
            <Num
              label={t('setupRecentRpe')}
              value={input.rpe}
              min={6}
              max={10}
              step={0.5}
              onChange={(rpe) => change({ rpe })}
            />
          </div>
          <p className="micro muted">
            {t('setupEstimated')}
            {estimate !== null && (
              <>
                {' '}
                · <Weight value={estimate} />
              </>
            )}
          </p>
        </>
      ) : (
        <p className="notice">{t('setupManual')}</p>
      )}
    </section>
  );
}
