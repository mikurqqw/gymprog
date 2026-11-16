import { readdir, readFile, writeFile } from 'node:fs/promises';
const files = await readdir('public/media/exercises');
const map = {};
for (const extension of ['mp4', 'gif', 'webp'])
  for (const file of files) {
    if (new RegExp('^ex-\\d+\\.' + extension + '$').test(file))
      map[file.replace(/\.[^.]+$/, '')] = 'media/exercises/' + file;
  }
const content = JSON.stringify(map, null, 2) + '\n';
let previous = '';
try {
  previous = await readFile('src/data/media.json', 'utf8');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (previous !== content) await writeFile('src/data/media.json', content);
