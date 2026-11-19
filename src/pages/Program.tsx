import { Disclosure } from '../components/Disclosure';
import { ContextNotice } from '../components/ContextNotice';
import { ProgramEvidence } from '../components/ProgramEvidence';
import { formatDate } from '../lib/formulas';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp } from 'lucide-react';
import { update, useProfileStore as useStore } from '../lib/store';
import { generate } from '../lib/plannedProgram';
import { exerciseById } from '../lib/program';
import { useI18n } from '../i18n';
import { Card, PageTitle, Weight } from '../components/ui';
import { WeekSelector } from '../components/WeekSelector';
import { WeeklyReview } from '../components/WeeklyReview';
import { SeriesLinks } from '../components/SeriesLinks';
export default function Program() {
  const s = useStore(),
    { t, local, locale } = useI18n(),
    rows = generate(s.profile, s.adjustments, s.shifts, s.swaps, s.customProgram).filter(
      (r) => r.week === s.week,
    );
  return (
    <>
      <PageTitle
        compact
        title={t('program')}
        description={t('ceiling')}
        action={
          <Link className="button secondary" to="/builder">
            {t('builder')}
          </Link>
        }
      />
      <ContextNotice kind="program" />
      <SeriesLinks goal={s.profile.goal} />
      <WeekSelector />
      <div className="section-heading">
        <h2>
          {t('week')} {s.week} <span className="muted">/ {t('phase' + (s.week - 1))}</span>
        </h2>
        <span className="pill">{t(s.profile.goal)}</span>
      </div>
      <div className="program-sessions">
        {[...new Set(rows.map((r) => r.day))].map((day) => {
          const lines = rows.filter((r) => r.day === day);
          return (
            <Card key={day}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    {formatDate(lines[0].date, locale, {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  <h2>
                    {t('session')} {day + 1}
                  </h2>
                </div>
                <Link
                  to={
                    s.profile.goal === 'powerlifting' && s.week === 8 && day === 2
                      ? '/test'
                      : '/workout'
                  }
                  onClick={() => update({ day })}
                  className="button secondary"
                >
                  {t('startWorkout')}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <label className="shift-field">
                <span>{t('shift')}</span>
                <input
                  aria-label={t('shift') + ' ' + (day + 1)}
                  type="date"
                  value={lines[0].date}
                  onChange={(e) =>
                    e.target.value &&
                    update({ shifts: { ...s.shifts, [`${s.week}-${day}`]: e.target.value } })
                  }
                />
              </label>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>{t('library')}</th>
                      <th>
                        {t('sets')} × {t('reps')}
                      </th>
                      <th>{t('weight')}</th>
                      <th>RPE ≤</th>
                      <th>{t('rest')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className={'mode mode-' + r.mode}>{t(r.mode)}</span>
                          <Link to={'/library?exercise=' + r.exercise}>
                            {local(exerciseById(r.exercise).name)}
                          </Link>
                          <span className="hint" title={local(r.tip)}>
                            <CircleHelp size={14} />
                          </span>
                        </td>
                        <td>
                          {r.sets} × {r.reps}
                        </td>
                        <td>
                          {r.weight === null ? (
                            <span className="muted">{t('manualLoad')}</span>
                          ) : (
                            <>
                              <b>
                                <Weight value={r.weight} />
                              </b>
                              <small className="muted">
                                {' '}
                                {Math.round((r.percent ?? 0) * 100)}%
                              </small>
                            </>
                          )}
                        </td>
                        <td>{r.rpe}</td>
                        <td>
                          {r.rest} {t('min')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>
      <Disclosure label="compactSources">
        <WeeklyReview rows={rows} />
        <ProgramEvidence goal={s.profile.goal} />
      </Disclosure>
    </>
  );
}
