import { useEffect,type ReactNode } from 'react';
import { Link,NavLink } from 'react-router-dom';
import { ArrowUpRight,Moon,Sun } from 'lucide-react';
import { useStore,update } from '../lib/store';
import { useI18n } from '../i18n';
import { dataAllowed } from '../lib/consent';
import { LegalFooter } from './LegalFooter';
import { PreviewBanner } from './PreviewBanner';
export function StorefrontShell({children}:{children:ReactNode}){
 const state=useStore(),{t}=useI18n();
 useEffect(()=>{document.documentElement.dataset.theme=state.theme;document.documentElement.lang=state.language;},[state.theme,state.language]);
 return <div className="storefront"><PreviewBanner/><a className="sf-skip" href="#storefront-content">{t('sfSkip')}</a><header className="sf-header"><Link to="/welcome" className="sf-brand"><span>IC<span className="sf-brand-dot"/></span>IronCycle</Link><nav aria-label={t('sfPrograms')}><NavLink to="/catalog">{t('sfPrograms')}</NavLink><NavLink to="/demo">{t('sfDemo')}</NavLink></nav><div className="sf-header-actions"><button className="icon-button" aria-label={t('theme')} onClick={()=>update({theme:state.theme==='dark'?'light':'dark'})}>{state.theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><select aria-label={t('language')} value={state.language} onChange={e=>update({language:e.target.value as typeof state.language})}><option value="ru">RU</option><option value="kk">ҚАЗ</option><option value="en">EN</option></select><Link className="sf-enter" to={dataAllowed()?'/':'/start'}>{t('sfCabinet')}<ArrowUpRight size={16}/></Link></div></header><main id="storefront-content">{children}</main><LegalFooter/></div>;
}
