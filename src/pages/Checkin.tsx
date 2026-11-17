import { AlgorithmChip } from '../components/ContextNotice';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { dailyReadiness } from '../lib/dailyReadiness';
import { useState } from 'react';
import { HeartPulse, Check } from 'lucide-react';
import { update, useProfileStore as useStore } from '../lib/store';
import { checkinSchema, type Checkin as CheckinType } from '../lib/schema';
import { dateOffset, today, displayWeight, fromWeight } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, Field, Num, PageTitle, Select } from '../components/ui';
export default function Checkin() {
  const [params] = useSearchParams();
  const requestedDate = z.iso.date().safeParse(params.get('date'));
  const s = useStore(),
    { t, units, weightUnit } = useI18n(),
    [date, setDate] = useState(requestedDate.success ? requestedDate.data : today()),
    [saved, setSaved] = useState(false),
    [error, setError] = useState('');
  const previous = s.foodLogs.filter((f) => f.date === dateOffset(date, -1));
  const defaults: CheckinType = {
    date,
    sleep: s.profile.sleep,
    pain: 'none',
    location: '',
    speed: 'normal',
    dizziness: false,
    weakness: false,
    worsening: false,
    ...(previous.length
      ? {
          calories: previous.reduce((n, f) => n + f.kcal, 0),
          protein: previous.reduce((n, f) => n + f.protein, 0),
        }
      : {}),
  };
  const [c, setC] = useState<CheckinType>(s.checkins.find((x) => x.date === date) ?? defaults);
  const change = <K extends keyof CheckinType>(key: K, value: CheckinType[K]) => {
    setC({ ...c, [key]: typeof value === 'number' && Number.isNaN(value) ? undefined : value });
    setSaved(false);
  };
  const valid = checkinSchema.safeParse(c),
    r = valid.success ? dailyReadiness(valid.data, s.profile, s.checkins, s.foodLogs) : null;
  return (
    <>
      <PageTitle
        title={t('checkin')}
        description={t('checkinText')}
        action={
          <button className="button" form="checkin-form" type="submit">
            {t(saved ? 'saved' : 'save')}
          </button>
        }
      />
      <p className="notice warning">{t('emergencyHelp')}</p>
      <div className="checkin-layout">
        <form
          id="checkin-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid.success) {
              setError(t('invalid'));
              return;
            }
            update({
              checkins: [...s.checkins.filter((x) => x.date !== date), valid.data].sort((a, b) =>
                a.date.localeCompare(b.date),
              ),
            });
            setSaved(true);
            setError('');
          }}
        >
          <Card>
            <div className="form-grid">
              <Field label={t('day')}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const d = e.target.value;
                    if (!d) return;
                    setDate(d);
                    setC(s.checkins.find((x) => x.date === d) ?? { ...defaults, date: d });
                    setSaved(false);
                  }}
                />
              </Field>
              <Num
                label={t('sleep') + ' (' + t('hours') + ')'}
                value={c.sleep}
                min={0}
                max={16}
                step={0.25}
                onChange={(v) => change('sleep', v)}
              />
            </div>
            <Num
              label={t('painScore')}
              value={c.painScore ?? 0}
              min={0}
              max={10}
              onChange={(v) => change('painScore', v)}
            />
            <div className="rating-fields">
              {(['quality', 'recovery', 'soreness', 'stress', 'mood'] as const).map((key) => (
                <fieldset key={key}>
                  <legend>{t(key === 'recovery' ? 'subjective' : key)}</legend>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        aria-pressed={c[key] === n}
                        className={c[key] === n ? 'active' : ''}
                        onClick={() => change(key, c[key] === n ? undefined : n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="form-grid">
              {(['calories', 'protein', 'carbs', 'water', 'weight'] as const).map((key) => (
                <Num
                  key={key}
                  required={false}
                  label={
                    t(
                      key === 'calories'
                        ? 'caloriesYesterday'
                        : key === 'protein'
                          ? 'proteinYesterday'
                          : key === 'weight'
                            ? 'bodyweight'
                            : key,
                    ) + (key === 'weight' ? ' (' + weightUnit + ')' : '')
                  }
                  value={
                    key === 'weight' && c.weight !== undefined
                      ? displayWeight(c.weight, units)
                      : c[key]
                  }
                  min={key === 'weight' ? (units === 'metric' ? 35 : 77) : 0}
                  max={
                    {
                      calories: 12000,
                      protein: 600,
                      carbs: 1500,
                      water: 12,
                      weight: units === 'metric' ? 250 : 551,
                    }[key]
                  }
                  step={key === 'water' || key === 'weight' ? 0.1 : 1}
                  onChange={(v) => change(key, key === 'weight' ? fromWeight(v, units) : v)}
                />
              ))}
              <Select
                label={t('pain')}
                value={c.pain}
                options={['none', 'mild', 'sharp'].map((value) => ({ value, label: t(value) }))}
                onChange={(v) => change('pain', v as CheckinType['pain'])}
              />
              <Select
                label={t('speed')}
                value={c.speed}
                options={['fast', 'normal', 'slow'].map((value) => ({ value, label: t(value) }))}
                onChange={(v) => change('speed', v as CheckinType['speed'])}
              />
              <Field label={t('location')}>
                <input
                  maxLength={200}
                  value={c.location}
                  onChange={(e) => change('location', e.target.value)}
                />
              </Field>
            </div>
            <div className="check-grid">
              {(
                [
                  'meal',
                  'dizziness',
                  'weakness',
                  'worsening',
                  'numbness',
                  'swelling',
                  'chestPain',
                ] as const
              ).map((key) => (
                <label className="checkbox-label" key={key}>
                  <input
                    type="checkbox"
                    checked={c[key] ?? false}
                    onChange={(e) => change(key, e.target.checked)}
                  />
                  {t(key)}
                </label>
              ))}
            </div>
            {error && (
              <p role="alert" className="danger">
                {error}
              </p>
            )}
            <button className="button" type="submit">
              {saved ? <Check size={18} /> : <HeartPulse size={18} />} {t(saved ? 'saved' : 'save')}
            </button>
          </Card>
        </form>
        <div>
          <Card className="sticky-card">
            <h2>{t('readiness')}</h2>
            {r && (
              <>
                <div className={'score ' + r.level}>
                  {r.score}
                  <small>/100</small>
                </div>
                <h3 className={r.level}>{t(r.level)}</h3>
                <p>{t(r.level + 'Text')}</p>
                {r.reasons.map((reason) => (
                  <p className="notice warning" key={reason}>
                    {t(reason)}
                  </p>
                ))}
                <details>
                  <summary>{t('breakdown')}</summary>
                  {Object.entries(r.parts).map(([key, value]) => (
                    <div className="breakdown-row" key={key}>
                      <span>{t(key === 'recovery' ? 'subjective' : key)}</span>
                      <b>{value.toFixed(1)}</b>
                    </div>
                  ))}
                </details>
              </>
            )}
            <AlgorithmChip />
          </Card>
        </div>
      </div>
    </>
  );
}
