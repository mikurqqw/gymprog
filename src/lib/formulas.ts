import type { Lift, Profile } from './schema';
export function roundTo(value:number,step=2.5){if(!Number.isFinite(value)||step<=0)throw Error('Invalid rounding input');return Math.round((value+Number.EPSILON)/step)*step;}
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function dateOffset(start:string,days:number){const d=new Date(start+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);}
export function nextMonday(date:string){const day=new Date(date+'T12:00:00Z').getUTCDay();return dateOffset(date,(8-day)%7);}
export function today(){const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function load(p:Profile,lift:Lift,percent:number,adjustment=0){return roundTo(p.lifts[lift].current*p.lifts[lift].form*percent*(1+adjustment),p.step);}
// Tuchscherer-style table: rows RPE 10, 9.5 ... 6, columns 1–10 reps.
const rpeTable=[[100,95.5,92.2,89.2,86.3,83.7,81.1,78.6,76.2,73.9],[97.8,93.9,90.7,87.8,85,82.4,79.9,77.4,75.1,72.3],[95.5,92.2,89.2,86.3,83.7,81.1,78.6,76.2,73.9,71.6],[93.9,90.7,87.8,85,82.4,79.9,77.4,75.1,72.3,69.4],[92.2,89.2,86.3,83.7,81.1,78.6,76.2,73.9,71.6,68.5],[90.7,87.8,85,82.4,79.9,77.4,75.1,72.3,69.4,66.7],[89.2,86.3,83.7,81.1,78.6,76.2,73.9,71.6,68.5,65.3],[87.8,85,82.4,79.9,77.4,75.1,72.3,69.4,66.7,64],[86.3,83.7,81.1,78.6,76.2,73.9,71.6,68.5,65.3,62.6]];
export function e1rm(weight:number,reps:number,rpe:number){if(weight<=0||reps<1||reps>10||rpe<6||rpe>10)return null;return weight/(rpeTable[Math.round((10-rpe)*2)][Math.round(reps)-1]/100);}
export function warmup(oneRm:number,step:number,ceiling=Infinity){const ramps=[{weight:Math.min(20,roundTo(oneRm*.2,step)),reps:10},...[.4,.55,.7,.8].map((p,i)=>({weight:roundTo(oneRm*p,step),reps:[5,3,2,1][i]}))];return ramps.filter((r,i)=>r.weight>0&&r.weight<=ceiling&&ramps.findIndex(x=>x.weight===r.weight)===i);}
export function plates(weight:number,bar=20,available=[25,20,15,10,5,2.5,1.25]){let remaining=Math.max(0,(weight-bar)/2);const result=available.toSorted((a,b)=>b-a).map(plate=>{const count=Math.floor((remaining+1e-6)/plate);remaining-=count*plate;return {plate,count};}).filter(x=>x.count);return {result,remaining:Math.round(remaining*100)/100,belowBar:weight<bar};}
export function strengthLevel(value:number,bodyweight:number,lift:Lift){const limits=lift==='bench'?[.5,.75,1,1.5,2]:lift==='squat'?[.75,1.25,1.75,2.25,3]:[1,1.5,2,2.75,3.5];return clamp(limits.filter(n=>value/bodyweight>=n).length-1,0,4);}
export const displayWeight=(kg:number,units:string)=>Math.round(kg*(units==='imperial'?2.2046226218:1)*10)/10;
export const fromWeight=(value:number,units:string)=>value/(units==='imperial'?2.2046226218:1);

const formatters=new Map<string,Intl.DateTimeFormat>();
export function formatDate(value:string|Date,locale:string,options:Intl.DateTimeFormatOptions){const key=JSON.stringify([locale,options]);let formatter=formatters.get(key);if(!formatter){formatter=new Intl.DateTimeFormat(locale,options);formatters.set(key,formatter);}return formatter.format(typeof value==='string'?new Date(value+'T12:00:00'):value);}
