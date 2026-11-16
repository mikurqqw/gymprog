import { useI18n } from '../i18n';
export function GateProgress({ step }: { step: number }) {
  const { t } = useI18n();
  return (
    <div className="gate-progress">
      <ol>
        {['gateStepAge', 'gateStepConsent', 'gateStepHealth'].map((key, index) => (
          <li key={key} aria-current={index === step ? 'step' : undefined}>
            <span>{index + 1}/3</span>
            {t(key)}
          </li>
        ))}
      </ol>
      <p className="micro muted">{t('gateSummary')}</p>
    </div>
  );
}
