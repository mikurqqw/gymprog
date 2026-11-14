import { createContext, useContext, useSyncExternalStore } from 'react';
import { readStorage, STORAGE_KEY, type AppState } from './storage';
const loaded=readStorage();let state=loaded.data;let storageError=loaded.error;let undoState:AppState|null=null;
const listeners=new Set<()=>void>();
export function update(patch:Partial<AppState>|((old:AppState)=>Partial<AppState>)){
 const next={...state,...(typeof patch==='function'?patch(state):patch)};
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));storageError=false;}catch{storageError=true;}
 state=next;listeners.forEach(fn=>fn());
}
export function replaceWithUndo(data:AppState){undoState=state;update(data);}
export function undo(){if(undoState){const previous=undoState;undoState=null;update(previous);}}
export const hasUndo=()=>undoState!==null;
export const hasStorageError=()=>storageError;
export const StateContext=createContext<AppState>(state);
export const useStore=()=>useContext(StateContext);
export const useStoreSnapshot=()=>useSyncExternalStore(fn=>{listeners.add(fn);return ()=>listeners.delete(fn);},()=>state);
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){const result=readStorage();if(!result.error){state=result.data;listeners.forEach(fn=>fn());}}});

export function startRest(minutes:number){update({timer:Date.now()+minutes*60000});}
