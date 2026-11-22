import { useI18n } from '../i18n';
import { loadGoalStrings } from '../i18n/loadGoalStrings';
import { formatDate } from '../lib/formulas';
import type { estimateLoadGoal } from '../lib/loadGoalForecast';
import { Weight } from './ui';

export function LoadGoalResult({
  result,
  today,
}: {
  result: ReturnType<typeof estimateLoadGoal>;
  today: string;
}) {
  const { language, locale } = useI18n();
  const strings = loadGoalStrings;
  const dateLabel = (date: string) => formatDate(date, locale, { dateStyle: 'long' });
  if (result.kind === 'recorded')
    return (
      <>
        {strings.recorded[language]} · {dateLabel(result.date)}
      </>
    );
  if (result.kind === 'above')
    return (
      <>
        {strings.above[language]} · <Weight value={result.maximum} />
      </>
    );
  if (result.kind === 'scheduled') {
    const session = result.session;
    const days = (Date.parse(session.date) - Date.parse(today)) / 86_400_000;
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day');
    return (
      <>
        {strings.scheduled[language]} · {relative} ({dateLabel(session.date)})
        {session.weight !== null && (
          <>
            {' '}
            · <Weight value={session.weight} />
          </>
        )}
        {session.reps && (
          <>
            {' '}
            × {session.reps} {strings.repUnit[language]}
          </>
        )}
      </>
    );
  }
  return <>{strings[result.kind][language]}</>;
}
