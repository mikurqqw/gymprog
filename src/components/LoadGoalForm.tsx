import { useState } from 'react';
import { useI18n } from '../i18n';
import { loadGoalStrings } from '../i18n/loadGoalStrings';
import type { LoadGoal } from '../lib/loadGoalSchema';
import { MeasurementInput } from './MeasurementInput';
import { Field, Select } from './ui';

const custom = 'custom:';

export function LoadGoalForm({
  edited,
  options,
  save,
}: {
  edited?: LoadGoal;
  options: { value: string; label: string }[];
  save: (exercise: string, weight: number | null) => void;
}) {
  const { language, t } = useI18n();
  const strings = loadGoalStrings;
  const editedCustom = edited?.exercise.startsWith(custom);
  const [selected, select] = useState(editedCustom ? custom : (edited?.exercise ?? ''));
  const [name, setName] = useState(
    editedCustom ? (edited?.exercise.slice(custom.length) ?? '') : '',
  );
  const [weight, setWeight] = useState<number | null>(edited?.weight ?? null);
  const visibleOptions =
    edited && !editedCustom && !options.some((option) => option.value === edited.exercise)
      ? [
          ...options,
          {
            value: edited.exercise,
            label: edited.exercise.slice(edited.exercise.indexOf(':') + 1),
          },
        ]
      : options;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save(selected === custom ? custom + name.trim() : selected, weight);
      }}
    >
      <div className="form-grid">
        <Select
          label={strings.movement[language]}
          value={selected}
          onChange={select}
          options={[
            { value: '', label: t('selectValue') },
            { value: custom, label: strings.custom[language] },
            ...visibleOptions,
          ]}
        />
        {selected === custom && (
          <Field label={strings.customName[language]}>
            <input
              required
              maxLength={180}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
        )}
        <MeasurementInput
          label={strings.target[language]}
          value={weight}
          onChange={setWeight}
          limits={[0.01, 800]}
        />
      </div>
      <button
        type="submit"
        className="button secondary"
        disabled={!selected || (selected === custom && !name.trim())}
      >
        {strings.save[language]}
      </button>
    </form>
  );
}
