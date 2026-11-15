import { z } from 'zod';
export const healthKeys=['heart','bloodPressure','chestPain','dizziness','boneJoint','recentSurgery','pregnancy','diabetes','kidneyDisease','medications','doctorRestrictions'] as const;
export const healthSchema=z.object(Object.fromEntries(healthKeys.map(key=>[key,z.boolean()])) as Record<typeof healthKeys[number],z.ZodBoolean>);
export type HealthScreen=z.infer<typeof healthSchema>;
export const clearHealth:HealthScreen={heart:false,bloodPressure:false,chestPain:false,dizziness:false,boneJoint:false,recentSurgery:false,pregnancy:false,diabetes:false,kidneyDisease:false,medications:false,doctorRestrictions:false};
export const requiresClearance=(health:HealthScreen)=>Object.values(health).some(Boolean);
export const dietNeedsClinician=(health:HealthScreen)=>health.pregnancy||health.diabetes||health.kidneyDisease||health.medications;
