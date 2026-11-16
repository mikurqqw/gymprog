import { dataAllowed } from './consent';
let started = false;
export async function startOffline() {
  if (started || !import.meta.env.PROD || !dataAllowed() || !('serviceWorker' in navigator)) return;
  started = true;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    const notify = () => {
      if (registration.waiting && navigator.serviceWorker.controller)
        window.dispatchEvent(new Event('ironcycle:update-ready'));
    };
    notify();
    registration.addEventListener('updatefound', () =>
      registration.installing?.addEventListener('statechange', notify),
    );
  } catch {
    window.dispatchEvent(new Event('ironcycle:offline-error'));
  }
}
export async function activateUpdate() {
  const registration = await navigator.serviceWorker.getRegistration('./');
  if (!registration?.waiting) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
    once: true,
  });
  registration.waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
}
