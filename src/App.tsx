import { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './pages/Home';
const Profile=lazy(()=>import('./pages/Profile'));
const Program=lazy(()=>import('./pages/Program'));
const Workout=lazy(()=>import('./pages/Workout'));
const Checkin=lazy(()=>import('./pages/Checkin'));
const Nutrition=lazy(()=>import('./pages/Nutrition'));
const Progress=lazy(()=>import('./pages/Progress'));
const Library=lazy(()=>import('./pages/Library'));
const Reference=lazy(()=>import('./pages/Reference'));
const Settings=lazy(()=>import('./pages/Settings'));
const Test=lazy(()=>import('./pages/Test'));
const Builder=lazy(()=>import('./pages/Builder'));
export default function App(){return <ErrorBoundary><HashRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="profile" element={<Suspense fallback={<div className="skeleton" aria-busy="true"/>}><Profile/></Suspense>}/>{[['program',Program],['workout',Workout],['checkin',Checkin],['nutrition',Nutrition],['progress',Progress],['library',Library],['reference',Reference],['settings',Settings],['test',Test],['builder',Builder]].map(([path,Page])=><Route key={path as string} path={path as string} element={<Suspense fallback={<div className="skeleton" aria-busy="true"/>}>{typeof Page!=='string'&&<Page/>}</Suspense>}/>)}<Route path="*" element={<Home/>}/></Route></Routes></HashRouter></ErrorBoundary>;}
