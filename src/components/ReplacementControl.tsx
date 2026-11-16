import { useState } from 'react';
import { useI18n } from '../i18n';
import { useStore, replaceWithUndo } from '../lib/store';
import { rankedAlternatives, replaceExercise, type ReplacementScope } from '../lib/replacements';
import type { Planned } from '../lib/schema';
import { exerciseById } from '../lib/program';
import { Field, Select } from './ui';
export function ReplacementControl({ row }: { row: Planned }) {
  const state = useStore(),
    { t, local } = useI18n(),
    [scope, setScope] = useState<ReplacementScope>('session'),
    [error, setError] = useState('');
  const apply = (replacement: string | null) => {
    try {
      replaceWithUndo(replaceExercise(state, row, replacement, scope));
      setError('');
    } catch {
      setError(t('invalid'));
    }
  };
  return (
    <div>
      <Field label={t('swap')}>
        <select aria-label={t('swap')} value={row.exercise} onChange={(e) => apply(e.target.value)}>
          <option value={row.exercise}>{local(exerciseById(row.exercise).name)}</option>
          {rankedAlternatives(row.exercise, state.profile).map((ex) => (
            <option key={ex.id} value={ex.id}>
              {local(ex.name)}
            </option>
          ))}
        </select>
      </Field>
      <Select
        label={t('scope')}
        value={scope}
        options={(['session', 'week', 'cycle'] as const).map((value) => ({
          value,
          label: t('replace' + value[0].toUpperCase() + value.slice(1)),
        }))}
        onChange={(value) => setScope(value as ReplacementScope)}
      />
      {(row.lift || state.swaps[row.id]) && <p className="micro warning">{t('competitionSwap')}</p>}
      <p className="micro">{t('conservativeStart')}</p>
      {state.swaps[row.id] && (
        <button className="text-button" onClick={() => apply(null)}>
          {t('restoreOriginal')}
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
