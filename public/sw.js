const BUILD_ID = '__IRONCYCLE_BUILD_ID__';
const CACHE = `ironcycle-${BUILD_ID}`;
const PRECACHE = []; // @build-precache
let disabled = false;
const pending = new Set();
function track(task) {
  pending.add(task);
  task.then(
    () => pending.delete(task),
    () => pending.delete(task),
  );
  return task;
}
self.addEventListener('install', (event) => {
  event.waitUntil(
    track(
      caches.open(CACHE).then(async (cache) => {
        if (!disabled) await cache.addAll(PRECACHE);
      }),
    ),
  );
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
  if (event.data?.type === 'GET_BUILD_ID') event.ports[0]?.postMessage(BUILD_ID);
  if (event.data?.type === 'DISABLE_CACHE') {
    disabled = true;
    event.waitUntil(
      Promise.allSettled([...pending]).then(() => event.ports[0]?.postMessage('disabled')),
    );
  }
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('ironcycle-') && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
async function fetchAndCache(request) {
  const response = await fetch(request);
  if (response.ok && !disabled) {
    const cache = await caches.open(CACHE);
    if (!disabled) await cache.put(request, response.clone());
  }
  return response;
}
self.addEventListener('fetch', (event) => {
  if (
    disabled ||
    event.request.method !== 'GET' ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  const cached = () =>
    caches.open(CACHE).then((cache) => cache.match(event.request, { ignoreVary: true }));
  if (event.request.mode === 'navigate') {
    event.respondWith(
      track(fetchAndCache(event.request))
        .then(async (response) => (response.ok ? response : ((await cached()) ?? response)))
        .catch(
          async () =>
            (await cached()) ??
            (await caches.match(new URL('./index.html', self.registration.scope))) ??
            Response.error(),
        ),
    );
    return;
  }
  const refresh = track(fetchAndCache(event.request));
  event.waitUntil(refresh.catch(() => undefined));
  event.respondWith(
    cached()
      .then((hit) => hit ?? refresh)
      .catch(() => Response.error()),
  );
});
