import { contentReviewConfig } from '../config/contentReview';
import type { Exercise } from '../lib/schema';
import { useI18n } from '../i18n';
export function ExerciseReview({ exercise }: { exercise: Exercise }) {
  const { t } = useI18n();
  return contentReviewConfig.showPendingNotices && !exercise.contentReview?.qualifiedClinician ? (
    <p className="micro muted exercise-review">{t('exerciseReviewPending')}</p>
  ) : null;
}
