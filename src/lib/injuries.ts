import { z } from 'zod';
import type { Exercise,Profile,Planned,Checkin } from './schema';
import { requiresClearance } from './health';
import { roundTo } from './formulas';
export const joints=['shoulder','elbow','wrist','lowerBack','knee','hip','ankle','neck'] as const;
export const injurySchema=z.object({id:z.string().min(1).max(100),area:z.enum(joints),side:z.enum(['left','right','both']),status:z.enum(['acute','postFracture','postSurgery','overuse','chronic']),severity:z.number().int().min(1).max(3),cleared:z.boolean(),notes:z.string().max(1000)});
export type Injury=z.infer<typeof injurySchema>;
export function jointStress(ex:Exercise,area:Injury['area']){
 if(ex.jointStress&&area in ex.jointStress)return ex.jointStress[area]??0;
 const upper=ex.equipment!=='bodyweight'||['press','row','pull','core','biceps','triceps','grip','pronation','cup','rising','side','wrist','shoulder'].includes(ex.pattern);
 if(['elbow','shoulder','wrist','neck'].includes(area))return upper?2:0;
 if(['knee','hip','ankle'].includes(area))return ['squat','hinge','cardio','calf'].includes(ex.pattern)?2:0;
 return ['squat','hinge','row','core'].includes(ex.pattern)?2:0;
}
export function injuryEffect(ex:Exercise,p:Profile){
 const affected=p.injuryRecords.filter(injury=>jointStress(ex,injury.area)>0&&!(ex.loadingSide==='left'&&injury.side==='right')&&!(ex.loadingSide==='right'&&injury.side==='left'));
 const blocked=affected.some(injury=>!injury.cleared);
 const severity=Math.max(0,...affected.map(injury=>injury.severity));
 return {blocked,affected,loadFactor:severity?[1,.9,.8,.7][severity]:1,volumeFactor:severity?[1,.9,.75,.5][severity]:1,rpeCap:severity?7:10};
}
export function applyInjurySafety(row:Planned,ex:Exercise,p:Profile):Planned|null{
 const effect=injuryEffect(ex,p);if(effect.blocked)return null;
 const screening=requiresClearance(p.health);if((screening||effect.affected.length)&&['single','test'].includes(row.mode))return null;
 const factor=Math.min(effect.loadFactor,screening?.85:1),volume=Math.min(effect.volumeFactor,screening?.75:1);
 return {...row,sets:Math.max(1,Math.floor(row.sets*volume)),weight:row.weight===null?null:roundTo((screening&&row.percent&&row.percent>.65?row.weight*.65/row.percent:row.weight)*factor,p.step),rpe:Math.min(row.rpe,effect.rpeCap,screening?6:10),injuryAdjusted:effect.affected.length>0,adjustmentReasons:effect.affected.map(i=>`${i.area}:${i.side}:${i.status}`),percent:screening&&row.percent!==null?Math.min(.65,row.percent):row.percent};
}
export function stopSymptoms(c:Checkin){return (c.painScore??0)>=4||c.pain==='sharp'||c.worsening||c.dizziness||c.weakness||c.numbness||c.swelling||c.chestPain;}
export function maxTestingAllowed(p:Profile,c?:Checkin){return !requiresClearance(p.health)&&p.injuryRecords.length===0&&!(c&&stopSymptoms(c));}
