import { foodServing, diaryTotals } from '../lib/foodLog';
import { CuttingGuide } from '../components/CuttingGuide';
import { Disclosure } from '../components/Disclosure';
import { FoodCatalog } from '../components/FoodCatalog';
import { CalorieNotice } from '../components/CalorieNotice';
import { ProgressRing } from '../components/ProgressRing';
import { useState } from 'react';
import { useMealPlan } from '../lib/useMealPlan';
import { Download, RefreshCw, Trash2 } from 'lucide-react';
import foodsRaw from '../data/foods.json';
import { mealPlan, nutrition, totals, weightTrend, type Portion } from '../lib/nutrition';
import { type Food } from '../lib/schema';
import { replaceWithUndo, update, useProfileStore as useStore } from '../lib/store';
import { dateOffset, today } from '../lib/formulas';
import { download } from '../lib/storage';
import { useDiaryI18n as useI18n } from '../i18n/useDiaryI18n';
import { Card, Empty, Field, Num, PageTitle, Weight } from '../components/ui';
import { NutritionTargetsControls } from '../components/NutritionTargetsControls';
import { NutritionPreferences } from '../components/NutritionPreferences';
const foods = foodsRaw as Food[];
export default function Nutrition() {
  const s = useStore(),
    { t, local } = useI18n(),
    [foodError, setFoodError] = useState(''),
    dayType = s.nutritionDayType,
    [date, setDate] = useState(today()),
    [quickKcal, setQuickKcal] = useState(300),
    [quickProtein, setQuickProtein] = useState(20),
    [seed, setSeed] = useState(0),
    [menuDay, setMenuDay] = useState(0),
    [swapped, setSwapped] = useState<Record<string, Portion[]>>({});
  const target = nutrition(s.profile, dayType),
    logged = s.foodLogs.filter((f) => f.date === date),
    current = diaryTotals(logged);
  const { menu, pending, failed, retry } = useMealPlan(s.profile, seed, dayType);
  const meals = menu?.[menuDay].meals.map((meal, i) => swapped[`${menuDay}-${i}`] ?? meal) ?? [],
    sum = totals(meals.flat()),
    trend = weightTrend(
      s.checkins
        .filter((c) => c.weight !== undefined)
        .map((c) => ({ date: c.date, weight: c.weight! })),
      s.profile,
    );
  const addQuick = () => {
    if (
      !Number.isFinite(quickKcal) ||
      !Number.isFinite(quickProtein) ||
      quickKcal < 0 ||
      quickProtein < 0 ||
      quickKcal > 12000 ||
      quickProtein > 600
    )
      return;
    update({
      foodLogs: [
        ...s.foodLogs,
        {
          id: crypto.randomUUID(),
          date,
          name: t('quickAdd'),
          grams: 0,
          kcal: quickKcal,
          protein: quickProtein,
        },
      ],
    });
  };
  const shopping = () => {
    if (!menu) return;
    const map = new Map<string, { food: Food; grams: number }>();
    menu.forEach((d, di) =>
      d.meals.forEach((meal, mi) =>
        (swapped[`${di}-${mi}`] ?? meal).forEach((p) => {
          const old = map.get(p.food.id);
          map.set(p.food.id, { food: p.food, grams: (old?.grams ?? 0) + p.grams });
        }),
      ),
    );
    download(
      'ironcycle-shopping.txt',
      [
        t('shoppingList'),
        ...Array.from(map.values()).map(
          (p) => `${local(p.food.name)}: ${Math.ceil(p.grams)} ${t('grams')}`,
        ),
        t('foodApprox'),
      ].join('\n'),
      'text/plain;charset=utf-8',
    );
  };
  return (
    <>
      <PageTitle compact title={t('nutrition')} description={t('nutritionTiming')} />
      <NutritionTargetsControls resetMenu={() => setSwapped({})} />
      {!target.deficitAllowed && <CalorieNotice />}
      {target.automaticAllowed && (
        <>
          <div className="nutrition-stats">
            {[
              ['kcal', target.kcal],
              ['protein', target.protein],
              ['fat', target.fat],
              ['carbs', target.carbs],
            ].map(([key, value]) => (
              <Card key={key}>
                <span className="eyebrow">{t(String(key))}</span>
                <strong>
                  {Math.round(Number(value))}
                  <small>{t(key === 'kcal' ? 'kcal' : 'grams')}</small>
                </strong>
              </Card>
            ))}
          </div>
          <div className="notice">
            <span>
              {t('protein')}: {Math.round(target.minProtein)}–{Math.round(target.maxProtein)}{' '}
              {t('grams')} · {t('fiber')}: {Math.round(target.fiber)} {t('grams')} · {t('water')}:{' '}
              {target.water.toFixed(1)}
            </span>
          </div>
        </>
      )}
      <div className="two-columns">
        {target.deficitAllowed && <CalorieNotice />}
        {s.profile.nutritionGoal === 'loss' && target.deficitAllowed && <CuttingGuide />}
        <Card>
          <h2>{t('foodLog')}</h2>
          <Field label={t('day')}>
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
            />
          </Field>
          {target.automaticAllowed && (
            <div className="food-rings">
              {(['kcal', 'protein'] as const).map((key) => (
                <ProgressRing
                  key={key}
                  label={t(key)}
                  value={current[key]}
                  target={key === 'kcal' ? target.kcal : target.protein}
                />
              ))}
            </div>
          )}
          <div className="diary-macros" aria-label={t('foodLog')}>
            {(['kcal', 'protein', 'fat', 'carbs'] as const).map((key) => (
              <div key={key}>
                <span>{t(key)}</span>
                <strong>
                  {current[key] === null ? '—' : Math.round(current[key])}
                  <small> {t(key === 'kcal' ? 'kcal' : 'grams')}</small>
                </strong>
              </div>
            ))}
          </div>
          {(current.fat === null || current.carbs === null) && (
            <p className="micro muted">{t('macrosIncomplete')}</p>
          )}
          <FoodCatalog
            onAdd={(food, grams) => {
              try {
                const entry = foodServing(food, grams, date, local(food.name));
                update({ foodLogs: [...s.foodLogs, entry] });
                setFoodError('');
              } catch {
                setFoodError(t('foodPortionError'));
              }
            }}
          />
          {foodError && <p role="alert">{foodError}</p>}

          <details>
            <summary>{t('quickAdd')}</summary>
            <div className="form-grid">
              <Num label={t('kcal')} value={quickKcal} max={12000} onChange={setQuickKcal} />
              <Num label={t('protein')} value={quickProtein} max={600} onChange={setQuickProtein} />
            </div>
            <button className="button secondary" onClick={addQuick}>
              {t('add')}
            </button>
          </details>
          {logged.length ? (
            logged.map((f) => (
              <div className="food-log-row" key={f.id}>
                <div>
                  <b>{f.name}</b>
                  <small>
                    {Math.round(f.kcal)} {t('kcal')} · {Math.round(f.protein)} {t('grams')}{' '}
                    {t('protein').toLowerCase()} · {t('fat')}{' '}
                    {f.fat === undefined ? '—' : Math.round(f.fat)} · {t('carbs')}{' '}
                    {f.carbs === undefined ? '—' : Math.round(f.carbs)}
                  </small>
                  {f.sourceUrl && (
                    <a
                      className="text-link micro"
                      href={f.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {f.sourceId === 'open-food-facts' ? 'Open Food Facts' : 'USDA'} ·{' '}
                      {f.sourceLicense}
                    </a>
                  )}
                </div>
                <button
                  className="icon-button"
                  aria-label={t('delete') + ' ' + f.name}
                  onClick={() => {
                    if (confirm(t('deleteConfirm')))
                      replaceWithUndo({ ...s, foodLogs: s.foodLogs.filter((x) => x.id !== f.id) });
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <Empty title={t('emptyLogs')} text={t('foodLog')} />
          )}
        </Card>
        <Disclosure label="compactAdvanced">
          <NutritionPreferences key={s.profile.nutritionGoal} />
        </Disclosure>
      </div>
      <Disclosure label="compactMenu">
        {target.automaticAllowed && (
          <Card>
            <div className="section-heading">
              <h2>{t('mealPlan')}</h2>
              <div className="inline">
                <button
                  className="icon-button"
                  aria-label={t('swap')}
                  onClick={() => {
                    setSeed(seed + 7);
                    setSwapped({});
                  }}
                >
                  <RefreshCw size={18} />
                </button>
                <button className="button secondary" disabled={!menu} onClick={shopping}>
                  <Download size={16} />
                  {t('shoppingList')}
                </button>
              </div>
            </div>
            <div className="tabs">
              {Array.from({ length: 7 }, (_, i) => (
                <button
                  className={i === menuDay ? 'active' : ''}
                  onClick={() => setMenuDay(i)}
                  key={i}
                >
                  {t('day')} {i + 1}
                </button>
              ))}
            </div>
            {menu ? (
              <>
                <div className="meal-grid">
                  {meals.map((meal, i) => (
                    <div className="meal-card" key={i}>
                      <div className="section-heading">
                        <h3>
                          {t('meals')} {i + 1}
                        </h3>
                        <button
                          className="icon-button"
                          aria-label={t('swap') + ' ' + (i + 1)}
                          onClick={() => {
                            try {
                              const next = mealPlan(
                                s.profile,
                                foods,
                                seed + menuDay + Math.floor(Math.random() * 100) + 1,
                                dayType,
                              ).meals[i];
                              setSwapped({ ...swapped, [`${menuDay}-${i}`]: next });
                            } catch {
                              setSwapped({});
                            }
                          }}
                        >
                          <RefreshCw size={16} />
                        </button>
                      </div>
                      {meal.map((p) => (
                        <div className="meal-portion" key={p.food.id}>
                          <span>{local(p.food.name)}</span>
                          <b>
                            {Math.round(p.grams)} {t('grams')}
                          </b>
                        </div>
                      ))}
                      <div className="micro muted">
                        {Math.round(totals(meal).kcal)} {t('kcal')} ·{' '}
                        {Math.round(totals(meal).protein)} {t('grams')} {t('protein').toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="muted">
                  Σ {Math.round(sum.kcal)} {t('kcal')} · {t('protein')} {Math.round(sum.protein)} ·{' '}
                  {t('fat')} {Math.round(sum.fat)} · {t('carbs')} {Math.round(sum.carbs)}
                </p>
              </>
            ) : pending ? (
              <p role="status" aria-busy="true">
                {t('loading')}
              </p>
            ) : (
              <div role="alert">
                <p className="notice warning">
                  {t(failed ? 'mealPlanLoadError' : 'dietUnavailable')}
                </p>
                <button className="button secondary" onClick={retry}>
                  {t('retry')}
                </button>
              </div>
            )}
            <p className="micro muted">{t('foodApprox')}</p>
          </Card>
        )}
      </Disclosure>
      <Disclosure label="compactMeasurements">
        <Card>
          <h2>
            {t('bodyTrend')}: <Weight value={trend.mean} />
          </h2>
          {target.automaticAllowed && (
            <p className="muted">{t(trend.pace === 'fast' ? 'fastTrend' : 'slowTrend')}</p>
          )}
          <p className="micro muted">
            BMR {target.bmr} · TDEE {target.tdee} {t('kcal')} · {dateOffset(date, -7)}—{date}
          </p>
          <p>{t('calorieSafety')}</p>
        </Card>
      </Disclosure>
    </>
  );
}
