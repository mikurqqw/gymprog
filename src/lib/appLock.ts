import { encryptBackup, decryptBackup } from './cryptoBackup';
export const LOCK_KEY = 'ironcycle:lock';
export const hasAppLock = () => localStorage.getItem(LOCK_KEY) !== null;
export async function setAppLock(pin: string) {
  if (!/^\d{6,12}$/.test(pin)) throw Error('Invalid PIN');
  localStorage.setItem(
    LOCK_KEY,
    await encryptBackup('ironcycle-lock-ok', 'pin:' + pin + ':ironcycle'),
  );
}
export async function verifyAppLock(pin: string) {
  const raw = localStorage.getItem(LOCK_KEY);
  if (!raw || !/^\d{6,12}$/.test(pin)) return false;
  try {
    return (await decryptBackup(raw, 'pin:' + pin + ':ironcycle')) === 'ironcycle-lock-ok';
  } catch {
    return false;
  }
}
export function disableAppLock() {
  localStorage.removeItem(LOCK_KEY);
}
