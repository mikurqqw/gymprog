import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { seriesStrings } from '../i18n/seriesStrings';
import { activeSeriesRun } from '../lib/activeSeries';

export function ActiveSeriesLink() {
  const active = activeSeriesRun(useStore());
  const { language, t } = useI18n();
  if (!active) return null;
  return (
    <Link className="button" to={'/series/' + active.program}>
      {t('sfContinue')} · {seriesStrings[active.program][language]}
    </Link>
  );
}
