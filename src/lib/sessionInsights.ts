import type { AppState } from './storage';
import type { Log,Planned } from './schema';
export function sessionKey(state:Pick<AppState,'profile'|'customProgram'>,week:number,day:number){return `${state.profile.goal}:${state.customProgram?.id??'builtin'}:${state.profile.start}:${week}:${day}`;}
export function sessionStats(rows:Planned[],logs:Log[]){
 const matched=rows.flatMap(row=>{const log=logs.find(item=>item.id===row.id&&item.exercise===row.exercise&&item.date===row.date&&item.status!=='skipped');if(!log)return [];const sets=Math.min(row.sets,log.sets.filter(Boolean).length);return sets?[{row,log,sets}]:[];});
 const planned=rows.reduce((sum,row)=>sum+row.sets,0),done=matched.reduce((sum,item)=>sum+item.sets,0);
 return {planned,done,tonnage:matched.reduce((sum,item)=>sum+item.log.weight*item.log.reps*item.sets,0),averageRpe:done?matched.reduce((sum,item)=>sum+item.log.rpe*item.sets,0)/done:null,matched};
}
export function sessionGroups(rows:Planned[]){const groups=new Map<string,Planned[]>();for(const row of rows){const key=`${row.week}-${row.day}`;groups.set(key,[...(groups.get(key)??[]),row]);}return [...groups.values()].sort((a,b)=>a[0].week-b[0].week||a[0].day-b[0].day);}
export function resumeSession(state:AppState,rows:Planned[]){
 const groups=sessionGroups(rows).filter(group=>!state.sessionCompletions[sessionKey(state,group[0].week,group[0].day)]);
 const active=groups.find(group=>group[0].week===state.activeSession?.week&&group[0].day===state.activeSession.day&&state.logs.some(log=>group.some(row=>row.id===log.id&&row.exercise===log.exercise)));
 const selected=active??groups.filter(group=>sessionStats(group,state.logs).done>0).at(-1);if(!selected)return null;
 return {week:selected[0].week,day:selected[0].day,...sessionStats(selected,state.logs)};
}
export function nextOpenSession(state:AppState,rows:Planned[],after?:{week:number;day:number}){return sessionGroups(rows).find(group=>(!after||group[0].week>after.week||group[0].week===after.week&&group[0].day>after.day)&&!state.sessionCompletions[sessionKey(state,group[0].week,group[0].day)])?.[0]??null;}
export function previousExerciseLog(log:Log,logs:Log[]){return logs.filter(item=>item.exercise===log.exercise&&item.date<log.date&&item.status!=='skipped'&&item.sets.some(Boolean)).sort((a,b)=>b.date.localeCompare(a.date)).at(0);}
export function finishSession(state:AppState,rows:Planned[],completedAt:string):AppState{
 if(!rows.length||sessionStats(rows,state.logs).done===0)throw Error('No completed sets');const {week,day}=rows[0];
 return {...state,activeSession:null,timer:null,sessionCompletions:{...state.sessionCompletions,[sessionKey(state,week,day)]:{completedAt,rowIds:rows.map(row=>row.id)}}};
}
