import { lazy,Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { dataAllowed } from '../lib/consent';
import { isStorefrontPath } from '../lib/publicRoutes';
import { AppLockGate } from './AppLockGate';
import { ConsentGate } from './ConsentGate';
const App=lazy(()=>import('../App'));
const Storefront=lazy(()=>import('../pages/Storefront'));
export function ExperienceRouter(){
 const location=useLocation();useStore();
 const publicPage=isStorefrontPath(location.pathname)||(location.pathname==='/'&&!dataAllowed());
 return <Suspense fallback={<div className="skeleton" aria-busy="true"/>}>{publicPage?<Storefront/>:<AppLockGate><ConsentGate><App/></ConsentGate></AppLockGate>}</Suspense>;
}
