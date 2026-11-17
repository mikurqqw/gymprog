import { checkinDraft } from '../lib/checkinDraft';
import { CheckinRecoveryFields } from '../components/CheckinRecoveryFields';
import { CheckinSafetyFields } from '../components/CheckinSafetyFields';
import { CheckinMeasurements } from '../components/CheckinMeasurements';
import { Disclosure } from '../components/Disclosure';
import { AlgorithmChip } from '../components/ContextNotice';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { dailyReadiness } from '../lib/dailyReadiness';
import { useState } from 'react';
import { HeartPulse, Check } from 'lucide-react';
import { update, useProfileStore as useStore } from '../lib/store';
import { checkinSchema, type Checkin as CheckinType } from '../lib/schema';
import { today } from '../lib/formulas';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Card, Field, Num, PageTitle } from '../components/ui';
export default function Checkin() {
  const [params] = useSearchParams();
  const requestedDate = z.iso.date().safeParse(params.get('date'));
  const s = useStore(),
    { t } = useI18n(),
    [date, setDate] = useState(requestedDate.success ? requestedDate.data : today()),
    [saved, setSaved] = useState(false),
    [error, setError] = useState('');
  const defaults = (day: string) => checkinDraft(day, s.profile, s.foodLogs);
  const [c, setC] = useState<CheckinType>(
    s.checkins.find((x) => x.date === date) ?? defaults(date),
  );
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
                    setC(s.checkins.find((x) => x.date === d) ?? defaults(d));
                    setSaved(false);
                  }}
                />
              </Field>
            </div>
            <CheckinRecoveryFields value={c} change={change} />
            <Disclosure label="recoveryHours" title={t('recoveryHours')}>
              <Num
                label={t('sleep') + ' (' + t('hours') + ')'}
                value={c.sleep}
                min={0}
                max={16}
                step={0.25}
                onChange={(v) => change('sleep', v)}
              />
            </Disclosure>
            <CheckinSafetyFields value={c} change={change} />
            <Disclosure label="recoveryExact" title={t('recoveryExact')}>
              <Num
                label={t('painScore')}
                value={c.painScore ?? 0}
                min={0}
                max={10}
                onChange={(v) => change('painScore', v)}
              />
            </Disclosure>
            <CheckinMeasurements value={c} change={change} />
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
