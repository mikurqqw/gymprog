import { Link } from 'react-router-dom';
import { useProfileStore } from '../lib/store';
import { useI18n } from '../i18n';
import { Card } from './ui';
export function TrainingPreferencesCard() {
  const { profile } = useProfileStore(),
    { t } = useI18n();
  return (
    <Card className="training-preferences">
      <h2>{t('simpleTraining')}</h2>
      <p>
        {t(profile.goal)} · {profile.days} {t('days')} · {profile.minutes} {t('minutes')}
      </p>
      <Link className="text-link" to="/profile?advanced=1">
        {t('simpleEditTraining')} →
      </Link>
    </Card>
  );
}
