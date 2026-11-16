let disabled = false;
const pending = new Set();
const CACHE = 'ironcycle-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll(['./', './index.html', './icon.svg', './manifest.webmanifest']),
      ),
  );
});
self.addEventListener('message', (event) => {
  if (event.data?.type === 'ACTIVATE_UPDATE') self.skipWaiting();
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
            .slice(0, -1)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (event) => {
  if (
    disabled ||
    event.request.method !== 'GET' ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  const cached = () => caches.match(event.request, { ignoreVary: true });
  const network = () =>
    fetch(event.request)
      .then(async (response) => {
        if (response.ok) {
          const copy = response.clone();
          const task = caches.open(CACHE).then((cache) => {
            if (!disabled) return cache.put(event.request, copy);
          });
          pending.add(task);
          task.finally(() => pending.delete(task));
          event.waitUntil(task);
          return response;
        }
        return (await cached()) ?? response;
      })
      .catch(
        async () =>
          (await cached()) ||
          (event.request.mode === 'navigate'
            ? await caches.match('./index.html', { ignoreVary: true })
            : Response.error()),
      );
  event.respondWith(
    event.request.url.includes('/assets/') ? cached().then((hit) => hit ?? network()) : network(),
  );
});
