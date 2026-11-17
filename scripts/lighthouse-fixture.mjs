import { loadConfigFromFile } from 'vite';
import { writeFile } from 'node:fs/promises';
const loaded = await loadConfigFromFile(
  { command: 'build', mode: 'test' },
  'scripts/lighthouse-fixture.config.ts',
);
const { fixtureProfile, initialState, legalConfig, HEALTH_SCREEN_VERSION } = loaded.config;
const at = new Date().toISOString();
await writeFile(
  'artifacts/lighthouse-fixture.json',
  JSON.stringify({
    'ironcycle:data': {
      ...initialState,
      profile: {
        ...fixtureProfile,
        healthScreenVersion: HEALTH_SCREEN_VERSION,
        healthScreenedAt: at,
      },
      onboarded: true,
      workoutView: 'focus',
    },
    'ironcycle:consent': {
      schemaVersion: 1,
      adult: true,
      acceptedAt: at,
      language: 'ru',
      versions: legalConfig.documentVersions,
      terms: true,
      privacy: true,
      health: true,
      medical: true,
      calories: true,
    },
    'ironcycle:preferences': {
      schemaVersion: 2,
      language: 'ru',
      necessary: true,
      optionalMedia: false,
      selectedAt: at,
      themePreference: 'dark',
    },
  }),
);
