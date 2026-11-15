import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
test('all pages render without errors and pass serious/critical accessibility checks',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of ['','profile','builder','program','workout','checkin','nutrition','progress','test','library','reference','settings']){
  await page.goto('/#/'+route);await expect(page.locator('h1')).toBeVisible();await page.waitForTimeout(150);
  const result=await new AxeBuilder({page}).analyze();const serious=result.violations.filter(v=>['critical','serious'].includes(v.impact??''));
  expect.soft(serious.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);
 }
 expect(errors).toEqual([]);
});
test('logs persist, timer uses timestamps, backup export is valid',async({page})=>{
 await page.goto('/#/workout');const first=page.locator('.workout-line').first();await first.getByRole('button',{name:'По плану',exact:true}).click();await expect(first.getByRole('button',{name:'Выполнено',exact:true})).toBeDisabled();await expect(page.locator('.rest-timer')).toBeVisible();
 await page.reload();await expect(page.locator('.workout-line').first().getByRole('button',{name:'Выполнено',exact:true})).toBeDisabled();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('ironcycle:data')!));expect(stored.logs[0].weight).toBe(115);expect(stored.timer).toBeGreaterThan(Date.now());
 await page.goto('/#/settings');const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Экспорт JSON',exact:true}).click();expect((await downloaded).suggestedFilename()).toBe('ironcycle-backup.json');
});
test('profile saves new current strength and regenerates the entire plan',async({page})=>{
 await page.goto('/#/profile');await page.getByRole('button',{name:'Текущая сила',exact:false}).click();const input=page.getByLabel('Сейчас (кг)').first();await input.fill('160');await page.getByRole('button',{name:'Далее',exact:true}).click();await page.getByRole('button',{name:'Начать цикл',exact:true}).click();await page.goto('/#/workout');await expect(page.locator('.workout-line').first().locator('.workout-plan')).toContainText('130');
});
test('short sleep updates recommendations and sharp pain removes all heavy work',async({page})=>{
 await page.goto('/#/checkin');await page.getByLabel('День',{exact:true}).fill('2026-11-16');await page.getByLabel('Сон (ч)',{exact:true}).fill('4');await page.locator('#checkin-form').getByRole('button',{name:'Сохранить',exact:true}).click();await page.goto('/#/workout');await expect(page.locator('.readiness-notice')).toContainText('Лёгкая тренировка');
 await page.goto('/#/checkin');await page.getByLabel('День',{exact:true}).fill('2026-11-16');await page.getByLabel('Боль',{exact:true}).selectOption('sharp');await page.locator('#checkin-form').getByRole('button',{name:'Сохранить',exact:true}).click();await page.goto('/#/workout');await expect(page.locator('.workout-line')).toHaveCount(0);await expect(page.locator('.readiness-notice')).toContainText('Отдых и восстановление');
});
test('language, units, theme and demo charts work',async({page})=>{
 await page.goto('/#/settings');await page.getByLabel('Язык',{exact:true}).selectOption('en');await expect(page.locator('h1')).toHaveText('Settings');await page.getByLabel('Units',{exact:true}).selectOption('imperial');await page.getByLabel('Theme',{exact:true}).selectOption('light');await page.goto('/');await expect(page.locator('.strength-grid')).toContainText('308.6');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.goto('/#/progress');page.on('dialog',d=>d.accept());await page.getByRole('button',{name:'Load demo data'}).click();await expect(page.locator('.recharts-line')).not.toHaveCount(0);
});
test('responsive visual pass',async({page})=>{
 for(const width of [375,768,1280,1920])for(const theme of ['dark','light']){
  await page.setViewportSize({width,height:1000});await page.goto('/#/settings');await page.getByLabel('Тема',{exact:true}).selectOption(theme);await page.goto('/');await page.waitForTimeout(400);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${theme}`).toBe(true);
  await page.screenshot({path:`artifacts/screenshots/home-${width}-${theme}.png`,fullPage:true});
 }
});
test('offline cached pages and local logs remain usable',async({page,context})=>{
 await page.goto('/');await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.goto('/#/program');await expect(page.locator('h1')).toHaveText('Программа');await page.waitForTimeout(800);await context.setOffline(true);await page.reload();await expect(page.locator('h1')).toHaveText('Программа');await context.setOffline(false);
});
