import { HealthScreen } from './HealthScreen';
import { HEALTH_SCREEN_VERSION } from '../config/versions';
import { StoragePreferences } from './StoragePreferences';
import { startOffline } from '../lib/offline';
import { useEffect, useState, lazy, Suspense, type ReactNode } from 'react';
import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useStore, update, activateStorage, resetMemory } from '../lib/store';
import { dataAllowed, isAdult, readConsent, saveConsent } from '../lib/consent';
import { today } from '../lib/formulas';
import { Card, Field, PageTitle, Select } from './ui';
import { PreviewBanner } from './PreviewBanner';
import { LegalFooter } from './LegalFooter';
const Legal = lazy(() => import('../pages/Legal'));
const required = ['terms', 'privacy', 'health', 'medical', 'calories'] as const;
export function ConsentGate({ children }: { children: ReactNode }) {
  const s = useStore(),
    { t } = useI18n(),
    location = useLocation(),
    [phase, setPhase] = useState<'age' | 'consent' | 'ready' | 'blocked' | 'screening'>(() =>
      dataAllowed()
        ? (s.profile ?? s.draftProfile).healthScreenVersion === HEALTH_SCREEN_VERSION
          ? 'ready'
          : 'screening'
        : readConsent()?.adult
          ? 'consent'
          : 'age',
    ),
    [birth, setBirth] = useState(''),
    [checks, setChecks] = useState<string[]>([]),
    [optional, setOptional] = useState<boolean | null>(null),
    [custom, setCustom] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    document.documentElement.lang = s.language;
  }, [s.language]);
  useEffect(() => {
    const changed = () => {
      if (!dataAllowed()) {
        resetMemory();
        setChecks([]);
        setPhase(readConsent()?.adult ? 'consent' : 'age');
      }
    };
    window.addEventListener('ironcycle:consent', changed);
    window.addEventListener('storage', changed);
    return () => {
      window.removeEventListener('ironcycle:consent', changed);
      window.removeEventListener('storage', changed);
    };
  }, []);
  if (location.pathname.startsWith('/legal/'))
    return (
      <>
        <PreviewBanner />
        <Routes>
          <Route
            path="/legal/:id"
            element={
              <Suspense fallback={<div className="skeleton" aria-busy="true" />}>
                <Legal />
              </Suspense>
            }
          />
        </Routes>
      </>
    );
  if (phase === 'ready')
    return (
      <>
        <PreviewBanner />
        <StoragePreferences />
        {children}
      </>
    );
  return (
    <>
      <PreviewBanner />
      <main className="gate-page">
        <div className="gate-heading">
          <b className="brand">IronCycle · 18+</b>
          <Select
            label={t('language')}
            value={s.language}
            options={[
              { value: 'ru', label: 'Русский' },
              { value: 'kk', label: 'Қазақша' },
              { value: 'en', label: 'English' },
            ]}
            onChange={(v) => update({ language: v as typeof s.language })}
          />
        </div>
        {phase === 'screening' ? (
          <HealthScreen
            onComplete={() => {
              void startOffline();
              setPhase('ready');
            }}
          />
        ) : phase === 'age' ? (
          <Card>
            <PageTitle title={t('ageGate')} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isAdult(birth, today())) setPhase('consent');
                else {
                  setBirth('');
                  setPhase('blocked');
                }
              }}
            >
              <Field label={t('birthDate')}>
                <input
                  type="date"
                  required
                  autoComplete="off"
                  max={today()}
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
                />
              </Field>
              <button className="button" type="submit">
                {t('next')}
              </button>
            </form>
          </Card>
        ) : phase === 'blocked' ? (
          <Card>
            <PageTitle title={t('ageBlocked')} />
            <button className="button secondary" onClick={() => setPhase('age')}>
              {t('back')}
            </button>
          </Card>
        ) : (
          <Card>
            <PageTitle title={t('consentTitle')} description={t('consentIntro')} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (required.some((key) => !checks.includes(key)) || optional === null) return;
                try {
                  saveConsent(s.language, optional);
                  const loaded = activateStorage();
                  setBirth('');
                  if (
                    (loaded?.profile ?? loaded?.draftProfile)?.healthScreenVersion ===
                    HEALTH_SCREEN_VERSION
                  ) {
                    void startOffline();
                    setPhase('ready');
                  } else setPhase('screening');
                } catch {
                  setError(t('storageError'));
                }
              }}
            >
              {required.map((key) => (
                <label className="checkbox-label consent-checkbox" key={key}>
                  <input
                    type="checkbox"
                    checked={checks.includes(key)}
                    onChange={(e) =>
                      setChecks(
                        e.target.checked ? [...checks, key] : checks.filter((k) => k !== key),
                      )
                    }
                  />
                  <span>
                    {t('consent' + key[0].toUpperCase() + key.slice(1))}{' '}
                    {key !== 'health' && (
                      <Link
                        className="text-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        to={'/legal/' + (key === 'calories' ? 'medical' : key)}
                      >
                        {t('readMore')}
                      </Link>
                    )}
                  </span>
                </label>
              ))}
              <h2>{t('storageChoices')}</h2>
              <p className="micro muted">{t('storageExplanation')}</p>
              <div className="storage-actions">
                <button
                  type="button"
                  className="button secondary"
                  aria-pressed={optional === true && !custom}
                  onClick={() => {
                    setOptional(true);
                    setCustom(false);
                  }}
                >
                  {t('acceptStorage')}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  aria-pressed={optional === false && !custom}
                  onClick={() => {
                    setOptional(false);
                    setCustom(false);
                  }}
                >
                  {t('rejectOptional')}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setCustom(true);
                    setOptional(false);
                  }}
                >
                  {t('customize')}
                </button>
              </div>
              {custom && (
                <div>
                  <label className="checkbox-label">
                    <input type="checkbox" checked disabled />
                    {t('necessaryStorage')}
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={optional === true}
                      onChange={(e) => setOptional(e.target.checked)}
                    />
                    {t('optionalMedia')}
                  </label>
                </div>
              )}
              <p className="notice">{t('medicalContext')}</p>
              <button
                className="button"
                type="submit"
                disabled={required.some((k) => !checks.includes(k)) || optional === null}
              >
                {t('finish')}
              </button>
              {error && <p role="alert">{error}</p>}
            </form>
          </Card>
        )}
      </main>
      <LegalFooter />
    </>
  );
}
