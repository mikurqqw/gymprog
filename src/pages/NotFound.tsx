import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageTitle,Card } from '../components/ui';
export default function NotFound(){const {t}=useI18n();return <Card><PageTitle title={t('notFound')} description="404"/><Link className="button" to="/">{t('backHome')}</Link></Card>;}
