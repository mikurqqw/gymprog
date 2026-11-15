import type { Profile } from './schema';
import { dietNeedsClinician } from './health';
export const activityLevels=[{id:'sedentary',value:1.2,steps:'< 5 000'},{id:'lightActivity',value:1.375,steps:'5 000–7 500'},{id:'moderateActivity',value:1.55,steps:'7 500–10 000'},{id:'highActivity',value:1.725,steps:'10 000–12 500'},{id:'veryHighActivity',value:1.9,steps:'> 12 500'}] as const;
export function calorieSafety(p:Profile){const bmi=p.weight/(p.height/100)**2;return {bmi,underweight:bmi<18.5,automaticAllowed:!dietNeedsClinician(p.health)&&p.age>=18,deficitAllowed:bmi>=18.5&&!dietNeedsClinician(p.health)&&p.age>=18};}
export function calibrateEnergy(records:{date:string;weight?:number;calories?:number}[],predicted:number){
 const grouped=new Map(records.map(r=>[r.date,r]));const rows=[...grouped.values()].filter((r):r is {date:string;weight:number;calories:number}=>Number.isFinite(r.weight)&&Number.isFinite(r.calories)&&r.weight!>0&&r.calories!>0).sort((a,b)=>a.date.localeCompare(b.date));
 if(rows.length<14)return null;const start=Date.parse(rows[0].date),end=Date.parse(rows.at(-1)!.date),days=(end-start)/86400000;
 if(days<13)return null;
 const early=rows.slice(0,7).reduce((s,r)=>s+r.weight,0)/7,late=rows.slice(-7).reduce((s,r)=>s+r.weight,0)/7;
 const intake=rows.reduce((s,r)=>s+r.calories,0)/rows.length,estimate=intake-(late-early)*7700/Math.max(7,days-6);
 if(!Number.isFinite(estimate)||estimate<1000||estimate>7000)return null;
 const conservative=predicted*.5+estimate*.5;return {estimate:Math.round(conservative),low:Math.round(conservative*.85),high:Math.round(conservative*1.15),days:Math.round(days+1)};
}
