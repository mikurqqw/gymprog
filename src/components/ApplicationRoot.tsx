import '../lib/install';
import { ThemeController } from './ThemeController';
import { RouteMetadata } from './RouteMetadata';
import { HashRouter } from 'react-router-dom';
import { StoreProvider } from './StoreProvider';
import { ExperienceRouter } from './ExperienceRouter';
export function ApplicationRoot() {
  return (
    <StoreProvider>
      <HashRouter>
        <ThemeController />
        <RouteMetadata />
        <ExperienceRouter />
      </HashRouter>
    </StoreProvider>
  );
}
