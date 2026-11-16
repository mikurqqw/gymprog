import { generate, exerciseById } from '../lib/program';
import { defaultProfile } from '../lib/schema';
import type { Profile } from '../lib/schema';
import { useI18n } from '../i18n';
export function ProgramSample({ goal }: { goal: Profile['goal'] }) {
  const { t, local } = useI18n(),
    rows = generate({ ...defaultProfile, goal }).filter((row) => row.week === 1);
  return (
    <div className="sf-sample-week">
      <p className="sf-small">{t('sfWeekExampleNotice')}</p>
      {[...new Set(rows.map((row) => row.day))].map((day) => (
        <article key={day}>
          <h3>
            {t('session')} {day + 1}
          </h3>
          <ul>
            {rows
              .filter((row) => row.day === day)
              .map((row) => (
                <li key={row.id}>
                  <span>{local(exerciseById(row.exercise).name)}</span>
                  <b>
                    {row.sets} × {row.reps}
                  </b>
                </li>
              ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
