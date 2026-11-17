import { z } from 'zod';
import type { Language } from './language';
export function feedbackLink(email: string, version: string, language: Language): string | null {
  if (!z.email().safeParse(email).success) return null;
  return (
    'mailto:' +
    encodeURIComponent(email) +
    '?subject=' +
    encodeURIComponent('IronCycle ' + version + ' / ' + language) +
    '&body=' +
    encodeURIComponent('IronCycle: ' + version + '\nLanguage: ' + language + '\n\n')
  );
}
export function diagnostics(version: string, browser: string, storageAvailable: boolean) {
  return { version, browser, storage: storageAvailable ? 'available' : 'unavailable' };
}
export function diagnosticStorageAvailable() {
  try {
    localStorage.getItem('ironcycle:diagnostic-check');
    return true;
  } catch {
    return false;
  }
}
