import type { ProgramDocument } from './programDocument';
import { compatible,exerciseById } from './program';
import type { Profile } from './schema';
export function moveRow(doc:ProgramDocument,id:string,direction:number):ProgramDocument{
 const rows=[...doc.rows],index=rows.findIndex(row=>row.id===id),current=rows[index];if(!current)return doc;
 const sibling=rows.map((row,i)=>({row,i})).filter(item=>item.row.week===current.week&&item.row.day===current.day),position=sibling.findIndex(item=>item.i===index),target=sibling[position+direction];
 if(!target)return doc;[rows[index],rows[target.i]]=[rows[target.i],rows[index]];return {...doc,rows};
}
export function duplicateDay(doc:ProgramDocument,week:number,day:number,targetDay:number){if(day===targetDay)return doc;return {...doc,rows:[...doc.rows.filter(row=>row.week!==week||row.day!==targetDay),...doc.rows.filter(row=>row.week===week&&row.day===day).map(row=>({...row,id:crypto.randomUUID(),day:targetDay}))]};}
export function duplicateWeek(doc:ProgramDocument,week:number,target:number){if(week===target)return doc;return {...doc,rows:[...doc.rows.filter(row=>row.week!==target),...doc.rows.filter(row=>row.week===week).map(row=>({...row,id:crypto.randomUUID(),week:target}))]};}
export function programWarnings(doc:ProgramDocument,profile:Profile){
 const warnings:string[]=[];const groups=new Map<string,typeof doc.rows>();
 for(const row of doc.rows){const key=`${row.week}-${row.day}`;groups.set(key,[...(groups.get(key)??[]),row]);if(!compatible(exerciseById(row.exercise),profile))warnings.push(`${row.week}/${row.day+1}: ${row.exercise} · injuryConflict`);}
 for(const [key,rows] of groups){if(rows.length>10)warnings.push(`${key}: >10 exercises`);if(rows.reduce((sum,row)=>sum+row.sets*(row.rest+row.reps*.06),0)>profile.minutes)warnings.push(`${key}: >${profile.minutes} min`);}
 for(let week=1;week<=8;week++){const volumes=new Map<string,number>();for(const row of doc.rows.filter(row=>row.week===week))for(const muscle of exerciseById(row.exercise).muscles)volumes.set(muscle,(volumes.get(muscle)??0)+row.sets);for(const [muscle,sets] of volumes)if(sets>24)warnings.push(`${week}: ${muscle} ${sets} sets`);}
 return warnings;
}
