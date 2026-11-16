import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useProfileStore as useStore, replaceWithUndo } from '../lib/store';
import { demoData } from '../lib/demo';
import { forecast } from '../lib/forecast';
import { dateOffset, displayWeight } from '../lib/formulas';
import { generate } from '../lib/program';
import { dailyAnalytics, weeklyTonnage, plateauCauses } from '../lib/analytics';
import { liftIds } from '../lib/schema';
import { useI18n } from '../i18n';
import { Card, Empty, PageTitle, Weight } from '../components/ui';
export default function Progress() {
  const s = useStore(),
    { t, units } = useI18n(),
    [metric, setMetric] = useState(
      ['armwrestling', 'arms'].includes(s.profile.goal) ? 'specialMetrics' : 'e1rm',
    ),
    rows = generate(s.profile),
    logs = s.logs.filter((l) => l.status !== 'skipped' && l.sets.some(Boolean)),
    adherence = logs.length
      ? Math.min(
          1,
          logs.length /
            Math.max(
              1,
              rows.filter(
                (r) =>
                  r.date <=
                  logs
                    .map((l) => l.date)
                    .sort()
                    .at(-1)!,
              ).length,
            ),
        )
      : 1,
    f = forecast(s.profile, logs, adherence, s.checkins);
  const data = dailyAnalytics(s.profile, logs, s.checkins, s.foodLogs, units),
    weekly = weeklyTonnage(s.profile, logs, units),
    causes = plateauCauses(s.profile, logs, s.checkins);
  const metrics: Record<string, string[]> = {
    specialMetrics: ['pronation', 'cup', 'rising', 'side', 'biceps'],
    e1rm: ['squat', 'bench', 'deadlift'],
    planned: ['planned', 'actual'],
    tonnage: ['tonnage'],
    averageRpe: ['averageRpe'],
    sleep: ['sleep'],
    readiness: ['readiness'],
    bodyweight: ['bodyweight'],
    nutrition: ['calories', 'protein'],
    total: ['total'],
  };
  const forecastData = Array.from({ length: 9 }, (_, w) => ({
    week: w,
    ...Object.fromEntries(
      f.lifts.flatMap((l) => [
        [l.lift, displayWeight(l.current + ((l.realistic - l.current) * w) / 8, units)],
        [
          l.lift + 'Range',
          [
            displayWeight(l.current + ((l.low - l.current) * w) / 8, units),
            displayWeight(l.current + ((l.high - l.current) * w) / 8, units),
          ],
        ],
      ]),
    ),
  }));
  const colors = ['#b6dc67', '#93bde8', '#e5a876', '#c9a6de', '#7bc6b1'];
  return (
    <>
      <PageTitle
        title={t('progress')}
        description={t('forecastDisclaimer')}
        action={
          <button
            className="button secondary"
            onClick={() => {
              if (confirm(t('demoConfirm'))) replaceWithUndo({ ...s, ...demoData(s) });
            }}
          >
            {t('loadDemo')}
          </button>
        }
      />
      <Card>
        <div className="section-heading">
          <h2>{t('progress')}</h2>
          <label className="sr-only" htmlFor="metric">
            {t('progress')}
          </label>
          <select id="metric" value={metric} onChange={(e) => setMetric(e.target.value)}>
            {Object.keys(metrics).map((key) => (
              <option key={key} value={key}>
                {t(key)}
              </option>
            ))}
          </select>
        </div>
        {data.length ? (
          <div className="chart" role="img" aria-label={t(metric)}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metric === 'tonnage' ? weekly : data}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--muted)', fontSize: 10 }}
                  tickFormatter={(d) => String(d).slice(5)}
                />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} width={45} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                  }}
                />
                <Legend />
                {metrics[metric].map((key, i) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={t(key)}
                    stroke={colors[i]}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    connectNulls={false}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Empty title={t('emptyLogs')} text={t('emptyLogsText')} />
        )}
        <details>
          <summary>{t('actual')}</summary>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t('day')}</th>
                  {metrics[metric].map((k) => (
                    <th key={k}>{t(k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.date}>
                    <td>{row.date}</td>
                    {metrics[metric].map((k) => (
                      <td key={k}>{String(row[k as keyof typeof row] ?? '—')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Card>
      <Card>
        <div className="section-heading">
          <h2>{t('forecast')}</h2>
          <span className="pill">{dateOffset(s.profile.start, 53)}</span>
        </div>
        <div className="chart" role="img" aria-label={t('forecast')}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
              <YAxis width={45} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              />
              {liftIds.flatMap((lift, i) => [
                <Area
                  key={lift + 'Range'}
                  dataKey={lift + 'Range'}
                  name={t(lift) + ' ±'}
                  fill={colors[i]}
                  fillOpacity={0.09}
                  stroke="none"
                  isAnimationActive={false}
                />,
                <Area
                  key={lift}
                  dataKey={lift}
                  name={t(lift)}
                  fill="transparent"
                  stroke={colors[i]}
                  strokeWidth={2}
                  isAnimationActive={false}
                />,
              ])}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t('library')}</th>
                <th>{t('current')}</th>
                <th>{t('conservative')}</th>
                <th>{t('realistic')}</th>
                <th>{t('optimistic')}</th>
              </tr>
            </thead>
            <tbody>
              {f.lifts.map((l) => (
                <tr key={l.lift}>
                  <td>{t(l.lift)}</td>
                  {[l.current, l.low, l.realistic, l.high].map((v, i) => (
                    <td key={i}>
                      <Weight value={v} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td>{t('total')}</td>
                <td>
                  <Weight value={f.lifts.reduce((n, l) => n + l.current, 0)} />
                </td>
                <td>
                  <Weight value={f.lifts.reduce((n, l) => n + l.low, 0)} />
                </td>
                <td>
                  <Weight value={f.total} />
                </td>
                <td>
                  <Weight value={f.lifts.reduce((n, l) => n + l.high, 0)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          {t('bodyweight')}: <Weight value={f.bodyweight} /> (
          {f.bodyRange.map((n) => displayWeight(n, units)).join('–')})
        </p>
        <details>
          <summary>{t('assumptions')}</summary>
          <p>
            {t('monthly')}: {(f.monthly * 100).toFixed(2)}% · {t('sleep')}: {s.profile.sleep} ·{' '}
            {t('adherence')}: {Math.round(f.adherence * 100)}%
          </p>
          <p>{t('forecastDisclaimer')}</p>
        </details>
      </Card>
      <div className="two-columns">
        <Card>
          <h2>{t('nearestGoal')}</h2>
          {f.lifts
            .filter((l) => l.pr > l.current)
            .map((l) => (
              <p key={l.lift}>
                {t(l.lift)}: <Weight value={l.current} /> →{' '}
                <b>
                  <Weight value={l.pr} />
                </b>
              </p>
            ))}
        </Card>
        <Card>
          <h2>{t('plateau')}</h2>
          {logs.length ? (
            causes.map((c) => (
              <p className="muted" key={c.key}>
                {t(c.key)}: <b>{c.value.toFixed(1)}</b>
              </p>
            ))
          ) : (
            <p className="muted">{t('reviewText')}</p>
          )}
        </Card>
      </div>
    </>
  );
}
