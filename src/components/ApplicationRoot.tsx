import { AppLockGate } from './AppLockGate';
import { lazy,Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { StoreProvider } from './StoreProvider';
import { ConsentGate } from './ConsentGate';
const App=lazy(()=>import('../App'));
export function ApplicationRoot(){return <StoreProvider><HashRouter><AppLockGate><ConsentGate><Suspense fallback={<div className="skeleton" aria-busy="true"/>}><App/></Suspense></ConsentGate></AppLockGate></HashRouter></StoreProvider>;}
