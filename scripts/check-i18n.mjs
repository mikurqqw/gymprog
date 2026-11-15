import { readFile,readdir } from 'node:fs/promises';
const languages=['ru','kk','en'],dictionaries=await Promise.all(languages.map(async lang=>JSON.parse(await readFile(`src/i18n/${lang}.json`,'utf8'))));
const expected=Object.keys(dictionaries[0]).sort();
for(let i=1;i<languages.length;i++)if(JSON.stringify(Object.keys(dictionaries[i]).sort())!==JSON.stringify(expected))throw Error(`Translation key mismatch: ${languages[i]}`);
const featureKeys=new Set();
for(const name of await readdir('src/i18n'))if(name.endsWith('Strings.ts')||name==='features.ts'){const source=await readFile(`src/i18n/${name}`,'utf8');for(const match of source.matchAll(/(\w+)\s*:\s*\{ru:/g))featureKeys.add(match[1]);for(const entry of source.matchAll(/\w+\s*:\s*\{ru:([^}]+)\}/g))if(!entry[1].includes('kk:')||!entry[1].includes('en:'))throw Error(`Missing feature translation in ${name}`);}
const missing=new Set();
async function walk(path){for(const item of await readdir(path,{withFileTypes:true})){const file=path+'/'+item.name;if(item.isDirectory())await walk(file);else if(/\.tsx?$/.test(file)&&!file.endsWith('.test.ts'))for(const match of (await readFile(file,'utf8')).matchAll(/\bt\('([^']+)'\)/g))if(!expected.includes(match[1])&&!featureKeys.has(match[1]))missing.add(match[1]);}}
await walk('src');if(missing.size)throw Error('Missing UI keys: '+[...missing].join(', '));
for(const file of ['exercises','foods-v2','powerlifting']){const rows=JSON.parse(await readFile(`src/data/${file}.json`,'utf8'));for(const row of rows){const text=row.name??row.tip;if(!text||languages.some(lang=>!text[lang]?.trim()))throw Error(`Missing data translation: ${file}/${row.id}`);}}
console.log(`Translation checks passed: ${expected.length} base keys, ${featureKeys.size} feature keys; RU/KK/EN data.`);
