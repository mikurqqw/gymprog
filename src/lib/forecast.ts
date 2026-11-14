import { clamp, e1rm, strengthLevel } from './formulas';
import { liftIds, type Profile, type Log, type Checkin } from './schema';
import { nutrition } from './nutrition';
export function forecast(p:Profile,logs:Log[],adherence=1,checkins:Checkin[]=[]){
 const monthly=p.experience<1?.025:p.experience<3?.015:.0075;
 const recent=checkins.toSorted((a,b)=>a.date.localeCompare(b.date)).slice(-14);
 const average=(values:number[],fallback:number)=>values.length?values.reduce((a,b)=>a+b,0)/values.length:fallback;
 const sleep=average(recent.map(c=>c.sleep),p.sleep),target=nutrition(p);
 const nutritionAdherence=average(recent.filter(c=>c.calories!==undefined&&c.protein!==undefined).map(c=>(clamp(c.calories!/target.kcal,.4,1)+clamp(c.protein!/target.protein,.4,1))/2),.85);
 const relative=average(liftIds.map(l=>strengthLevel(p.lifts[l].current,p.weight,l)),1);
 const recovery=clamp(sleep/8,.5,1.1)*(p.nutritionGoal==='loss'?.65:1)*(p.age>50?.7:1)*(1-relative*.07)*nutritionAdherence;
 const lifts=liftIds.map(lift=>{const {current,pr}=p.lifts[lift];const memory=Math.min(Math.max(0,pr-current)*.65,current*.06);const measured=logs.filter(l=>l.lift===lift&&l.status!=='skipped'&&l.sets.some(Boolean)).toSorted((a,b)=>a.date.localeCompare(b.date)).map(l=>e1rm(l.weight,l.reps,l.rpe)).filter((n):n is number=>n!==null);const trend=measured.length>=3?clamp((measured.at(-1)!-measured[0])*.5,-current*.05,current*.05):0;const gain=(current*monthly*2+memory)*recovery*clamp(adherence,0,1)+trend;const endpoints=[current+gain*.3,current+gain*1.5].sort((a,b)=>a-b);return {lift,current,pr,low:Math.round(endpoints[0]*10)/10,realistic:Math.round((current+gain)*10)/10,high:Math.round(endpoints[1]*10)/10};});
 const direction=p.nutritionGoal==='gain'?1:p.nutritionGoal==='loss'?-1:0;
 const bodyweight=p.weight*(1+direction*p.pace*8),bodyRange=[p.weight+(bodyweight-p.weight)*.5,p.weight+(bodyweight-p.weight)*1.5].sort((a,b)=>a-b);
 return {bodyRange,lifts,total:lifts.reduce((s,l)=>s+l.realistic,0),bodyweight,monthly,recovery,adherence,sleep,nutritionAdherence,relative};
}
