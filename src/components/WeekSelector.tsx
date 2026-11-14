import { update, useStore } from '../lib/store';
import { useI18n } from '../i18n';
export function WeekSelector(){const {week}=useStore(),{t}=useI18n();return <div className="week-selector" aria-label={t('calendar')}>{Array.from({length:8},(_,i)=><button key={i} onClick={()=>update({week:i+1,day:0})} className={week===i+1?'active':''}><span>{t('week')} {i+1}</span><small>{t('phase'+i)}</small></button>)}</div>;}
