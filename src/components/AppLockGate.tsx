import { useEffect,useState,type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';
import { hasAppLock,verifyAppLock } from '../lib/appLock';
import { dataAllowed } from '../lib/consent';
import { activateStorage,resetMemory } from '../lib/store';
import { startOffline } from '../lib/offline';
import { Card,Field,PageTitle } from './ui';
export function AppLockGate({children}:{children:ReactNode}){
 const {t}=useI18n(),location=useLocation(),[locked,setLocked]=useState(()=>dataAllowed()&&hasAppLock()),[pin,setPin]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[attempts,setAttempts]=useState(0),[until,setUntil]=useState(0);
 useEffect(()=>{const lock=()=>{if(hasAppLock()){void import('../lib/database').then(({closeDatabase})=>{closeDatabase();resetMemory();setLocked(true);}).catch(()=>setError(t('storageError')));}};window.addEventListener('ironcycle:lock',lock);return ()=>window.removeEventListener('ironcycle:lock',lock);},[t]);
 if(!locked||location.pathname.startsWith('/legal/'))return children;
 return <main className="gate-page"><Card><PageTitle title={t('appLock')}/><p>{t('lockDisclaimer')}</p><form onSubmit={async e=>{e.preventDefault();if(Date.now()<until)return;setBusy(true);try{if(await verifyAppLock(pin)){activateStorage();void startOffline();setPin('');setLocked(false);}else{const count=attempts+1;setAttempts(count);if(count%5===0)setUntil(Date.now()+30000);setError(t('pinError'));}}catch{setError(t('storageError'));}finally{setBusy(false);}}}><Field label="PIN"><input type="password" inputMode="numeric" autoComplete="off" minLength={6} maxLength={12} required pattern="[0-9]{6,12}" value={pin} onChange={e=>setPin(e.target.value)}/></Field><button className="button" disabled={busy}>{t('unlock')}</button></form>{error&&<p role="alert">{error}</p>}<button className="text-button" disabled={busy} onClick={async()=>{if(confirm(t('eraseWarning'))){try{const {deleteAllAppData}=await import('../lib/dataManagement');await deleteAllAppData();setLocked(false);}catch{setError(t('storageError'));}}}}>{t('eraseAll')}</button></Card></main>;
}
