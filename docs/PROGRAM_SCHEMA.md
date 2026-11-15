# Program files

`src/data/programs/*.json` is automatically registered by `programRegistry.ts`.
Every file has `schemaVersion: 1`, a unique `id`, `goal`, and a `name` in ru/kk/en.
Built-in entries use `kind: "builtin"` and a template of patterns, reps, sets,
progress and metrics. Powerlifting references the original unchanged numeric plan.

For a submitted program, use `kind: "custom"`, `goal: "custom"`, and a `document`
matching `src/lib/programDocument.ts`. Export from the editor for a working example.
Documents contain rows (stable unique ID, week 1–8, day 0–4, known exercise ID,
calibrated lift or null, mode, sets, reps, percentage fraction or null, RPE, rest in
minutes, ru/kk/en tip, tempo and superset group), progression and deload settings.
Only the three calibrated competition exercise IDs may reference a lift's 1RM.
Limits: 2 MB JSON, 1,200 rows, depth 30, no prototype-related keys.
Session rows run in file order; the same nonempty superset group identifies a pair
or group. Weekly progression adds a fraction of 1RM, capped at 90%; deload scales
sets and percentage and caps RPE at 6. Injury rules are always applied afterward.

Adding a file does not establish evidence or clinical safety. Add verified evidence
and limitations separately. Unverified assertions belong in RESEARCH_TODO.md.
