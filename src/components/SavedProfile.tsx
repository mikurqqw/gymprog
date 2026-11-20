import { MeasurementInput } from './MeasurementInput';
import { useState } from 'react';
import { useProfileStore, update } from '../lib/store';
import { profileSchema, type Profile } from '../lib/schema';
import { nextMonday } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, Num, Select, PageTitle } from './ui';
import { ExperienceField } from './ExperienceField';
import { TrainingPreferencesCard } from './TrainingPreferencesCard';
export function SavedProfile({ trainingFirst = false }: { trainingFirst?: boolean }) {
  const state = useProfileStore(),
    { t } = useI18n();
  const [profile, setProfile] = useState(state.profile),
    [message, setMessage] = useState(''),
    [error, setError] = useState('');
  const change = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile({ ...profile, [key]: value });
    setMessage('');
    setError('');
  };
  return (
    <>
      <PageTitle compact title={t('profile')} description={t('onboardingText')} />
      {trainingFirst && <TrainingPreferencesCard />}
      <form
        className="basic-profile-form"
        onSubmit={(event) => {
          event.preventDefault();
          const result = profileSchema.safeParse({
            ...state.profile,
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            sex: profile.sex,
            experience: profile.experience,
          });
          if (!result.success) {
            setError(t('invalid'));
            return;
          }
          if (result.data.start !== nextMonday(result.data.start)) {
            setError(t('mondayRequired'));
            return;
          }
          update({ profile: result.data });
          setMessage(t('saved'));
          setError('');
        }}
      >
        <Card>
          <div className="form-grid">
            <Num
              label={t('age')}
              value={profile.age}
              min={18}
              max={90}
              onChange={(value) => change('age', value)}
            />
            <MeasurementInput
              label={t('height')}
              measure="height"
              value={profile.height}
              limits={[120, 230]}
              onChange={(value) => change('height', value ?? NaN)}
            />
            <MeasurementInput
              label={t('bodyweight')}
              value={profile.weight}
              limits={[35, 250]}
              onChange={(value) => change('weight', value ?? NaN)}
            />
            <Select
              label={t('sex')}
              value={profile.sex}
              options={['male', 'female'].map((value) => ({ value, label: t(value) }))}
              onChange={(value) => change('sex', value as Profile['sex'])}
            />
            <ExperienceField
              value={profile.experience}
              onChange={(value) => change('experience', value)}
            />
          </div>
        </Card>
        {error && (
          <p className="notice danger" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="notice">
            {message}
          </p>
        )}
        <div className="form-actions">
          <button className="button" type="submit">
            {t('save')}
          </button>
        </div>
      </form>
      {!trainingFirst && <TrainingPreferencesCard />}
    </>
  );
}
