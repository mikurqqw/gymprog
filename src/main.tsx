import { hasAppLock } from './lib/appLock';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationRoot } from './components/ApplicationRoot';
import { activateStorage } from './lib/store';
import { dataAllowed } from './lib/consent';
import { startOffline } from './lib/offline';
import './fonts.css';
import './styles.css';
import './privacy.css';
import './device.css';
import './dashboard.css';
import './storefront.css';
import './navigation.css';
import './navigationSheets.css';
import './navigationResponsive.css';
import './homeSupport.css';
if (dataAllowed() && !hasAppLock()) {
  activateStorage();
  void startOffline();
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationRoot />
  </StrictMode>,
);

import './focus.css';

import './focusControls.css';
