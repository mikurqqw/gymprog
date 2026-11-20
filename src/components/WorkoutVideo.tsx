import { useEffect, useState } from 'react';
import { Video } from 'lucide-react';
import { useI18n } from '../i18n';
import { getVideo, saveVideo } from '../lib/video';
import type { useWorkoutLog } from '../lib/useWorkoutLog';
import { Field } from './ui';

export function WorkoutVideo({
  rowId,
  log,
  write,
}: Pick<ReturnType<typeof useWorkoutLog>, 'log' | 'write'> & { rowId: string }) {
  const { t } = useI18n();
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  useEffect(
    () => () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    },
    [videoUrl],
  );
  return (
    <details>
      <summary>{t('video')}</summary>
      <Field label={t('video')}>
        <input
          type="file"
          accept="video/*"
          capture="environment"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              await saveVideo(rowId, file);
              write({ video: rowId });
              setMessage(t('videoSaved'));
            } catch {
              setMessage(t('videoError'));
            }
          }}
        />
      </Field>
      <p className="micro muted">{t('videoLocal')}</p>
      {log.video && (
        <button
          className="button secondary"
          onClick={async () => {
            try {
              const blob = await getVideo(log.video);
              if (blob) setVideoUrl(URL.createObjectURL(blob));
              else setMessage(t('videoError'));
            } catch {
              setMessage(t('videoError'));
            }
          }}
        >
          <Video size={16} />
          {t('viewVideo')}
        </button>
      )}
      {videoUrl && <video src={videoUrl} controls playsInline className="set-video" />}
      {message && (
        <p role="status" className="micro">
          {message}
        </p>
      )}
    </details>
  );
}
