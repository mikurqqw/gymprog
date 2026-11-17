import { beforeEach, afterEach, expect, it, vi } from 'vitest';
const permission = vi.hoisted(() => ({ allowed: true }));
vi.mock('./consent', () => ({ dataAllowed: () => permission.allowed }));
beforeEach(() => {
  vi.resetModules();
  permission.allowed = true;
  vi.stubGlobal('navigator', { onLine: true });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const off = {
  products: [
    {
      code: '4600000000000',
      product_name: 'Test biscuit',
      nutriments: {
        'energy-kcal_100g': 400,
        proteins_100g: 5,
        fat_100g: 10,
        carbohydrates_100g: 65,
      },
    },
  ],
};
it('makes no request without consent, rejects too-short searches and requests only known providers', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(off)));
  vi.stubGlobal('fetch', fetch);
  const { searchRemoteFood } = await import('./remoteFoodSearch');
  permission.allowed = false;
  await expect(searchRemoteFood('cookie', new AbortController().signal, true)).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
  permission.allowed = true;
  await expect(searchRemoteFood('x', new AbortController().signal, true)).rejects.toThrow();
  const foods = await searchRemoteFood('cookie', new AbortController().signal, true);
  expect(foods).toHaveLength(1);
  const [url, options] = fetch.mock.calls[0];
  expect(new URL(url).origin).toBe('https://world.openfoodfacts.org');
  expect(options).toMatchObject({
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    redirect: 'error',
  });
  expect(new URL(url).searchParams.get('search_terms')).toBe('cookie');
  expect(fetch).toHaveBeenCalledTimes(1);
  await searchRemoteFood('cookie', new AbortController().signal, true);
  expect(fetch).toHaveBeenCalledTimes(1);
});
it('falls back to USDA only after an empty complete-result set and only in preview', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ products: [] })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ foods: [] })));
  vi.stubGlobal('fetch', fetch);
  const { searchRemoteFood } = await import('./remoteFoodSearch');
  await expect(searchRemoteFood('missing', new AbortController().signal, true)).resolves.toEqual(
    [],
  );
  expect(new URL(fetch.mock.calls[1][0]).origin).toBe('https://api.nal.usda.gov');
  vi.resetModules();
  fetch.mockReset().mockResolvedValue(new Response(JSON.stringify({ products: [] })));
  const production = await import('./remoteFoodSearch');
  await production.searchRemoteFood('missing', new AbortController().signal, false);
  expect(fetch).toHaveBeenCalledTimes(1);
});
it('rate limits rapid new queries and rejects oversized responses without fabricating food', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(off)));
  vi.stubGlobal('fetch', fetch);
  const { searchRemoteFood } = await import('./remoteFoodSearch');
  await searchRemoteFood('cookie', new AbortController().signal, false);
  await expect(
    searchRemoteFood('other', new AbortController().signal, false),
  ).rejects.toMatchObject({ reason: 'limit' });
  expect(fetch).toHaveBeenCalledTimes(1);
  vi.resetModules();
  fetch
    .mockReset()
    .mockResolvedValue(new Response('x', { headers: { 'content-length': '3000000' } }));
  const invalid = await import('./remoteFoodSearch');
  await expect(
    invalid.searchRemoteFood('cookie', new AbortController().signal, false),
  ).rejects.toThrow();
});
it('reports a provider outage when the fallback has no results', async () => {
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ foods: [] })));
  vi.stubGlobal('fetch', fetch);
  const { searchRemoteFood } = await import('./remoteFoodSearch');
  await expect(
    searchRemoteFood('cookie', new AbortController().signal, true),
  ).rejects.toMatchObject({
    reason: 'unavailable',
  });
  expect(fetch).toHaveBeenCalledTimes(2);
});
