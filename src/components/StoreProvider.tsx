import type { ReactNode } from 'react';
import { StateContext, useStoreSnapshot } from '../lib/store';
export function StoreProvider({children}:{children:ReactNode}){const state=useStoreSnapshot();return <StateContext value={state}>{children}</StateContext>;}
