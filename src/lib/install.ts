export type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};
let snapshot: { prompt: InstallEvent | null; installed: boolean } = {
  prompt: null,
  installed: false,
};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
// Capture before lazy routes mount; the event stays in memory and never prompts by itself.
window.addEventListener('beforeinstallprompt', (event: Event) => {
  if (typeof Reflect.get(event, 'prompt') !== 'function') return;
  event.preventDefault();
  snapshot = { prompt: event as InstallEvent, installed: false };
  emit();
});
window.addEventListener('appinstalled', () => {
  snapshot = { prompt: null, installed: true };
  emit();
});
export const getInstallSnapshot = () => snapshot;
export function subscribeInstall(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function clearInstallPrompt() {
  snapshot = { ...snapshot, prompt: null };
  emit();
}
