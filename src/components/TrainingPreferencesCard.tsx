import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import { activeSeriesRun } from '../lib/activeSeries';
import { seriesId, seriesIds } from '../lib/fitSeries';
import { update, useProfileStore } from '../lib/store';
import { Card, Select } from './ui';
import { useState } from 'react';

export function TrainingPreferencesCard() {
  const state = useProfileStore();
  const { t, language } = useI18n();
  const current = activeSeriesRun(state);
  const [choice, setChoice] = useState<string>(current?.program ?? '');
  const navigate = useNavigate();
  const hasRun = state.seriesRuns.some((run) => run.program === choice);
  return (
    <Card className="training-preferences">
      <h2>{t('chooseTrainingPlan')}</h2>
      <p className="muted">
        {t('currentTrainingPlan')} ·{' '}
        {current ? seriesStrings[current.program][language] : t(state.profile.goal)}
      </p>
      <Select
        label={t('program')}
        value={choice}
        options={[
          { value: '', label: t(state.profile.goal) + ' · ' + t('baseTrainingPlan') },
          ...seriesIds.map((value) => ({ value, label: seriesStrings[value][language] })),
        ]}
        onChange={setChoice}
      />
      <div className="inline">
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            if (!choice) {
              update({ activeSeries: null });
              navigate('/program');
              return;
            }
            const result = seriesId.safeParse(choice);
            if (!result.success) return;
            if (hasRun) update({ activeSeries: result.data });
            navigate('/series/' + result.data);
          }}
        >
          {t(choice && !hasRun ? 'chooseCycleVariant' : 'openTrainingPlan')}
        </button>
        <Link className="text-link" to="/profile?advanced=1">
          {t('simpleEditTraining')} →
        </Link>
      </div>
    </Card>
  );
}
