import { Link } from 'react-router-dom';
import { seriesStrings } from '../i18n/seriesStrings';
import { useI18n } from '../i18n';
const byGoal: Record<string, (keyof typeof seriesStrings)[]> = {
  fitness: ['fitness', 'gym_first_month', 'home_core_8w'],
  bodybuilding: ['mens_bodybuilding', 'womens_bodybuilding', 'home_dumbbell_gain'],
  powerlifting: ['powerlifting'],
  fatloss: ['weight_loss'],
};
export function SeriesLinks({ goal }: { goal?: string }) {
  const { language } = useI18n();
  const items = goal ? byGoal[goal] : Object.values(byGoal).flat();
  if (!items?.length) return null;
  return (
    <section className="series-links" aria-label={seriesStrings.series[language]}>
      <h2>{seriesStrings.series[language]}</h2>
      <div className="inline">
        {items.map((id) => (
          <Link className="button secondary" key={id} to={'/series/' + id}>
            {seriesStrings[id][language]} ·{' '}
            {seriesStrings[id === 'gym_first_month' ? 'intro' : 'three'][language]}
          </Link>
        ))}
      </div>
    </section>
  );
}
