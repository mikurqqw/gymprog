import { useState } from 'react';
import { Check, ArrowRight, Dumbbell } from 'lucide-react';
import { useStore, update } from '../lib/store';
import { goals } from '../data/templates';
import { generate, exerciseById } from '../lib/program';
import type { Profile } from '../lib/schema';
import { useI18n } from '../i18n';
import { Card, Num, PageTitle } from '../components/ui';
import { useNavigate } from 'react-router-dom';
export default function Builder(){const s=useStore(),{t}=useI18n(),[goal,setGoal]=useState(s.profile.goal),[days,setDays]=useState(s.profile.days),[priorities,setPriorities]=useState(s.profile.priorities),navigate=useNavigate();
 const profile:Profile={...s.profile,goal,days:goal==='powerlifting'?3:days,priorities};const rows=generate(profile).filter(r=>r.week===1);const volume:Record<string,number>={};rows.forEach(r=>exerciseById(r.exercise).muscles.forEach(m=>volume[m]=(volume[m]??0)+r.sets));
 return <><PageTitle title={t('builder')} description={t('builderText')}/><div className="goal-grid">{goals.map((key,i)=><button className={'goal-option '+(goal===key?'selected':'')} key={key} onClick={()=>setGoal(key)}><span className="goal-index">0{i+1}</span><Dumbbell size={24}/><strong>{t(key)}</strong>{goal===key&&<Check className="goal-check" size={19}/>}</button>)}</div><Card><h2>{t('settings')}</h2>{goal==='powerlifting'?<p className="notice">{t('powerliftingFixed')}</p>:<Num label={t('days')} value={days} min={2} max={5} onChange={v=>setDays(Math.max(2,Math.min(5,Math.round(v))))}/>}<h3>{t('priorities')}</h3><div className="check-grid">{['squat','bench','deadlift','biceps','pronation','cup','rising'].map(key=><label key={key} className="checkbox-label"><input type="checkbox" checked={priorities.includes(key)} onChange={e=>setPriorities(e.target.checked?[...priorities,key]:priorities.filter(k=>k!==key))}/>{t(key)}</label>)}</div>{goal==='armwrestling'&&<p className="notice warning">{t('armSafety')}</p>}<h3>{t('weeklySets')}</h3><div className="chip-list">{Object.entries(volume).map(([muscle,sets])=><span className="chip" key={muscle}>{t(muscle==='back'?'backMuscle':muscle)} <b>{sets}</b></span>)}</div><p className="muted">{t('manualMetrics')}</p><button className="button" onClick={()=>{update({profile,week:1,day:0});navigate('/program');}}>{t('save')}<ArrowRight size={17}/></button></Card></>;
}
