import { Info } from 'lucide-react';
import { useI18n } from '../i18n';
const notices = {
  program: ['noticeProgram', 'medicalContext'],
  calories: ['noticeCalories', 'calorieEstimate'],
  injury: ['noticeInjury', 'injuryScoresEstimate'],
  workout: ['noticeWorkout', 'medicalContext'],
  maxTest: ['noticeMaxTest', 'testSafety'],
} as const;
export function ContextNotice({ kind }: { kind: keyof typeof notices }) {
  const { t } = useI18n(),
    [summary, detail] = notices[kind];
  return (
    <details
      className={'context-notice ' + (kind === 'maxTest' ? 'notice warning' : '')}
      open={kind === 'maxTest' ? true : undefined}
    >
      <summary>
        <Info size={16} />
        <span>{t(summary)}</span>
      </summary>
      <p>{t(detail)}</p>
    </details>
  );
}
export function AlgorithmChip() {
  const { t } = useI18n();
  return <span className="algorithm-chip">{t('generatedChip')}</span>;
}
