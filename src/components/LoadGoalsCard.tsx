import { useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { loadGoalStrings } from '../i18n/loadGoalStrings';
import { today } from '../lib/formulas';
import { requiresClearance } from '../lib/health';
import { stopSymptoms } from '../lib/injuries';
import { estimateLoadGoal, type GoalSession } from '../lib/loadGoalForecast';
import { loadGoalSchema, MAX_LOAD_GOALS, type LoadGoal } from '../lib/loadGoalSchema';
import { exercises } from '../lib/program';
import type { Localized } from '../lib/schema';
import { hasStorageError, update, useProfileStore } from '../lib/store';
import { LoadGoalForm } from './LoadGoalForm';
import { LoadGoalResult } from './LoadGoalResult';
import { Card, Weight } from './ui';
import './load-goals.css';

const weighted = exercises.filter((exercise) =>
  ['barbell', 'cable', 'dumbbell', 'machine'].includes(exercise.equipment),
);
const exercisesById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
const extraMovements = new Map<string, Required<Localized>>([
  ['variant:strictCurl', loadGoalStrings.strictCurl],
  ['variant:extremeCurl', loadGoalStrings.extremeCurl],
]);

export function LoadGoalsCard({
  schedule,
  notice,
}: {
  schedule?: GoalSession[];
  notice?: ReactNode;
}) {
  const state = useProfileStore();
  const { local, locale, language, t } = useI18n();
  const strings = loadGoalStrings;
  const [edited, setEdited] = useState<LoadGoal>();
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState<{ text: string; error?: boolean }>();
  const day = today();
  const checkin = state.checkins.toSorted((a, b) => b.date.localeCompare(a.date))[0];
  const paused =
    requiresClearance(state.profile.health) || Boolean(checkin && stopSymptoms(checkin));
  const label = (exercise: string) => {
    const extra = extraMovements.get(exercise);
    if (extra) return extra[language];
    const catalogExercise = exercisesById.get(exercise);
    return catalogExercise
      ? local(catalogExercise.name)
      : exercise.slice(exercise.indexOf(':') + 1);
  };
  const options = [
    ...new Set([
      ...weighted.map((exercise) => exercise.id),
      ...extraMovements.keys(),
      ...(schedule ?? []).map((session) => session.exercise),
    ]),
  ].map((value) => ({ value, label: label(value) }));
  options.sort((a, b) => a.label.localeCompare(b.label, locale));
  const save = (exercise: string, weight: number | null) => {
    const parsed = loadGoalSchema.safeParse({ exercise, weight });
    if (!parsed.success) {
      setMessage({ text: t('invalid'), error: true });
      return;
    }
    let exceeded = false;
    update((old) => {
      const goals = old.loadGoals.filter(
        (goal) => goal.exercise !== edited?.exercise && goal.exercise !== exercise,
      );
      if (goals.length >= MAX_LOAD_GOALS) {
        exceeded = true;
        return {};
      }
      return { loadGoals: [...goals, parsed.data] };
    });
    if (exceeded || hasStorageError()) {
      setMessage({ text: exceeded ? strings.limit[language] : t('storageError'), error: true });
      return;
    }
    setEdited(undefined);
    setVersion((value) => value + 1);
    setMessage({ text: t('saved') });
  };
  const remove = (exercise: string) => {
    update((old) => ({ loadGoals: old.loadGoals.filter((goal) => goal.exercise !== exercise) }));
    if (edited?.exercise === exercise) {
      setEdited(undefined);
      setVersion((value) => value + 1);
    }
    setMessage(hasStorageError() ? { text: t('storageError'), error: true } : undefined);
  };
  return (
    <Card className="load-goals">
      <h2>{strings.title[language]}</h2>
      <p>{strings.description[language]}</p>
      {notice}
      {state.loadGoals.map((goal) => {
        const result = estimateLoadGoal(goal, schedule ?? [], state.logs, day);
        return (
          <div key={goal.exercise} className="load-goal">
            <h3>
              {label(goal.exercise)} · <Weight value={goal.weight} />
            </h3>
            {(schedule || result.kind === 'recorded') && (
              <p>
                {paused && result.kind !== 'recorded' ? (
                  strings.paused[language]
                ) : (
                  <LoadGoalResult result={result} today={day} />
                )}
              </p>
            )}
            <div className="inline">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setEdited(goal);
                  setVersion((value) => value + 1);
                  setMessage(undefined);
                }}
              >
                {strings.edit[language]}
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => remove(goal.exercise)}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        );
      })}
      <LoadGoalForm key={version} edited={edited} options={options} save={save} />
      {message && <p role={message.error ? 'alert' : 'status'}>{message.text}</p>}
      <p className="micro muted">{strings.help[language]}</p>
    </Card>
  );
}
