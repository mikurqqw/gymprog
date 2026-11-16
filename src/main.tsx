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
if(dataAllowed()&&!hasAppLock()){activateStorage();void startOffline();}
createRoot(document.getElementById('root')!).render(<StrictMode><ApplicationRoot/></StrictMode>);
