import { MeasurementInput } from '../components/MeasurementInput';
import { ExperienceField } from '../components/ExperienceField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Info } from 'lucide-react';
import { useProfileStore as useStore, update } from '../lib/store';
import { liftIds, profileSchema, type Lift, type Profile as ProfileType } from '../lib/schema';
import { e1rm, nextMonday, roundTo, strengthLevel } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, Field, Num, PageTitle, Select, Weight } from '../components/ui';
export default function Profile() {
  const s = useStore(),
    { t } = useI18n(),
    navigate = useNavigate();
  const [p, setP] = useState(s.profile),
    [step, setStep] = useState(0),
    [error, setError] = useState(''),
    [estimate, setEstimate] = useState<Lift | null>(null),
    [setWeight, setSetWeight] = useState(60),
    [reps, setReps] = useState(5),
    [rpe, setRpe] = useState(8);
  const change = <K extends keyof ProfileType>(key: K, value: ProfileType[K]) =>
    setP({ ...p, [key]: value });
  const save = () => {
    const parsed = profileSchema.safeParse(p);
    if (!parsed.success) {
      setError(t('invalid') + ' ' + parsed.error.issues.map((x) => x.path.join('.')).join(', '));
      return;
    }
    if (p.start !== nextMonday(p.start)) {
      setError(t('mondayRequired'));
      return;
    }
    update({
      profile: { ...parsed.data, days: p.goal === 'powerlifting' ? 3 : p.days },
      onboarded: true,
      ...(s.profile.goal !== p.goal ? { activeSeries: null } : {}),
    });
    navigate('/');
  };
  const liftChange = (lift: Lift, key: 'current' | 'pr' | 'form', value: number) =>
    setP({ ...p, lifts: { ...p.lifts, [lift]: { ...p.lifts[lift], [key]: value } } });
  return (
    <>
      <PageTitle
        compact
        title={t(s.onboarded ? 'profile' : 'onboarding')}
        description={t('onboardingText')}
      />
      <div className="wizard-steps">
        {[0, 1, 2].map((i) => (
          <button className={step === i ? 'active' : ''} onClick={() => setStep(i)} key={i}>
            <span>{step > i ? <Check size={15} /> : i + 1}</span>
            {t(['profile', 'strengthSummary', 'safety'][i])}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 2) setStep(step + 1);
          else save();
        }}
      >
        <Card>
          {step === 0 && (
            <>
              <h2>{t('profile')}</h2>
              <div className="form-grid">
                <Num
                  label={t('age')}
                  value={p.age}
                  min={18}
                  max={90}
                  onChange={(v) => change('age', v)}
                />
                <MeasurementInput
                  label={t('height')}
                  measure="height"
                  value={p.height}
                  limits={[120, 230]}
                  onChange={(value) => change('height', value ?? NaN)}
                />
                <MeasurementInput
                  label={t('bodyweight')}
                  value={p.weight}
                  limits={[35, 250]}
                  onChange={(value) => change('weight', value ?? NaN)}
                />
                <Select
                  label={t('sex')}
                  value={p.sex}
                  options={['male', 'female'].map((value) => ({ value, label: t(value) }))}
                  onChange={(v) => change('sex', v as ProfileType['sex'])}
                />
                <Num
                  label={t('baselineSleep')}
                  value={p.sleep}
                  min={4}
                  max={12}
                  step={0.5}
                  onChange={(v) => change('sleep', v)}
                />
                <ExperienceField value={p.experience} onChange={(v) => change('experience', v)} />
                <Field label={t('startDate')}>
                  <input
                    type="date"
                    required
                    value={p.start}
                    onChange={(e) => change('start', e.target.value)}
                  />
                </Field>
                <Num
                  label={t('days')}
                  value={p.days}
                  min={2}
                  max={5}
                  onChange={(v) => change('days', v)}
                />
                <Num
                  label={t('minutes')}
                  value={p.minutes}
                  min={30}
                  max={180}
                  step={5}
                  onChange={(v) => change('minutes', v)}
                />
                <Select
                  label={t('equipment')}
                  value={p.equipment}
                  options={['gym', 'limited', 'home'].map((value) => ({ value, label: t(value) }))}
                  onChange={(v) => change('equipment', v as ProfileType['equipment'])}
                />
                <MeasurementInput
                  label={t('planRounding')}
                  value={p.step}
                  limits={[0.25, 10]}
                  onChange={(value) => change('step', value ?? NaN)}
                />
              </div>
              {p.start && p.start !== nextMonday(p.start) && (
                <div className="notice">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => change('start', nextMonday(p.start))}
                  >
                    {t('nextMonday')}: {nextMonday(p.start)}
                  </button>
                </div>
              )}
              <h3>{t('injuries')}</h3>
              <div className="check-grid">
                {['shoulder', 'elbow', 'wrist', 'lowerBack', 'knee', 'hip'].map((key) => (
                  <label className="checkbox-label" key={key}>
                    <input
                      type="checkbox"
                      checked={p.injuries.includes(key)}
                      onChange={(e) =>
                        change(
                          'injuries',
                          e.target.checked
                            ? [...p.injuries, key]
                            : p.injuries.filter((k) => k !== key),
                        )
                      }
                    />
                    {t(key)}
                  </label>
                ))}
              </div>
              <Field label={t('limitations')}>
                <textarea
                  maxLength={1000}
                  value={p.limitations}
                  onChange={(e) => change('limitations', e.target.value)}
                />
              </Field>
            </>
          )}
          {step === 1 && (
            <>
              <h2>{t('strengthSummary')}</h2>
              {['armwrestling', 'arms', 'custom'].includes(p.goal) && (
                <>
                  <p>{t('specialStrength')}</p>
                  <div className="form-grid">
                    {(p.goal === 'arms'
                      ? ['biceps']
                      : ['pronation', 'cup', 'rising', 'side', 'biceps']
                    ).map((key) => (
                      <div key={key}>
                        <h3>{t(key)}</h3>
                        <MeasurementInput
                          label={t('current')}
                          value={p.special[key] ?? 0}
                          limits={[0, 300]}
                          onChange={(v) => change('special', { ...p.special, [key]: v ?? NaN })}
                        />
                        <MeasurementInput
                          label={t('pr')}
                          value={p.specialPr[key] ?? p.special[key] ?? 0}
                          limits={[0, 300]}
                          onChange={(v) => change('specialPr', { ...p.specialPr, [key]: v ?? NaN })}
                        />
                        <Num
                          label={t('form')}
                          value={p.specialForm[key] ?? 1}
                          min={0.8}
                          max={1.05}
                          step={0.01}
                          onChange={(v) => change('specialForm', { ...p.specialForm, [key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              {liftIds.map((lift) => (
                <div className="lift-profile" key={lift}>
                  <h3>{t(lift)}</h3>
                  <div className="form-grid">
                    <MeasurementInput
                      label={t('current')}
                      value={p.lifts[lift].current}
                      limits={[1, 600]}
                      onChange={(v) => liftChange(lift, 'current', v ?? NaN)}
                    />
                    <MeasurementInput
                      label={t('pr')}
                      value={p.lifts[lift].pr}
                      limits={[1, 600]}
                      onChange={(v) => liftChange(lift, 'pr', v ?? NaN)}
                    />
                    <Field label={t('form')} hint={t('formTip')}>
                      <input
                        type="number"
                        value={p.lifts[lift].form}
                        min={0.8}
                        max={1.05}
                        step={0.01}
                        onChange={(e) => liftChange(lift, 'form', Number(e.target.value))}
                      />
                    </Field>
                  </div>
                  <p className="muted">
                    {t('relative')}: {(p.lifts[lift].current / p.weight).toFixed(2)} × BW ·{' '}
                    {t('level' + strengthLevel(p.lifts[lift].current, p.weight, lift))} · Δ{' '}
                    <Weight value={p.lifts[lift].current - p.lifts[lift].pr} />
                  </p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setEstimate(estimate === lift ? null : lift)}
                  >
                    {t('estimate')}
                  </button>
                  {estimate === lift && (
                    <div className="estimate-form">
                      <MeasurementInput
                        label={t('weight')}
                        value={setWeight}
                        limits={[0, 600]}
                        onChange={(v) => setSetWeight(v ?? 0)}
                      />
                      <Num label={t('reps')} value={reps} min={1} max={10} onChange={setReps} />
                      <Num label="RPE" value={rpe} min={6} max={10} step={0.5} onChange={setRpe} />
                      <button
                        type="button"
                        className="button secondary"
                        disabled={e1rm(setWeight, reps, rpe) === null}
                        onClick={() => {
                          const n = e1rm(setWeight, reps, rpe);
                          if (n) {
                            liftChange(lift, 'current', roundTo(n, p.step));
                            setEstimate(null);
                          }
                        }}
                      >
                        {t('applyEstimate')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <p className="notice">
                <Info size={18} />
                {t('ceiling')}
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <h2>{t('safety')}</h2>

              <p className="notice">
                {t('localOnly')} · {t('autoSaved')}
              </p>
              <div className="summary-total">
                <span>{t('total')}</span>
                <strong>
                  <Weight value={liftIds.reduce((n, l) => n + p.lifts[l].current, 0)} />
                </strong>
              </div>
            </>
          )}
        </Card>
        {error && (
          <p className="notice danger" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          {s.onboarded && (
            <button type="button" className="button" onClick={save}>
              {t('save')}
            </button>
          )}
          {!s.onboarded && (
            <button type="button" className="text-button" onClick={() => navigate('/')}>
              {t('skipLater')}
            </button>
          )}
          {step > 0 && (
            <button type="button" className="button secondary" onClick={() => setStep(step - 1)}>
              {t('back')}
            </button>
          )}
          <button type="submit" className="button">
            {t(step === 2 ? 'finish' : 'next')}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </>
  );
}
