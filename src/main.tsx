import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { StoreProvider } from './components/StoreProvider';
import './styles.css';
createRoot(document.getElementById('root')!).render(<StrictMode><StoreProvider><App/></StoreProvider></StrictMode>);
if(import.meta.env.PROD&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{document.documentElement.dataset.offline='unavailable';});
