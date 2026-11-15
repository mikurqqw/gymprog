import type { ProgramDocument } from './programDocument';
import { injuryEffect, applyInjurySafety } from './injuries';
import { armSets } from './templateProgression';
import raw from '../data/powerlifting.json';
import library from '../data/exercises.json';
import { templates } from '../data/templates';
import { dateOffset, load, roundTo } from './formulas';
import type { Exercise, Lift, Planned, Prescription, Profile } from './schema';
export const exercises=library as Exercise[];
export const exerciseById=(id:string)=>exercises.find(e=>e.id===id)!;
export function compatible(exercise:Exercise,p:Profile){return !injuryEffect(exercise,p).blocked&&!exercise.injuries.some(i=>p.injuries.includes(i))&&(p.equipment==='gym'||(p.equipment==='home'?['bodyweight','band','dumbbell']:['bodyweight','band','dumbbell','barbell']).includes(exercise.equipment));}
export function alternatives(id:string,p:Profile){const ex=exerciseById(id);return exercises.filter(e=>e.id!==id&&e.pattern===ex.pattern&&compatible(e,p));}
const offsets:Record<number,number[]>={2:[0,3],3:[0,2,4],4:[0,1,3,5],5:[0,1,2,4,5]};
export function generate(p:Profile,adjustments:Record<string,number>={},shifts:Record<string,string>={},swaps:Record<string,string>={},customProgram:ProgramDocument|null=null):Planned[]{
 let rows:Prescription[];
 if(p.goal==='custom'&&customProgram)rows=customProgram.rows.map(row=>({...row,percent:row.percent===null?null:Math.min(.9,row.percent+(row.week-1)*customProgram.progression)*(customProgram.deloadWeeks.includes(row.week)?customProgram.deloadFactor:1),sets:customProgram.deloadWeeks.includes(row.week)?Math.max(1,Math.floor(row.sets*customProgram.deloadFactor)):row.sets,rpe:customProgram.deloadWeeks.includes(row.week)?Math.min(6,row.rpe):row.rpe}));
 else if(p.goal==='powerlifting')rows=raw as Prescription[];
 else{
  const t=templates[p.goal];rows=[];
  for(let week=1;week<=8;week++)for(let day=0;day<p.days;day++){
   let patterns=[...t.patterns];
   if(p.goal==='arms')patterns=[['squat','press','hinge'][day%3],'biceps','triceps','row',...(p.days<=3?['biceps']:[]),'core'];
   if(p.goal==='armwrestling')patterns=[['squat','press','hinge'][day%3],'pronation','cup',day%2?'side':'rising','row','biceps','core'];
   if(p.goal==='bodybuilding'&&p.days>=4)patterns=p.days===4?(day%2===0?['press','row','pull','shoulder','biceps','core']:['squat','hinge','curlLeg','calf','core']):[['press','shoulder','triceps','press','core'],['pull','row','biceps','grip','core'],['squat','hinge','curlLeg','calf','core']][day%3];
   if(p.goal==='custom')patterns=[...p.priorities.map(k=>k==='bench'?'press':k==='deadlift'?'hinge':k==='squat'?'squat':k),...t.patterns].filter((v,i,a)=>a.indexOf(v)===i).slice(0,6);
   patterns.forEach((pattern,i)=>{
    if(pattern==='cardio'&&day>1)return;
    const choices=exercises.filter(e=>e.pattern===pattern&&compatible(e,p)&&!e.name.en.startsWith('Test'));
    const calibratedId:Record<string,string>={squat:'ex-0',press:'ex-10',hinge:'ex-5'};
    const calibrated=calibratedId[pattern]?exerciseById(calibratedId[pattern]):null;
    const ex=calibrated&&compatible(calibrated,p)?calibrated:choices[day%Math.max(1,choices.length)];if(!ex)return;
    const lift:Lift|null=ex.id==='ex-0'?'squat':ex.id==='ex-10'?'bench':ex.id==='ex-5'?'deadlift':null;
    const specializedSets=p.goal==='arms'&&['biceps','triceps'].includes(pattern)?armSets(p,week,day,pattern,i,patterns):null;
    const deload=week===4||week===8,taper=week===7,reference=(!lift&&p.special[pattern]!==undefined)?pattern:undefined;
    rows.push({id:`${p.goal}-${week}-${day}-${i}`,week,day,exercise:ex.id,lift,reference,mode:pattern==='core'?'core':pattern==='cardio'?'recovery':lift?'volume':'accessory',sets:pattern==='cardio'?1:specializedSets??(deload?2:taper?2:p.goal==='armwrestling'&&p.days>3?2:t.sets),reps:pattern==='cardio'||ex.name.en.toLowerCase().includes('isometric')?20:p.goal==='strength'&&week>4?3:p.goal==='armwrestling'?t.reps+Math.floor((week-1)/2):t.reps,percent:lift?(deload?.6:Math.min(p.goal==='strength'?.85:t.reps<=8?.75:.7,.65+(week-1)*t.progress)):null,rpe:deload?6:7+(week>4?.5:0),rest:lift?3:1.5,tip:ex.cues[0]});
   });
  }
 }
 return rows.map(row=>{
  let exercise=swaps[row.id]??row.exercise;const original=exerciseById(exercise);
  if(!compatible(original,p))exercise=alternatives(exercise,p)[0]?.id??exercise;
  const changed=exercise!==row.exercise;const replacement=exerciseById(exercise);
  // A substituted movement has no calibrated 1RM; never reuse another lift's load.
  const percent=changed?null:row.percent,lift=changed?null:row.lift;
  const offset=p.goal==='powerlifting'?[0,2,4][row.day]:offsets[p.days][row.day];
  const reference=changed?undefined:row.reference;
  const referenceWeight=reference?roundTo((p.special[reference]??0)*(p.specialForm[reference]??1)*(row.week===4||row.week===8?.7:1+(row.week-1)*(p.goal==='armwrestling'?.01:.025)),p.step):null;
  return {...row,exercise,percent,lift,reference,startingWeight:changed?0:undefined,tip:changed?replacement.cues[0]:row.tip,date:shifts[`${row.week}-${row.day}`]??dateOffset(p.start,(row.week-1)*7+offset),weight:lift&&percent!==null?load(p,lift,percent,adjustments[`${row.week}-${lift}`]??0):referenceWeight};
 }).filter(row=>compatible(exerciseById(row.exercise),p)).map(row=>applyInjurySafety(row,exerciseById(row.exercise),p)).filter((row):row is Planned=>row!==null);
}
