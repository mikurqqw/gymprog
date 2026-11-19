import { z } from 'zod';
import { parseSafeJson } from './safeJson';

export const seriesIds = [
  'fitness',
  'mens_bodybuilding',
  'womens_bodybuilding',
  'powerlifting',
  'weight_loss',
  'gym_first_month',
  'home_dumbbell_gain',
  'home_core_8w',
] as const;
export const seriesId = z.enum(seriesIds);
const profileId = z.string().regex(/^profile_[a-f0-9]{24}$/);
const mode = z.enum(['gym', 'home']);
const cycle = z.number().int().min(1).max(3);
const text = z.string().max(2000);
const fields = z.record(z.string(), text);
export const variantSchema = z.object({
  id: profileId,
  title: text,
  age: text,
  sex: text,
  modes: z.array(mode).min(1).max(2),
});
export const seriesKey = z.object({ profile: profileId, mode, cycle });
export const seriesPlan = seriesKey
  .extend({
    program: seriesId,
    plan: text,
    title: text,
    source: text,
    blocks: z.number().int().min(1).max(8),
    days: z.number().int().min(1).max(8),
    control: fields,
    calendar: z
      .array(
        z.object({
          kind: text,
          phase: text,
          name: text.optional(),
          work: z.array(fields).min(1).max(50).optional(),
          session: fields.optional(),
        }),
      )
      .min(1)
      .max(64),
    following: z.object({ profile: profileId, cycle, plan: text, condition: text }).nullable(),
  })
  .refine((plan) => plan.calendar.length === plan.blocks * plan.days);
export type SeriesPlan = z.infer<typeof seriesPlan>;
export type SeriesVariant = z.infer<typeof variantSchema>;
export type SeriesId = z.infer<typeof seriesId>;
export type SeriesKey = z.infer<typeof seriesKey>;
export const seriesRun = seriesKey.extend({
  id: z.uuid(),
  previous: z.uuid().optional(),
  program: seriesId,
  started: z.iso.datetime(),
  days: z.record(z.string().regex(/^(?:[0-9]|[1-5][0-9]|6[0-3])$/), z.iso.datetime()),
});
export type SeriesRun = z.infer<typeof seriesRun>;

async function fetchData(file: string, signal: AbortSignal, compressed = false) {
  const response = await fetch(import.meta.env.BASE_URL + 'fit-series/' + file, { signal });
  if (!response.ok || !response.body) throw Error('Series data unavailable');
  if (!compressed) return parseSafeJson(await response.text(), 300_000);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > 500_000) throw Error('Series data too large');
  // Some hosts serve .gz with Content-Encoding, so fetch already decoded those responses.
  const decoded =
    bytes[0] === 0x1f && bytes[1] === 0x8b
      ? await new Response(
          new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')),
        ).text()
      : new TextDecoder().decode(bytes);
  return parseSafeJson(decoded, 500_000);
}
export async function loadVariants(id: SeriesId, signal: AbortSignal) {
  return variantSchema
    .array()
    .max(250)
    .parse(await fetchData(seriesId.parse(id) + '.json', signal));
}
export async function loadSeries(key: SeriesKey, signal: AbortSignal) {
  const { profile, mode, cycle } = seriesKey.parse(key);
  const plan = seriesPlan.parse(
    await fetchData(`${profile}-${mode}-${cycle}.json.gz`, signal, true),
  );
  if (profile !== plan.profile || mode !== plan.mode || cycle !== plan.cycle)
    throw Error('Series identity mismatch');
  return plan;
}
export function matchesVariant(variant: SeriesVariant, age: number, sex: 'male' | 'female') {
  if (age < 18 || (variant.sex && variant.sex !== (sex === 'male' ? 'М' : 'Ж'))) return false;
  if (variant.age === '20–64') return age >= 20 && age <= 64;
  if (variant.age === 'Старший 65+') return age >= 65;
  if (variant.age === 'Взрослый 18–64') return age <= 64;
  return !variant.age;
}
export function seriesProgress(plan: SeriesPlan, run: SeriesRun | undefined) {
  const sessions = plan.calendar.flatMap((day, i) => (day.work ? [i] : []));
  const done = sessions.filter((i) => Boolean(run?.days[i])).length;
  return {
    done,
    total: sessions.length,
    next: sessions.find((i) => !run?.days[i]),
    complete: sessions.length > 0 && done === sessions.length,
  };
}
export function nextSeries(plan: SeriesPlan): SeriesKey {
  const next = plan.following ?? { profile: plan.profile, cycle: 1 };
  return { profile: next.profile, cycle: next.cycle, mode: plan.mode };
}
