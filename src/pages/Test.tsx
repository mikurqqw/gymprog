import { MeasurementInput } from '../components/MeasurementInput';
import { ContextNotice } from '../components/ContextNotice';
import { UnassessedStrength } from '../components/UnassessedStrength';
import { maxTestingAllowed } from '../lib/injuries';
import { Warmup } from '../components/Warmup';
import { dailyReadiness } from '../lib/dailyReadiness';
import { useState } from 'react';
import { useProfileStore as useStore, update, replaceWithUndo, startRest } from '../lib/store';
import { liftIds } from '../lib/schema';
import { nextAttempt, type Attempt } from '../lib/testAttempts';
import { dateOffset, nextMonday } from '../lib/formulas';
import { useI18n } from '../i18n';
import { Card, Field, Num, PageTitle, Weight } from '../components/ui';
export default function Test() {
  const s = useStore(),
    { t } = useI18n(),
    [safe, setSafe] = useState(false),
    [skipped, setSkipped] = useState<string[]>([]),
    date = s.shifts['8-2'] ?? dateOffset(s.profile.start, 53),
    recovery = s.shifts['8-1'] ?? dateOffset(s.profile.start, 51),
    c = s.checkins.find((c) => c.date === date),
    r = c ? dailyReadiness(c, s.profile, s.checkins, s.foodLogs) : null,
    blocked = r?.level === 'orange' || r?.level === 'red' || !maxTestingAllowed(s.profile, c),
    spacing = date >= dateOffset(recovery, 2);
  const store = (lift: string, attempts: Attempt[]) =>
    update({ attempts: { ...s.attempts, [lift]: attempts } });
  const best = (lift: string) =>
    Math.max(0, ...(s.attempts[lift] ?? []).filter((a) => a.success).map((a) => a.weight));
  if (Object.values(s.profile.strengthAssessment).includes('unknown'))
    return (
      <>
        <PageTitle title={t('test')} />
        <UnassessedStrength />
      </>
    );
  return (
    <>
      <PageTitle title={t('test')} description={t('testSpacing')} />
      <Card>
        <ContextNotice kind="maxTest" />
        <label className="checkbox-label">
          <input type="checkbox" checked={safe} onChange={(e) => setSafe(e.target.checked)} />
          {t('safety')}
        </label>
        <Field label={t('testDate')}>
          <input
            type="date"
            min={dateOffset(recovery, 2)}
            value={date}
            onChange={(e) =>
              e.target.value && update({ shifts: { ...s.shifts, '8-2': e.target.value } })
            }
          />
        </Field>
        {!spacing && <p className="notice danger">{t('testSpacing')}</p>}
        {blocked && <p className="notice danger">{t('testBlocked')}</p>}
        {!c && <p className="notice warning">{t('noCheckin')}</p>}
      </Card>
      {liftIds.map((lift) => {
        const attempts = s.attempts[lift] ?? [],
          suggestion = nextAttempt(
            s.profile.lifts[lift].current,
            s.profile.step,
            attempts,
            !blocked,
          ),
          count = attempts.length;
        return (
          <Card key={lift}>
            <div className="section-heading">
              <h2>{t(lift)}</h2>
              <button
                className="button secondary"
                onClick={() =>
                  setSkipped(
                    skipped.includes(lift) ? skipped.filter((x) => x !== lift) : [...skipped, lift],
                  )
                }
              >
                {t(skipped.includes(lift) ? 'planned' : 'skip')}
              </button>
            </div>
            {!skipped.includes(lift) && (
              <>
                <Warmup lift={lift} ceiling={s.profile.lifts[lift].current * 0.9} />
                {attempts.map((a, i) => (
                  <div className="attempt-row" key={i}>
                    <strong>
                      {t('attempt')} {i + 1}
                    </strong>
                    <MeasurementInput
                      label={t('weight')}
                      value={a.weight}
                      limits={[1, 800]}
                      onChange={(weight) => {
                        if (
                          weight === null ||
                          !Number.isFinite(weight) ||
                          weight <= 0 ||
                          weight > 800
                        )
                          return;
                        store(
                          lift,
                          attempts.map((x, j) =>
                            i === j
                              ? { ...x, weight, success: null }
                              : j > i
                                ? { ...x, success: null }
                                : x,
                          ),
                        );
                      }}
                    />
                    <Num
                      label="RPE"
                      value={a.rpe}
                      min={1}
                      max={10}
                      step={0.5}
                      onChange={(v) => {
                        if (v >= 1 && v <= 10)
                          store(
                            lift,
                            attempts.map((x, j) => (i === j ? { ...x, rpe: v } : x)),
                          );
                      }}
                    />
                    <div className="inline">
                      <button
                        disabled={!safe || blocked || !spacing}
                        className={'button ' + (a.success === true ? '' : 'secondary')}
                        onClick={() => {
                          store(
                            lift,
                            attempts.map((x, j) => (i === j ? { ...x, success: true } : x)),
                          );
                          startRest(6);
                        }}
                      >
                        {t('success')}
                      </button>
                      <button
                        disabled={!safe || blocked || !spacing}
                        className={
                          'button ' + (a.success === false ? 'danger-button' : 'secondary')
                        }
                        onClick={() => {
                          store(
                            lift,
                            attempts
                              .slice(0, i + 1)
                              .map((x, j) => (i === j ? { ...x, success: false } : x)),
                          );
                          startRest(6);
                        }}
                      >
                        {t('failure')}
                      </button>
                    </div>
                  </div>
                ))}
                {attempts.some((a) => a.success === false || a.rpe >= 9) && (
                  <p className="notice warning">{t('testWarning')}</p>
                )}
                {count < 3 && suggestion !== null && (
                  <button
                    className="button secondary"
                    disabled={
                      !safe || blocked || !spacing || (count === 2 && attempts[1]?.success !== true)
                    }
                    onClick={() =>
                      store(lift, [...attempts, { weight: suggestion, rpe: 8, success: null }])
                    }
                  >
                    {t('attempt')} {count + 1}: <Weight value={suggestion} />
                  </button>
                )}
                <div className="stat-grid">
                  <div>
                    {t('best')}
                    <strong>
                      <Weight value={best(lift)} />
                    </strong>
                  </div>
                  <div>
                    Δ {t('current')}
                    <strong>
                      {best(lift) ? (
                        <Weight value={best(lift) - s.profile.lifts[lift].current} />
                      ) : (
                        '—'
                      )}
                    </strong>
                  </div>
                  <div>
                    Δ {t('pr')}
                    <strong>
                      {best(lift) ? <Weight value={best(lift) - s.profile.lifts[lift].pr} /> : '—'}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </Card>
        );
      })}
      <Card>
        <div className="section-heading">
          <h2>{t('total')}</h2>
          <strong className="large">
            <Weight value={liftIds.reduce((n, l) => n + best(l), 0)} />
          </strong>
        </div>
        <button
          className="button"
          disabled={!liftIds.some((l) => best(l) > 0)}
          onClick={() => {
            if (!confirm(t('carryConfirm'))) return;
            const lifts = { ...s.profile.lifts };
            liftIds.forEach((l) => {
              if (best(l) > 0)
                lifts[l] = { current: best(l), pr: Math.max(best(l), lifts[l].pr), form: 1 };
            });
            replaceWithUndo({
              ...s,
              profile: { ...s.profile, lifts, start: nextMonday(dateOffset(date, 3)) },
              logs: [],
              checkins: [],
              attempts: {},
              adjustments: {},
              shifts: {},
              swaps: {},
              week: 1,
              day: 0,
            });
          }}
        >
          {t('carryCycle')}
        </button>
      </Card>
    </>
  );
}
