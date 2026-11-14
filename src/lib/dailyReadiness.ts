import type { Checkin, Profile } from './schema';
import { dateOffset } from './formulas';
import { readiness } from './autoregulation';
type FoodEntry={date:string;kcal:number;protein:number};
export function withFoodHistory(c:Checkin,food:FoodEntry[]):Checkin{const yesterday=food.filter(f=>f.date===dateOffset(c.date,-1));return yesterday.length?{...c,calories:c.calories??yesterday.reduce((n,f)=>n+f.kcal,0),protein:c.protein??yesterday.reduce((n,f)=>n+f.protein,0)}:c;}
export function dailyReadiness(c:Checkin,p:Profile,history:Checkin[],food:FoodEntry[]){return readiness(withFoodHistory(c,food),p,history.map(h=>withFoodHistory(h,food)));}
