import { ProfileReadyGate } from './components/ProfileReadyGate';
import NotFound from './pages/NotFound';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
const StartProgram = lazy(() => import('./pages/StartProgram'));
const Profile = lazy(() => import('./pages/Profile'));
const Program = lazy(() => import('./pages/Program'));
const Workout = lazy(() => import('./pages/Workout'));
const Checkin = lazy(() => import('./pages/Checkin'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Progress = lazy(() => import('./pages/Progress'));
const Library = lazy(() => import('./pages/Library'));
const Reference = lazy(() => import('./pages/Reference'));
const Settings = lazy(() => import('./pages/Settings'));
const Test = lazy(() => import('./pages/Test'));
const Injuries = lazy(() => import('./pages/Injuries'));
const PrivacyConsent = lazy(() => import('./pages/PrivacyConsent'));
const Builder = lazy(() => import('./pages/Builder'));
export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <ProfileReadyGate>
                <Home />
              </ProfileReadyGate>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<div className="skeleton" aria-busy="true" />}>
                <Profile />
              </Suspense>
            }
          />
          {[
            ['start', StartProgram],
            ['privacy-consent', PrivacyConsent],
            ['injuries', Injuries],
            ['program', Program],
            ['workout', Workout],
            ['checkin', Checkin],
            ['nutrition', Nutrition],
            ['progress', Progress],
            ['library', Library],
            ['reference', Reference],
            ['settings', Settings],
            ['test', Test],
            ['builder', Builder],
          ].map(([path, Page]) => (
            <Route
              key={path as string}
              path={path as string}
              element={
                <Suspense fallback={<div className="skeleton" aria-busy="true" />}>
                  {typeof Page !== 'string' &&
                    (['start', 'privacy-consent', 'reference'].includes(path as string) ? (
                      <Page />
                    ) : (
                      <ProfileReadyGate>
                        <Page />
                      </ProfileReadyGate>
                    ))}
                </Suspense>
              }
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
