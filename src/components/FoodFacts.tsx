import type { FoodRecord } from '../lib/foodSchema';
import sources from '../data/food-sources.json';
import { useI18n } from '../i18n';
export function FoodFacts({ food }: { food: FoodRecord }) {
  const { t, local } = useI18n(),
    source = sources.find((item) => item.id === food.sourceId),
    external =
      food.sourceId === 'open-food-facts'
        ? {
            name: 'Open Food Facts',
            url: 'https://world.openfoodfacts.org/product/' + food.id.replace('off-', ''),
          }
        : food.sourceId === 'usda-live'
          ? {
              name: 'USDA FoodData Central',
              url: 'https://fdc.nal.usda.gov/food-details/' + food.fdcId + '/nutrients',
            }
          : null;
  const allergenLabel = (allergen: string) => {
    const key =
      'foodAllergen' +
      allergen
        .split('-')
        .map((part) => part[0]?.toUpperCase() + part.slice(1))
        .join('');
    const label = t(key);
    return label === key ? allergen : label;
  };
  return (
    <>
      <p className="micro">
        {t('per100')}: {food.kcal} {t('kcal')} · {t('protein')} {food.p} · {t('fat')} {food.f} ·{' '}
        {t('carbs')} {food.c}
      </p>
      {food.estimated && <p className="micro warning">{t('estimatedFood')}</p>}
      {food.nutritionNote && <p className="micro">{local(food.nutritionNote)}</p>}
      <p className="micro">
        {t('foodSource')}:{' '}
        {external ? (
          <a target="_blank" rel="noopener noreferrer" href={external.url}>
            {external.name}
          </a>
        ) : source ? (
          <a target="_blank" rel="noopener noreferrer" href={source.url}>
            {local(source.title)}
          </a>
        ) : (
          food.sourceId
        )}{' '}
        · {food.license}
      </p>
      <p className="micro">
        {food.allergens.map(allergenLabel).join(', ') || '—'} ·{' '}
        {t(
          food.halal === 'suitable'
            ? 'foodHalalSuitable'
            : food.halal === 'not-suitable'
              ? 'foodHalalNotSuitable'
              : 'foodHalalVerify',
        )}
      </p>
      <p className="micro muted">{t('foodFlags')}</p>
    </>
  );
}
