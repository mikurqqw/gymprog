import { fixtureProfile } from '../src/lib/schema';
import { initialState } from '../src/lib/storage';
import { HEALTH_SCREEN_VERSION } from '../src/config/versions';
import { test as base, expect } from '@playwright/test';
import { legalConfig } from '../src/config/legal.config';
export const test = base.extend<{ adultConsent: void; configuredProfile: boolean }>({
  configuredProfile: [true, { option: true }],
  adultConsent: [
    async ({ page, configuredProfile }, use) => {
      await page.addInitScript(
        ({ versions, initial, fixture, screenVersion, configured }) => {
          if (!localStorage.getItem('ironcycle:consent')) {
            const acceptedAt = new Date().toISOString();
            localStorage.setItem(
              'ironcycle:consent',
              JSON.stringify({
                schemaVersion: 1,
                adult: true,
                acceptedAt,
                language: 'ru',
                versions,
                terms: true,
                privacy: true,
                health: true,
                medical: true,
                calories: true,
              }),
            );
            localStorage.setItem(
              'ironcycle:preferences',
              JSON.stringify({
                language: 'ru',
                necessary: true,
                optionalMedia: false,
                selectedAt: acceptedAt,
              }),
            );
          }
          if (!localStorage.getItem('ironcycle:data'))
            localStorage.setItem(
              'ironcycle:data',
              JSON.stringify({
                ...initial,
                onboarded: configured,
                draftProfile: {
                  ...initial.draftProfile,
                  healthScreenVersion: screenVersion,
                  healthScreenedAt: new Date().toISOString(),
                },
                profile: configured
                  ? {
                      ...fixture,
                      healthScreenVersion: screenVersion,
                      healthScreenedAt: new Date().toISOString(),
                    }
                  : null,
              }),
            );
        },
        {
          versions: legalConfig.documentVersions,
          initial: initialState,
          fixture: fixtureProfile,
          configured: configuredProfile,
          screenVersion: HEALTH_SCREEN_VERSION,
        },
      );
      await use();
    },
    { auto: true },
  ],
});
export { expect };
