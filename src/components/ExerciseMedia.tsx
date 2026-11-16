import registry from '../data/media.json';
import { useEffect, useState } from 'react';
import { mediaAllowed, readPreferences, PREFERENCES_KEY } from '../lib/consent';
import type { Exercise } from '../lib/schema';
import { useI18n } from '../i18n';
export function ExerciseMedia({ exercise: ex }: { exercise: Exercise }) {
  const { t, local } = useI18n(),
    [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false),
    media = ex.media,
    path =
      media.localPath ?? media.gif ?? media.image ?? (registry as Record<string, string>)[ex.id];
  const safe =
    path && !path.startsWith('/') && !path.includes('..') && !path.includes(':') ? path : null;
  useEffect(() => {
    const changed = () => {
      if (!mediaAllowed()) setLoaded(false);
    };
    window.addEventListener('ironcycle:media-preference', changed);
    window.addEventListener('storage', changed);
    return () => {
      window.removeEventListener('ironcycle:media-preference', changed);
      window.removeEventListener('storage', changed);
    };
  }, []);
  if (safe && !failed)
    return /\.mp4$/i.test(safe) ? (
      <video
        onError={() => setFailed(true)}
        className="exercise-media"
        controls
        playsInline
        preload="none"
        src={'./' + safe}
      />
    ) : (
      <img
        onError={() => setFailed(true)}
        className="exercise-media"
        src={'./' + safe}
        loading="lazy"
        alt={local(ex.name)}
      />
    );
  if (media.youtubeId && /^[\w-]{11}$/.test(media.youtubeId))
    return (
      <div>
        {loaded && mediaAllowed() ? (
          <iframe
            className="exercise-media"
            title={local(ex.name)}
            loading="lazy"
            src={'https://www.youtube-nocookie.com/embed/' + media.youtubeId}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allowFullScreen
          />
        ) : (
          <div className="notice">
            <p>{t('videoConsent')}</p>
            <button
              className="button secondary"
              onClick={() => {
                const prefs = readPreferences();
                if (prefs) {
                  localStorage.setItem(
                    PREFERENCES_KEY,
                    JSON.stringify({ ...prefs, optionalMedia: true }),
                  );
                  setLoaded(true);
                }
              }}
            >
              {t('loadVideo')}
            </button>
          </div>
        )}
        <a
          href={'https://www.youtube.com/watch?v=' + media.youtubeId}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('openYoutube')}
        </a>
      </div>
    );
  return (
    <div className="technique-diagram">
      <svg viewBox="0 0 360 200" role="img" aria-label={local(ex.name)}>
        <path
          d="M30 170h300M70 45v125m220-125v125"
          stroke="currentColor"
          opacity=".18"
          fill="none"
        />
        <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none">
          <circle cx="171" cy="52" r="15" />
          <path d="m175 72 21 43-43 27 9 27m34-54 20 45h29m-66-79-31 29-29-5m62-23 36 17" />
          <path d="M110 86h143" strokeWidth="4" />
          <path d="M119 71v31m10-34v38m103-38v38m10-35v31" />
        </g>
        <path d="M270 115v30m-5-5 5 5 5-5" stroke="currentColor" fill="none" opacity=".5" />
        <text x="30" y="192" fill="currentColor" fontSize="9" opacity=".65">
          IRONCYCLE / TECHNIQUE
        </text>
      </svg>
      <span>{t('mediaMissing')}</span>
    </div>
  );
}
