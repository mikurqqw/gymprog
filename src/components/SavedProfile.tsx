import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore, update } from '../lib/store';
import { profileSchema, type Profile } from '../lib/schema';
import { displayWeight, fromWeight, nextMonday } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, Num, Select, PageTitle } from './ui';
import { ExperienceField } from './ExperienceField';
export function SavedProfile() {
  const state = useProfileStore(),
    { t, units, weightUnit } = useI18n();
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
      <form
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
            <Num
              label={t('height') + ' (' + t(units === 'metric' ? 'cm' : 'in') + ')'}
              value={Math.round((profile.height / (units === 'metric' ? 1 : 2.54)) * 10) / 10}
              min={units === 'metric' ? 120 : 47}
              max={units === 'metric' ? 230 : 91}
              step={0.1}
              onChange={(value) => change('height', value * (units === 'metric' ? 1 : 2.54))}
            />
            <Num
              label={t('bodyweight') + ' (' + weightUnit + ')'}
              value={displayWeight(profile.weight, units)}
              min={units === 'metric' ? 35 : 77}
              max={units === 'metric' ? 250 : 551}
              step={0.1}
              onChange={(value) => change('weight', fromWeight(value, units))}
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
          <Link className="button secondary" to="/profile?advanced=1">
            {t('compactAdvanced')}
          </Link>
        </div>
      </form>
    </>
  );
}
