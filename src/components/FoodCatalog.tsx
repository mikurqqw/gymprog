import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { foodRepository, initializeFoodCatalog } from '../lib/foodRepository';
import type { FoodRecord } from '../lib/foodSchema';
import { FoodFacts } from './FoodFacts';
import { useI18n } from '../i18n';
import { CustomFood } from './CustomFood';
import { Field, Num, Select } from './ui';
export function FoodCatalog({ onAdd }: { onAdd: (food: FoodRecord, grams: number) => void }) {
  const { t, local } = useI18n(),
    [params] = useSearchParams(),
    [ready, setReady] = useState(false),
    [error, setError] = useState(''),
    [query, setQuery] = useState(params.get('q') ?? ''),
    [favoritesOnly, setFavoritesOnly] = useState(false),
    [selected, setSelected] = useState(''),
    [grams, setGrams] = useState(100),
    [removed, setRemoved] = useState<FoodRecord | null>(null),
    [removedFavorite, setRemovedFavorite] = useState(false);
  useEffect(() => {
    let live = true;
    void import('../data/foods-v2.json')
      .then((data) => initializeFoodCatalog(data.default))
      .then(() => {
        if (live) setReady(true);
      })
      .catch(() => {
        if (live) setError(t('foodDatabaseError'));
      });
    return () => {
      live = false;
    };
  }, [t]);
  const result = useLiveQuery(async () => {
    if (!ready) return undefined;
    try {
      return {
        foods: await foodRepository.search(query, favoritesOnly),
        favorites: await foodRepository.favoriteIds(),
      };
    } catch {
      return { foods: [], favorites: [] as string[], error: true };
    }
  }, [ready, query, favoritesOnly]);
  const foods = result?.foods ?? [],
    food = foods.find((item) => item.id === selected) ?? foods[0];
  const action = async (operation: () => Promise<unknown>) => {
    try {
      await operation();
      setError('');
    } catch {
      setError(t('foodDatabaseError'));
    }
  };
  return (
    <section aria-label={t('foodCatalog')}>
      <Field label={t('searchFood')}>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Field>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={favoritesOnly}
          onChange={(e) => setFavoritesOnly(e.target.checked)}
        />
        {t('favoritesOnly')}
      </label>
      {!ready && !error && <p role="status">{t('foodLoading')}</p>}
      {(error || result?.error) && <p role="alert">{error || t('foodDatabaseError')}</p>}
      {ready && !foods.length && <p>{t('emptySearch')}</p>}
      {food && (
        <>
          <Select
            label={t('searchFood')}
            value={food.id}
            options={foods.map((item) => ({ value: item.id, label: local(item.name) }))}
            onChange={setSelected}
          />
          <div className="inline">
            <Num label={t('grams')} value={grams} min={1} max={3000} onChange={setGrams} />
            <button
              className="button"
              disabled={!Number.isFinite(grams) || grams <= 0 || grams > 3000}
              onClick={() => onAdd(food, grams)}
            >
              {t('add')}
            </button>
            <button
              className="button secondary"
              aria-pressed={result?.favorites.includes(food.id)}
              onClick={() => void action(() => foodRepository.toggleFavorite(food.id))}
            >
              {t('favoriteFood')}
            </button>
          </div>
          <div className="chip-list">
            {food.portions.map((portion, i) => (
              <button className="chip" key={i} onClick={() => setGrams(portion.grams)}>
                {local(portion.name)} · {portion.grams} {t('grams')}
              </button>
            ))}
          </div>
          <FoodFacts food={food} />
          {food.custom && (
            <button
              className="text-button"
              onClick={() =>
                void action(async () => {
                  setRemovedFavorite(result?.favorites.includes(food.id) ?? false);
                  await foodRepository.remove(food.id);
                  setRemoved(food);
                })
              }
            >
              {t('delete')}
            </button>
          )}
        </>
      )}
      {removed && (
        <button
          className="button secondary"
          onClick={() =>
            void action(async () => {
              await foodRepository.restore(removed);
              if (removedFavorite) await foodRepository.toggleFavorite(removed.id);
              setRemoved(null);
            })
          }
        >
          {t('undo')}
        </button>
      )}
      <CustomFood />
    </section>
  );
}
