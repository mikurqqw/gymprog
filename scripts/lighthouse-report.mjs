import { readdir, readFile } from 'node:fs/promises';
const files=(await readdir('.lighthouseci')).filter(file=>/^lhr-.*\.json$/.test(file));
for(const file of files){
 const report=JSON.parse(await readFile('.lighthouseci/'+file,'utf8'));
 const keys=['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift'];
 console.log(JSON.stringify({url:report.finalDisplayedUrl,scores:Object.fromEntries(Object.entries(report.categories).map(([key,value])=>[key,value.score])),metrics:Object.fromEntries(keys.map(key=>[key,report.audits[key].numericValue])),environment:report.environment},null,2));
}
