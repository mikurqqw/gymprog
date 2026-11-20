import { HeartPulse, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export function HomeShortcuts() {
  const { t } = useI18n();
  return (
    <div className="inline home-shortcuts">
      <Link className="button secondary" to="/checkin">
        <HeartPulse size={18} />
        {t('checkin')}
      </Link>
      <Link className="button secondary" to="/builder">
        <SlidersHorizontal size={18} />
        {t('builder')}
      </Link>
    </div>
  );
}
