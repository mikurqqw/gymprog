import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [375,768,1280,1920])for(const theme of ['dark','light']){
 test(`all layouts ${width}px ${theme}`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height:1000});
  await page.goto('/#/settings');await page.getByRole('combobox',{name:'Тема',exact:true}).selectOption(theme);
  for(const route of ['','program','workout','checkin','nutrition','progress','test','library','reference','settings']){
   await page.goto('/#/'+route);await expect(page.locator('h1')).toBeVisible();await page.waitForTimeout(100);
   expect.soft(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);
   await page.screenshot({path:`artifacts/screenshots/iteration2-${route||'home'}-${width}-${theme}.png`,fullPage:true});
  }
  if(width===375){await page.goto('/');await page.getByRole('button',{name:'Все разделы'}).click();await expect(page.locator('.sidebar.menu-open')).toBeVisible();await page.locator('.mobile-settings').click();await expect(page.locator('h1')).toHaveText('Настройки');const results=await new AxeBuilder({page}).analyze();expect(results.violations.filter(v=>['serious','critical'].includes(v.impact??''))).toEqual([]);}
 });
}
