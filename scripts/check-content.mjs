import { readFile } from 'node:fs/promises';
const exercises = JSON.parse(await readFile('src/data/exercises.json', 'utf8'));
const illustrations = JSON.parse(await readFile('src/data/technique-illustrations.json', 'utf8'));
const ids = new Set(exercises.map((exercise) => exercise.id));
const limits = {
  summary: [30, 600],
  setup: [30, 1800],
  breathing: [15, 600],
  mistakes: [60, 1600],
  safety: [30, 1200],
  videoCheck: [25, 1000],
};
const templates = [
  'controlled work through an available pain-free range, stopping before technical failure',
  'контролируемая работа в доступной безболезненной амплитуде, без технического отказа',
  'қолжетімді, ауыртпайтын аралықта, техника бұзылғанша жеткізбей бақыланатын жұмыс',
];
const clean = (value) => value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
function text(value, min, max, where) {
  if (
    typeof value !== 'string' ||
    value.trim().length < min ||
    value.length > max ||
    /https?:\/\/|www\./i.test(value) ||
    templates.some((phrase) => clean(value).includes(phrase))
  )
    throw Error('Invalid exercise text: ' + where);
}
if (exercises.length !== 93 || ids.size !== 93) throw Error('Expected93 unique exercises');
for (const language of ['ru', 'kk', 'en']) {
  const summaries = new Set(),
    steps = new Set();
  for (const exercise of exercises) {
    text(exercise.name?.[language], 3, 200, exercise.id + '.name.' + language);
    for (const [field, [min, max]] of Object.entries(limits))
      text(exercise[field]?.[language], min, max, exercise.id + '.' + field + '.' + language);
    if (!Array.isArray(exercise.steps) || exercise.steps.length < 3 || exercise.steps.length > 5)
      throw Error('Execution must contain3–5 steps: ' + exercise.id);
    for (const step of exercise.steps)
      text(step?.[language], 10, 600, exercise.id + '.step.' + language);
    if (!Array.isArray(exercise.cues) || !exercise.cues.length)
      throw Error('Missing cues ' + exercise.id);
    for (const cue of exercise.cues)
      text(cue?.[language], 5, 600, exercise.id + '.cue.' + language);
    const summary = clean(exercise.summary[language]),
      movement = exercise.steps.map((step) => clean(step[language])).join('|');
    if (summaries.has(summary) || steps.has(movement))
      throw Error('Duplicate summary or execution: ' + exercise.id + '.' + language);
    summaries.add(summary);
    steps.add(movement);
    for (const field of ['kkNativeSpeaker', 'qualifiedClinician'])
      if (typeof exercise.contentReview?.[field] !== 'boolean')
        throw Error('Missing honest review status ' + exercise.id);
    for (const level of ['easier', 'harder'])
      for (const id of exercise.variations?.[level] ?? [])
        if (id === exercise.id || !ids.has(id))
          throw Error('Invalid variant ' + exercise.id + ' -> ' + id);
  }
}
const tags = new Set(['circle', 'defs', 'g', 'line', 'marker', 'path', 'polyline', 'rect', 'text']);
function node(value) {
  if (!tags.has(value.tag) || !Array.isArray(value.children) || typeof value.attrs !== 'object')
    throw Error('Invalid SVG node');
  for (const [name, text] of Object.entries(value.attrs))
    if (
      /^on|href|style/i.test(name) ||
      typeof text !== 'string' ||
      /https?:|javascript:|data:/i.test(text)
    )
      throw Error('Unsafe SVG attribute');
  for (const child of value.children) node(child);
}
if (Object.keys(illustrations).length < 30) throw Error('Expected at least30 original schematics');
for (const [id, drawing] of Object.entries(illustrations)) {
  if (!ids.has(id) || drawing.viewBox !== '0 0 640 360') throw Error('Invalid schematic ' + id);
  for (const item of drawing.nodes) node(item);
}
console.log(
  `Content verified:93 specific RU/KK/EN exercises, unique summaries/execution, valid variants, honest review fields and${Object.keys(illustrations).length} safe schematic entries.`,
);
