import { useEffect, useRef, useState } from 'react';
import type { FoodRecord } from '../lib/foodSchema';
import { FoodSearchError, searchRemoteFood } from '../lib/remoteFoodSearch';
import { useDiaryI18n } from '../i18n/useDiaryI18n';
import { FoodFacts } from './FoodFacts';
import { Num, Select } from './ui';
export function OnlineFoodSearch({
  query,
  onAdd,
}: {
  query: string;
  onAdd: (food: FoodRecord, grams: number) => void;
}) {
  const { t, local } = useDiaryI18n(),
    controller = useRef<AbortController | null>(null),
    [pending, setPending] = useState(false),
    [foods, setFoods] = useState<FoodRecord[]>([]),
    [selected, setSelected] = useState(''),
    [grams, setGrams] = useState(100),
    [error, setError] = useState(''),
    [searched, setSearched] = useState(false);
  useEffect(() => () => controller.current?.abort(), []);
  const food = foods.find((f) => f.id === selected) ?? foods[0];
  const search = async () => {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setPending(true);
    setError('');
    setFoods([]);
    setSearched(false);
    try {
      const result = await searchRemoteFood(query, active.signal, __LEGAL_PREVIEW__);
      if (!active.signal.aborted) {
        setFoods(result);
        setSearched(true);
        setSelected(result[0]?.id ?? '');
      }
    } catch (cause) {
      if (!active.signal.aborted)
        setError(
          t(
            cause instanceof FoodSearchError && cause.reason === 'limit'
              ? 'onlineFoodLimit'
              : cause instanceof FoodSearchError && cause.reason === 'invalid'
                ? 'onlineFoodQuery'
                : 'onlineFoodError',
          ),
        );
    } finally {
      if (!active.signal.aborted) setPending(false);
    }
  };
  return (
    <section className="online-food-search" aria-label={t('onlineFoodResult')}>
      <button
        type="button"
        className="button secondary"
        disabled={pending || query.trim().length < 2 || query.trim().length > 80}
        onClick={() => void search()}
      >
        {pending ? t('foodLoading') : t('onlineFood')}
      </button>
      <details className="page-help">
        <summary>{t('compactHelp')}</summary>
        <p>{t('onlineFoodPrivacy')}</p>
        {__LEGAL_PREVIEW__ && <p>{t('onlineFoodUsda')}</p>}
      </details>
      {pending && <p role="status">{t('foodLoading')}</p>}
      {error && <p role="alert">{error}</p>}
      {searched && !foods.length && <p role="status">{t('onlineFoodEmpty')}</p>}
      {food && (
        <div className="online-food-result">
          <p className="micro muted">{t('onlineFoodCheck')}</p>
          <Select
            label={t('onlineFoodResult')}
            value={food.id}
            options={foods.map((f) => ({ value: f.id, label: local(f.name) }))}
            onChange={setSelected}
          />
          <div className="inline">
            <Num label={t('grams')} value={grams} min={1} max={3000} onChange={setGrams} />
            <button
              type="button"
              className="button"
              disabled={!Number.isFinite(grams) || grams <= 0 || grams > 3000}
              onClick={() => onAdd(food, grams)}
            >
              {t('add')}
            </button>
          </div>
          <FoodFacts food={food} />
        </div>
      )}
    </section>
  );
}
