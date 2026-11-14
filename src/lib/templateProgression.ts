import type { Profile } from './schema';
export function armSets(p:Profile,week:number,day:number,pattern:string,slot:number,patterns:string[]){
 const weekly=pattern==='biceps'?[12,14,16,6,14,16,8,6]:[8,10,12,4,10,12,6,4];
 const count=patterns.filter(x=>x===pattern).length,slots=p.days*count,index=day*count+patterns.slice(0,slot).filter(x=>x===pattern).length;
 return Math.floor(weekly[week-1]/slots)+(index<weekly[week-1]%slots?1:0);
}
export function sessionMinutes(rows:{sets:number;reps:number;rest:number;mode:string}[]){return Math.round(8+rows.reduce((n,r)=>n+Math.max(0,r.sets-1)*r.rest+r.sets*(r.mode==='core'?r.reps/60:.5)+2,0));}
