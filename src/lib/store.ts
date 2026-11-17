import { resolveTheme, systemTheme } from './theme';
import { languageFromSearch, syncLanguageUrl } from './languageUrl';
import { dataAllowed, readConsent, readPreferences, PREFERENCES_KEY } from './consent';
import { detectLanguage } from './language';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { readStorage, STORAGE_KEY, initialState, type AppState } from './storage';
let active = false;
let state = {
  ...initialState,
  theme:
    document.documentElement.dataset.theme === 'light' ? ('light' as const) : ('dark' as const),
  themePreference: ['dark', 'light', 'system'].includes(
    document.documentElement.dataset.themePreference ?? '',
  )
    ? (document.documentElement.dataset.themePreference as AppState['themePreference'])
    : ('dark' as const),
  language: languageFromSearch(location.search) ?? detectLanguage(navigator.languages),
};
let storageError = false;
let undoState: AppState | null = null;
const listeners = new Set<() => void>();
export function update(patch: Partial<AppState> | ((old: AppState) => Partial<AppState>)) {
  const changes = typeof patch === 'function' ? patch(state) : patch;
  const next = { ...state, ...changes };
  if (changes.theme && changes.themePreference === undefined) next.themePreference = changes.theme;
  if (changes.themePreference)
    next.theme = resolveTheme(changes.themePreference, systemTheme() === 'light');
  try {
    if (active && dataAllowed()) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (next.language !== state.language || next.themePreference !== state.themePreference) {
        const preferences = readPreferences();
        if (preferences)
          localStorage.setItem(
            PREFERENCES_KEY,
            JSON.stringify({
              ...preferences,
              language: next.language,
              themePreference: next.themePreference,
            }),
          );
      }
    }
    storageError = false;
  } catch {
    storageError = true;
  }
  if (next.language !== state.language) syncLanguageUrl(next.language);
  state = next;
  listeners.forEach((fn) => fn());
}
export function replaceWithUndo(data: AppState) {
  undoState = state;
  update(data);
}
export function undo() {
  if (undoState) {
    const previous = undoState;
    undoState = null;
    update(previous);
  }
}
export const hasUndo = () => undoState !== null;
export const hasStorageError = () => storageError;
export const StateContext = createContext<AppState>(state);
export const useStore = () => useContext(StateContext);
export const useStoreSnapshot = () =>
  useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
  );
window.addEventListener('storage', (event) => {
  if (active && dataAllowed() && event.key === STORAGE_KEY) {
    const result = readStorage();
    if (!result.error) {
      state = result.data;
      listeners.forEach((fn) => fn());
    }
  }
});

export function startRest(minutes: number) {
  update({ timer: Date.now() + minutes * 60000 });
}

export function activateStorage() {
  if (!dataAllowed()) return;
  const loaded = readStorage();
  const consent = readConsent();
  state = {
    ...loaded.data,
    theme: resolveTheme(loaded.data.themePreference, systemTheme() === 'light'),
    language:
      languageFromSearch(location.search) ??
      readPreferences()?.language ??
      consent?.language ??
      loaded.data.language,
  };
  storageError = loaded.error;
  active = true;
  try {
    const preferences = readPreferences();
    if (preferences)
      localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify({ ...preferences, themePreference: state.themePreference }),
      );
  } catch {
    storageError = true;
  }
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.language;
  listeners.forEach((fn) => fn());
  return state;
}
export function resetMemory() {
  active = false;
  undoState = null;
  state = { ...initialState, language: state.language };
  listeners.forEach((fn) => fn());
}

export function useProfileStore() {
  const current = useStore();
  if (!current.profile) throw Error('Profile setup required');
  return { ...current, profile: current.profile };
}

matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (state.themePreference === 'system')
    update({ theme: systemTheme(), themePreference: 'system' });
});
