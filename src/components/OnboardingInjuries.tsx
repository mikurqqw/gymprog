import { useState } from 'react';
import { injurySchema, joints, type Injury } from '../lib/injuries';
import type { OnboardingDraft } from '../lib/onboardingDraft';
import { useI18n } from '../i18n';
import { Field, Num, Select } from './ui';
export function OnboardingInjuries({
  draft,
  edit,
}: {
  draft: OnboardingDraft;
  edit: (patch: Partial<OnboardingDraft>) => void;
}) {
  const { t } = useI18n(),
    [error, setError] = useState(''),
    [injury, setInjury] = useState<Injury>({
      id: crypto.randomUUID(),
      area: 'elbow',
      side: 'left',
      status: 'chronic',
      severity: 1,
      cleared: false,
      notes: '',
    });
  return (
    <details className="onboarding-injuries">
      <summary>
        {t('injuryModule')} · {draft.injuryRecords.length}
      </summary>
      <p>{t('setupLimitations')}</p>
      <p className="notice warning">{t('noClearance')}</p>
      <div className="form-grid">
        <Select
          label={t('injuryArea')}
          value={injury.area}
          options={joints.map((value) => ({ value, label: t(value) }))}
          onChange={(value) => setInjury({ ...injury, area: value as Injury['area'] })}
        />
        <Select
          label={t('injurySide')}
          value={injury.side}
          options={['left', 'right', 'both'].map((value) => ({ value, label: t(value) }))}
          onChange={(value) => setInjury({ ...injury, side: value as Injury['side'] })}
        />
        <Select
          label={t('status')}
          value={injury.status}
          options={['acute', 'postFracture', 'postSurgery', 'overuse', 'chronic'].map((value) => ({
            value,
            label: t(value),
          }))}
          onChange={(value) => setInjury({ ...injury, status: value as Injury['status'] })}
        />
        <Num
          label={t('severity')}
          value={injury.severity}
          min={1}
          max={3}
          onChange={(severity) => setInjury({ ...injury, severity })}
        />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={injury.cleared}
          onChange={(event) => setInjury({ ...injury, cleared: event.target.checked })}
        />
        {t('cleared')}
      </label>
      <Field label={t('note')}>
        <textarea
          value={injury.notes}
          maxLength={1000}
          onChange={(event) => setInjury({ ...injury, notes: event.target.value })}
        />
      </Field>
      <button
        type="button"
        className="button secondary"
        onClick={() => {
          const parsed = injurySchema.safeParse(injury);
          if (!parsed.success || draft.injuryRecords.length >= 50) {
            setError(t('invalid'));
            return;
          }
          edit({ injuryRecords: [...draft.injuryRecords, parsed.data] });
          setInjury({ ...injury, id: crypto.randomUUID(), notes: '' });
          setError('');
        }}
      >
        {t('add')}
      </button>
      {draft.injuryRecords.map((item) => (
        <div className="inline" key={item.id}>
          <span>
            {t(item.area)} · {t(item.side)} · {t(item.status)}
          </span>
          <button
            type="button"
            className="text-button"
            onClick={() =>
              edit({ injuryRecords: draft.injuryRecords.filter((record) => record.id !== item.id) })
            }
          >
            {t('delete')}
          </button>
        </div>
      ))}
      {error && <p role="alert">{error}</p>}
      <Field label={t('limitations')}>
        <textarea
          maxLength={1000}
          value={draft.limitations}
          onChange={(event) => edit({ limitations: event.target.value })}
        />
      </Field>
    </details>
  );
}
