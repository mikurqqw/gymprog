import { describe, expect, it } from 'vitest';
import { generate, exercises, compatible } from './program';
import { defaultProfile as p } from './schema';
import { dateOffset, e1rm, load, nextMonday, plates, roundTo, warmup, formatDate } from './formulas';
import { goals } from '../data/templates';
const cases:[number,number,number,number][]=[
 [1,0,0,115],[1,0,1,97.5],[1,0,2,60],[1,1,0,115],[1,1,1,97.5],[1,1,2,57.5],[1,2,0,75],[1,2,1,62.5],[1,2,2,87.5],[1,2,3,72.5],
 [2,0,0,120],[2,0,1,100],[2,2,0,77.5],[2,2,1,65],[3,0,0,122.5],[3,0,1,105],[3,2,0,80],[3,2,1,70],
 [5,0,0,122.5],[5,0,1,110],[6,0,0,125],[6,0,1,115],[6,2,0,80],[6,2,1,75],[7,0,0,130],[7,0,1,110],[7,1,0,127.5],[7,2,0,82.5],[8,0,0,90],[8,0,1,62.5],
];
describe('exact Excel acceptance loads',()=>{it.each(cases)('week %i day %i row %i = %i',(week,day,index,weight)=>{expect(generate(p).filter(r=>r.week===week&&r.day===day)[index].weight).toBe(weight);});});
it('reproduces calendar including year boundary',()=>{const rows=generate(p);expect([...new Set(rows.filter(r=>r.week===1).map(r=>r.date))]).toEqual(['2026-11-16','2026-11-18','2026-11-20']);expect(rows.find(r=>r.week===4)?.date).toBe('2026-12-07');expect([...new Set(rows.filter(r=>r.week===8).map(r=>r.date))]).toEqual(['2027-01-04','2027-01-06','2027-01-08']);});
it('derives all loads from current strength, form and weekly adjustment',()=>{const changed={...p,lifts:{...p.lifts,squat:{current:180,pr:200,form:.95}}};for(const r of generate(changed,{'1-squat':-.025})){if(r.lift==='squat'&&r.percent!==null)expect(r.weight).toBe(roundTo(180*.95*r.percent*(r.week===1?.975:1),p.step));}expect(load(p,'bench',.7)).toBe(62.5);});
it('shifts a session without changing surrounding sessions',()=>{const rows=generate(p,{}, {'1-0':'2026-11-17'});expect(rows[0].date).toBe('2026-11-17');expect(rows.find(r=>r.day===1)?.date).toBe('2026-11-18');});
it('substitution never inherits uncalibrated 1RM',()=>{const row=generate(p,{}, {},{'pl-0':'ex-21'})[0];expect(row.weight).toBeNull();expect(row.lift).toBeNull();});
it('deload removes singles, taper removes accessories',()=>{expect(generate(p).filter(r=>r.week===4).some(r=>r.mode==='single')).toBe(false);expect(generate(p).filter(r=>r.week===7).some(r=>r.mode==='accessory')).toBe(false);});
it.each(goals.filter(g=>g!=='powerlifting'))('generates 2–5 day %s templates',goal=>{for(const days of [2,3,4,5]){const rows=generate({...p,goal,days});expect(new Set(rows.map(r=>r.week)).size).toBe(8);expect(new Set(rows.filter(r=>r.week===1).map(r=>r.day)).size).toBe(days);for(let day=0;day<days;day++){const lines=rows.filter(r=>r.week===1&&r.day===day);expect(lines.length).toBeGreaterThanOrEqual(4);expect(lines.length).toBeLessThanOrEqual(7);}}});
it('filters equipment and injury flags',()=>{const home={...p,equipment:'home' as const,injuries:['knee']};expect(exercises.filter(e=>compatible(e,home)).every(e=>!e.injuries.includes('knee')&&!['barbell','machine','cable'].includes(e.equipment))).toBe(true);});
it('generic plans only prescribe 1RM loads for calibrated competition movements',()=>{for(const goal of goals.filter(g=>g!=='powerlifting'))for(const equipment of ['gym','home'] as const){const rows=generate({...p,goal,equipment,days:5});expect(rows.filter(r=>r.lift!==null).every(r=>['ex-0','ex-5','ex-10'].includes(r.exercise))).toBe(true);}});
it('rounds halves up and dates to Mondays',()=>{expect(roundTo(63.75)).toBe(65);expect(nextMonday('2026-11-15')).toBe('2026-11-16');expect(nextMonday('2026-11-16')).toBe('2026-11-16');expect(dateOffset('2026-12-31',1)).toBe('2027-01-01');});
it('estimates only within calibrated RPE table',()=>{expect(e1rm(100,1,10)).toBe(100);expect(e1rm(92.2,1,8)).toBeCloseTo(100);expect(e1rm(100,12,8)).toBeNull();expect(e1rm(100,5,5)).toBeNull();});
it('calculates per-side plates and reports residual',()=>{expect(plates(100).result).toEqual([{plate:25,count:1},{plate:15,count:1}]);expect(plates(101).remaining).toBe(.5);});
it('never warms up above the prescribed work weight',()=>{expect(warmup(140,2.5,87.5).every(s=>s.weight<=87.5)).toBe(true);});
it('reuses calendar formatters without retaining the first formatted date',()=>{const options={weekday:'short',day:'numeric',month:'short'} as const;expect(formatDate('2026-11-16','en-GB',options)).toBe('Mon, 16 Nov');expect(formatDate('2026-11-18','en-GB',options)).toBe('Wed, 18 Nov');});
it('reproduces default totals and historic deficits',()=>{expect(['squat','bench','deadlift'].map(k=>p.lifts[k as keyof typeof p.lifts].current-p.lifts[k as keyof typeof p.lifts].pr)).toEqual([0,-10,-15]);expect(Object.values(p.lifts).reduce((n,l)=>n+l.current,0)).toBe(370);expect(Object.values(p.lifts).reduce((n,l)=>n+l.pr,0)).toBe(395);});
