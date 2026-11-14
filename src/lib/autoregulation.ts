import { clamp, dateOffset, roundTo } from './formulas';
import { nutrition } from './nutrition';
import type { Checkin, Log, Planned, Profile, Lift } from './schema';
export const READINESS_WEIGHTS={sleep:30,quality:10,recovery:20,soreness:10,stressMood:10,nutrition:10,speed:10};
export function readiness(c:Checkin,p:Profile,history:Checkin[]=[]){
 const target=nutrition(p),ratio=(n:number|undefined,d:number)=>n===undefined?.75:clamp(n/d,0,1);
 const parts={sleep:ratio(c.sleep,p.sleep)*30,quality:ratio(c.quality,5)*10,recovery:ratio(c.recovery,5)*20,soreness:(6-(c.soreness??2))/5*10,stressMood:((6-(c.stress??2))+(c.mood??4))/10*10,nutrition:(ratio(c.calories,target.kcal)+ratio(c.protein,target.protein))/2*10,speed:(c.speed==='fast'?1:c.speed==='normal'?.8:.2)*10};
 let score=Math.round(Object.values(parts).reduce((a,b)=>a+b,0));const reasons:string[]=[];
 if(c.sleep<5.5){score=Math.min(score,74);reasons.push('shortSleep');}if(c.sleep<4.5){score=Math.min(score,54);reasons.push('veryShortSleep');}
 const days=[c,...history.filter(x=>x.date<c.date).toSorted((a,b)=>b.date.localeCompare(a.date))];
 const consecutive=(n:number)=>days.slice(0,n).length===n&&days.slice(0,n).every((x,i)=>x.date===dateOffset(c.date,-i));
 if(consecutive(3)&&days.slice(0,3).every(x=>x.sleep<p.sleep-1.5))reasons.push('sleepDebt');
 if(consecutive(2)&&days.slice(0,2).every(x=>(x.calories!==undefined&&x.calories<target.kcal*.7)||(x.protein!==undefined&&x.protein<p.weight*1.2))){score=Math.min(74,Math.max(0,score-20));reasons.push('underEating');}
 if(c.pain==='sharp'||c.worsening||c.dizziness||c.weakness){score=0;reasons.push('stopPain');}else if(c.pain==='mild'){score=Math.min(score,74);reasons.push('mildPain');}
 if(c.sleep<p.sleep-1.5&&(c.recovery??3)<=2&&c.speed==='slow'){score=Math.min(score,54);reasons.push('veryShortSleep');}
 const level=score>=75?'green':score>=55?'yellow':score>=35?'orange':'red';return {score,level,parts,reasons} as const;
}
export function regulate(lines:Planned[],r:ReturnType<typeof readiness>,p:Profile){
 if(r.level==='red')return [];
 let result=lines.map(line=>({...line}));
 if(r.level==='yellow'){const last=result.findLastIndex(l=>!l.lift&&l.mode!=='core');result=result.filter((_,i)=>i!==last).map(l=>({...l,rpe:Math.max(1,l.rpe-.5),weight:l.weight===null?null:roundTo(l.weight*.975,p.step)}));}
 if(r.level==='orange')result=result.filter(l=>l.lift&&l.mode!=='supplementary'&&l.mode!=='test'&&!(l.mode==='single'&&l.rpe>7)).map(l=>({...l,sets:Math.max(1,l.sets-2),weight:l.weight===null?null:roundTo(l.weight*.95,p.step),rpe:Math.min(l.rpe,7)}));
 return result;
}
export function immediateAdjustment(actualRpe:number,target:number,technique:boolean){return !technique||actualRpe>=target+1?-.05:0;}
export function weeklySuggestion(logs:Log[],lift:Lift,week:number,stableSleep:boolean,fatigue=false){
 const recent=logs.filter(l=>l.lift===lift&&l.status!=='skipped'&&l.sets.some(Boolean)).toSorted((a,b)=>a.date.localeCompare(b.date)||a.session.localeCompare(b.session));
 const sessions=[...new Set(recent.map(l=>l.session))].slice(-2);
 if(sessions.length<2)return 0;
 const heavy=sessions.every(s=>recent.some(l=>l.session===s&&(l.rpe>=l.targetRpe+1||!l.technique)));
 if(heavy)return fatigue?-.05:-.025;
 if([4,7,8].includes(week)||!stableSleep)return 0;
 return sessions.every(s=>recent.some(l=>l.session===s&&l.mode==='volume'&&l.rpe<=l.targetRpe-1&&l.technique))?.025:0;
}
