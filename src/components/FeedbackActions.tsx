import { useRef, useState } from 'react';
import { launchConfig } from '../config/launch.config';
import { feedbackLink, diagnostics, diagnosticStorageAvailable } from '../lib/feedback';
import { hasStorageError } from '../lib/store';
import { useI18n } from '../i18n';
export function FeedbackActions() {
  const { t, language } = useI18n(),
    [message, setMessage] = useState(''),
    [preview, setPreview] = useState(''),
    text = useRef<HTMLTextAreaElement>(null);
  const href = feedbackLink(launchConfig.supportEmail, __APP_VERSION__, language);
  return (
    <section className="nav-group feedback-tools">
      <h2>{t('feedbackTitle')}</h2>
      {href ? (
        <a className="nav-item" href={href}>
          {t('feedbackSend')}
        </a>
      ) : (
        <>
          <button className="nav-item" disabled>
            {t('feedbackSend')}
          </button>
          <p className="micro muted">{t('feedbackPending')}</p>
        </>
      )}
      <button
        className="nav-item"
        onClick={async () => {
          const value = JSON.stringify(
            diagnostics(
              __APP_VERSION__,
              navigator.userAgent,
              !hasStorageError() && diagnosticStorageAvailable(),
            ),
            null,
            2,
          );
          setPreview(value);
          try {
            if (!navigator.clipboard) throw Error('Unavailable');
            await navigator.clipboard.writeText(value);
            setMessage(t('diagnosticsCopied'));
          } catch {
            setMessage(t('diagnosticsManual'));
            requestAnimationFrame(() => text.current?.select());
          }
        }}
      >
        {t('diagnosticsCopy')}
      </button>
      {message && (
        <p className="micro" role="status">
          {message}
        </p>
      )}
      {preview && (
        <textarea
          className="diagnostics-preview"
          ref={text}
          aria-label={t('diagnosticsPreview')}
          value={preview}
          readOnly
        />
      )}
    </section>
  );
}
