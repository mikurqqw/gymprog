import { parseSafeJson } from './safeJson';
import { parseOffProducts, parseUsdaProducts } from './remoteFoodSchema';
import type { FoodRecord } from './foodSchema';
import { dataAllowed } from './consent';
const cache = new Map<string, { at: number; foods: FoodRecord[] }>();
let nextSearchAt = 0;
export class FoodSearchError extends Error {
  constructor(readonly reason: 'offline' | 'limit' | 'unavailable' | 'invalid') {
    super(reason);
  }
}
async function read(url: URL, signal: AbortSignal) {
  const response = await fetch(url, {
    signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
    cache: 'no-store',
  });
  if (response.status === 429) throw new FoodSearchError('limit');
  if (!response.ok) throw new FoodSearchError('unavailable');
  const length = Number(response.headers.get('content-length'));
  if (length > 2_000_000) throw new FoodSearchError('invalid');
  if (!response.body) throw new FoodSearchError('invalid');
  const reader = response.body.getReader(),
    chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > 2_000_000) {
        await reader.cancel();
        throw new FoodSearchError('invalid');
      }
      chunks.push(result.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return parseSafeJson(new TextDecoder().decode(bytes), 2_000_000);
}
export async function searchRemoteFood(
  query: string,
  signal: AbortSignal,
  allowUsda: boolean,
): Promise<FoodRecord[]> {
  const term = query.normalize('NFKC').trim();
  if (!dataAllowed()) throw new FoodSearchError('unavailable');
  if (term.length < 2 || term.length > 80) throw new FoodSearchError('invalid');
  const key = term.toLocaleLowerCase(),
    saved = cache.get(key);
  if (saved && Date.now() - saved.at < 600_000) return saved.foods;
  if (!navigator.onLine) throw new FoodSearchError('offline');
  if (Date.now() < nextSearchAt) throw new FoodSearchError('limit');
  nextSearchAt = Date.now() + 6500;
  const joined = AbortSignal.any([signal, AbortSignal.timeout(15000)]),
    off = new URL('https://world.openfoodfacts.org/cgi/search.pl');
  for (const [k, v] of Object.entries({
    search_terms: term,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '20',
    fields: 'code,product_name,product_name_ru,brands,nutriments,nutrition_data_per',
    user_agent: 'IronCycle/1.1.0 (+https://github.com/mikurqqw/gymprog)',
    app_name: 'IronCycle',
    app_version: '1.1.0',
  }))
    off.searchParams.set(k, v);
  let foods: FoodRecord[] = [],
    offFailure: FoodSearchError | undefined;
  try {
    foods = parseOffProducts(await read(off, joined));
  } catch (error) {
    if (signal.aborted) throw error;
    offFailure = error instanceof FoodSearchError ? error : new FoodSearchError('unavailable');
  }
  if (!foods.length && allowUsda && !signal.aborted) {
    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.searchParams.set('api_key', 'DEMO_KEY');
    url.searchParams.set('query', term);
    url.searchParams.set('pageSize', '20');
    try {
      foods = parseUsdaProducts(
        await read(url, AbortSignal.any([signal, AbortSignal.timeout(12000)])),
      );
    } catch (error) {
      if (signal.aborted) throw error;
      throw error instanceof FoodSearchError ? error : new FoodSearchError('unavailable');
    }
  }
  if (!foods.length && offFailure) throw offFailure;
  if (cache.size >= 30) cache.delete(cache.keys().next().value!);
  if (signal.aborted) throw signal.reason;
  cache.set(key, { at: Date.now(), foods });
  return foods;
}
if (typeof window !== 'undefined')
  window.addEventListener('ironcycle:consent', () => {
    if (!dataAllowed()) cache.clear();
  });
