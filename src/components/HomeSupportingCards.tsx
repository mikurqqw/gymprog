import { logRowId } from '../lib/workoutLogs';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../lib/store';
import { useI18n } from '../i18n';
import { nutrition } from '../lib/nutrition';
import { today } from '../lib/formulas';
import { liftIds, type Planned } from '../lib/schema';
import { sessionGroups, sessionKey } from '../lib/sessionInsights';
import { Card, Weight } from './ui';
import { ProgressRing } from './ProgressRing';
export function HomeSupportingCards({ rows }: { rows: Planned[] }) {
  const state = useProfileStore(),
    { t } = useI18n(),
    target = nutrition(state.profile),
    food = state.foodLogs.filter((entry) => entry.date === today()),
    kcal = food.reduce((sum, entry) => sum + entry.kcal, 0),
    protein = food.reduce((sum, entry) => sum + entry.protein, 0);
  const lagging = liftIds.find(
      (lift) => state.profile.lifts[lift].pr > state.profile.lifts[lift].current,
    ),
    week = sessionGroups(rows.filter((row) => row.week === state.week)),
    finished = week.filter(
      (group) => !!state.sessionCompletions[sessionKey(state, group[0].week, group[0].day)],
    ).length;
  const last = Object.values(state.sessionCompletions).sort((a, b) =>
      b.completedAt.localeCompare(a.completedAt),
    )[0],
    logs = last
      ? state.logs.filter(
          (log) => last.rowIds.includes(logRowId(log.id)) && log.status !== 'skipped',
        )
      : [],
    sets = logs.reduce((sum, log) => sum + log.sets.filter(Boolean).length, 0),
    volume = logs.reduce(
      (sum, log) => sum + log.weight * log.reps * log.sets.filter(Boolean).length,
      0,
    );
  return (
    <div className="home-support-grid">
      <Card>
        <h2>{t('nutrition')}</h2>
        {target.automaticAllowed ? (
          <>
            <div className="food-rings">
              <ProgressRing label={t('kcal')} value={kcal} target={target.kcal} />
              <ProgressRing label={t('protein')} value={protein} target={target.protein} />
            </div>
            <p className="micro muted">{t('calorieEstimateShort')}</p>
          </>
        ) : (
          <p className="muted">{t('medicalDietBlocked')}</p>
        )}
        <Link className="text-link" to="/nutrition">
          {t('foodLog')} →
        </Link>
      </Card>
      <Card>
        <h2>{t('nextMilestone')}</h2>
        {lagging ? (
          <>
            <p>{t('restoreRecords')}</p>
            <strong className="milestone-number">
              {t(lagging)} · <Weight value={state.profile.lifts[lagging].pr} />
            </strong>
            <p className="micro muted">
              {t('current')}: <Weight value={state.profile.lifts[lagging].current} />
            </p>
          </>
        ) : (
          <>
            <p>{t('weekMilestone')}</p>
            <strong className="milestone-number">
              {finished}/{week.length}
            </strong>
          </>
        )}
      </Card>
      <Card>
        <h2>{t('lastSession')}</h2>
        {last ? (
          <>
            <p className="micro muted">{last.completedAt.slice(0, 10)}</p>
            <div className="stat-grid">
              <div>
                {t('sets')}
                <strong>{sets}</strong>
              </div>
              <div>
                {t('tonnage')}
                <strong>
                  <Weight value={volume} />
                </strong>
              </div>
            </div>
            <Link className="text-link" to="/progress">
              {t('progress')} →
            </Link>
          </>
        ) : (
          <p className="muted">{t('emptyLogsText')}</p>
        )}
      </Card>
    </div>
  );
}
