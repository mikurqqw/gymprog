import { it,expect } from 'vitest';
import catalog from '../data/foods-v2.json';
import sources from '../data/food-sources.json';
import { foodSchema,foodSearchText } from './foodSchema';
import { parseSafeJson } from './safeJson';
it('has 600+ unique validated foods with traceable sources and three languages',()=>{const foods=foodSchema.array().min(600).parse(catalog);expect(new Set(foods.map(food=>food.id)).size).toBe(foods.length);for(const food of foods){expect(sources.some(source=>source.id===food.sourceId)).toBe(true);expect(food.license.length).toBeGreaterThan(0);expect(food.name.kk.length).toBeGreaterThan(0);}for(const query of ['бешбармак','beshbarmak','бауырсақ'])expect(foods.some(food=>foodSearchText(food).includes(query))).toBe(true);});
it('blocks prototype pollution and oversized/deep JSON',()=>{for(const raw of ['{"constructor":{}}','{"nested":{"__proto__":{}}}','{"prototype":1}'])expect(()=>parseSafeJson(raw)).toThrow();expect(()=>parseSafeJson('"123456"',3)).toThrow();expect(()=>parseSafeJson('['.repeat(32)+'0'+']'.repeat(32))).toThrow();expect({}.toString).toBe(Object.prototype.toString);});
