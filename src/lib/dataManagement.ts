import { closeDatabase, DATABASE_NAME } from './database';
import { CONSENT_KEY, PREFERENCES_KEY } from './consent';
export async function deleteAllAppData() {
  closeDatabase();
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const workers = new Set(
      [
        navigator.serviceWorker.controller,
        ...registrations
          .filter((r) => r.scope === new URL('./', location.href.split('#')[0]).href)
          .flatMap((r) => [r.active, r.waiting, r.installing]),
      ].filter((worker): worker is ServiceWorker => !!worker),
    );
    await Promise.all(
      [...workers].map(
        (worker) =>
          new Promise<void>((resolve) => {
            const channel = new MessageChannel();
            const timer = setTimeout(resolve, 3000);
            channel.port1.onmessage = () => {
              clearTimeout(timer);
              channel.port1.close();
              resolve();
            };
            worker.postMessage({ type: 'DISABLE_CACHE' }, [channel.port2]);
          }),
      ),
    );
  }
  const failures: string[] = [];
  for (const key of ['ironcycle:data', CONSENT_KEY, PREFERENCES_KEY, 'ironcycle:lock'])
    try {
      localStorage.removeItem(key);
    } catch {
      failures.push('localStorage');
    }
  for (const name of [DATABASE_NAME, 'keyval-store'])
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => {
        failures.push('IndexedDB');
        resolve();
      };
      request.onblocked = () => {
        failures.push('IndexedDB blocked');
        resolve();
      };
    });
  if ('caches' in window)
    try {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k.startsWith('ironcycle-')).map((k) => caches.delete(k)),
      );
    } catch {
      failures.push('caches');
    }
  if ('serviceWorker' in navigator)
    try {
      const scope = new URL('./', location.href.split('#')[0]).href;
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.filter((r) => r.scope === scope).map((r) => r.unregister()));
    } catch {
      failures.push('service worker');
    }
  window.dispatchEvent(new Event('ironcycle:consent'));
  if (failures.length) throw Error('Deletion incomplete: ' + [...new Set(failures)].join(', '));
}
