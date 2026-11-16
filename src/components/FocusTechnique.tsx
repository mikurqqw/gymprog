import { Link } from 'react-router-dom';
import type { Exercise } from '../lib/schema';
import { useI18n } from '../i18n';
import { ExerciseMedia } from './ExerciseMedia';
export function FocusTechnique({ exercise }: { exercise: Exercise }) {
  const { t, local } = useI18n();
  return (
    <details className="focus-technique">
      <summary>{t('focusHowTo')}</summary>
      <ExerciseMedia exercise={exercise} />
      {exercise.setup && <p>{local(exercise.setup)}</p>}
      <ol>
        {exercise.steps?.map((step, index) => (
          <li key={index}>{local(step)}</li>
        ))}
      </ol>
      {exercise.breathing && <p>{local(exercise.breathing)}</p>}
      <p className="notice warning">{local(exercise.safety)}</p>
      <Link className="text-link" to={'/library?exercise=' + exercise.id}>
        {t('readMore')} →
      </Link>
    </details>
  );
}
