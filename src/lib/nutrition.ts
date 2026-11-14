import { clamp } from './formulas';
import type { Food, Profile } from './schema';
export function nutrition(p:Profile,day:'heavy'|'medium'|'rest'='medium'){
 const bmr=10*p.weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161);
 const tdee=bmr*p.activity;const change=p.nutritionGoal==='gain'?p.weight*p.pace*7700/7:p.nutritionGoal==='loss'?-Math.min(tdee*.2,p.weight*p.pace*7700/7):p.nutritionGoal==='recomp'?-tdee*.05:0;
 const kcal=Math.round(Math.max(p.sex==='male'?1500:1200,p.nutritionGoal==='loss'?tdee*.8:0,tdee+change+(day==='heavy'?150:day==='rest'?-150:0)));
 const protein=p.weight*1.8,fat=p.weight*.9,carbs=Math.max(0,(kcal-protein*4-fat*9)/4);
 return {bmr:Math.round(bmr),tdee:Math.round(tdee),kcal,protein,fat,carbs,fiber:Math.max(25,kcal/1000*14),water:p.weight*.035,minProtein:p.weight*1.6,maxProtein:p.weight*2};
}
export type Portion={food:Food;grams:number};
export function totals(portions:Portion[]){return portions.reduce((a,{food,grams})=>({kcal:a.kcal+food.kcal*grams/100,protein:a.protein+food.p*grams/100,fat:a.fat+food.f*grams/100,carbs:a.carbs+food.c*grams/100}),{kcal:0,protein:0,fat:0,carbs:0});}
export function allowedFood(food:Food,p:Profile){const allergens=p.allergies.toLowerCase().split(/[,;\n]/).map(s=>s.trim()).filter(Boolean);return !(p.diet==='vegetarian'&&food.tags.includes('meat'))&&!(p.diet==='halal'&&food.tags.includes('pork'))&&!(p.diet==='lactoseFree'&&food.tags.includes('dairy'))&&!allergens.some(a=>`${food.name.ru} ${food.name.en} ${food.tags.join(' ')}`.toLowerCase().includes(a));}
export function mealPlan(p:Profile,foods:Food[],seed=0,day:'heavy'|'medium'|'rest'='medium'){
 const target=nutrition(p,day),allowed=foods.filter(f=>allowedFood(f,p));
 const pick=(tag:string,offset:number)=>{let list=allowed.filter(f=>f.tags.includes(tag));if(p.budget==='low'){const affordable=list.filter(f=>!['Turkey cooked','Tuna canned in water','Cod cooked','Quinoa dry','Couscous dry'].includes(f.name.en));if(affordable.length)list=affordable;}if(p.region==='cis'&&tag==='starch'){const staples=list.filter(f=>!['Quinoa dry','Couscous dry'].includes(f.name.en));if(staples.length)list=staples;}if(!list.length)throw Error('dietUnavailable');return list[(seed+offset)%list.length];};
 const result:Portion[][]=[];
 for(let i=0;i<p.meals;i++){
  const selections=[pick('protein',i),pick('starch',i),pick('oil',0),pick('vegetable',i)];
  const portions=selections.map(food=>({food,grams:food.tags.includes('vegetable')?100:10}));
  // Coordinate descent solves nonnegative portions against the four nutrition targets.
  const goals=[target.protein/p.meals,target.fat/p.meals,target.carbs/p.meals,target.kcal/p.meals];
  for(let iter=0;iter<1200;iter++)for(let j=0;j<3;j++){
   const current=totals(portions),a=[selections[j].p,selections[j].f,selections[j].c,selections[j].kcal].map((n,k)=>n/100/goals[k]);
   const residual=[current.protein,current.fat,current.carbs,current.kcal].map((n,k)=>(n-goals[k])/goals[k]);
   const delta=residual.reduce((sum,n,k)=>sum+n*a[k],0)/a.reduce((sum,n)=>sum+n*n,0);
   portions[j].grams=clamp(portions[j].grams-delta,0,1000);
  }
  result.push(portions.map(x=>({...x,grams:Math.round(x.grams*10)/10})).filter(x=>x.grams>0));
 }
 return {meals:result,total:totals(result.flat()),target};
}
export function weightTrend(weights:{date:string;weight:number}[],p:Profile){const sorted=weights.toSorted((a,b)=>a.date.localeCompare(b.date));const a=sorted.slice(-7),b=sorted.slice(-14,-7);const avg=(x:typeof a)=>x.reduce((s,w)=>s+w.weight,0)/x.length;const mean=a.length?avg(a):p.weight;const change=b.length?(mean-avg(b))/avg(b):0;return {mean,change,pace:Math.abs(change)>p.pace*1.5?'fast':Math.abs(change)<p.pace*.5?'slow':'stable'};}
