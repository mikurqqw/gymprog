import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useI18n } from '../i18n';
import { Card, PageTitle } from './ui';
export function ProfileReadyGate({ children }: { children: ReactNode }) {
  const state = useStore(),
    { t } = useI18n();
  if (state.profile && state.onboarded) return children;
  return (
    <>
      <PageTitle title={t('sfSetupTitle')} description={t('sfSetupText')} />
      <Card>
        <p>{t('onboardingText')}</p>
        <Link className="button" to="/profile">
          {t('sfApplyProgram')}
        </Link>
      </Card>
    </>
  );
}
