# Safety, privacy and release status

2026-11-15. Preview only. Requires review by a qualified Kazakhstan lawyer and
a native Kazakh reviewer. No legal compliance or clinical-safety certification.
Operator placeholders intentionally remain at the user's request.

| Area | Implementation | Status / limits |
|---|---|---|
| Calories | `calorieSafety.ts`, `nutrition.ts`, `CalorieNotice.tsx` | Five activity factors, BMI and medical exclusions, deficit cap, estimated calibration; unit/browser checks. Not individualized medical advice. |
| Food | `database.ts`, `foodRepository.ts`, `FoodCatalog.tsx`, `foods-v2.json` | 729 validated entries; sources/licenses; three-language search, custom entries, favorites, portions and undo. Recipe estimates and halal/allergen uncertainty are explicit. |
| Injuries | `injuries.ts`, `Injuries.tsx`, `program.ts` | Un-cleared loaded joints excluded; cleared reductions; pain/stop rules. Scores are conservative estimates, not clinical validation. |
| Replacement | `replacements.ts`, `ReplacementControl.tsx` | Ranked options, session/week/cycle, undo/restore, clean starting load; results archived. |
| Constructor | `ProgramEditor.tsx`, `ProgramRowEditor.tsx`, `programDocument.ts` | Reorder by pointer or accessible up/down controls; prescriptions, tempo/supersets, duplicate day/week, progression/deload, validated import/export. Touch uses buttons. Volume warnings are heuristic. |
| Programs | `data/programs/`, `programRegistry.ts` | JSON auto-registration; schema in PROGRAM_SCHEMA.md. Existing numeric source plan preserved. |
| Research | `ProgramEvidence.tsx`, `program-evidence.json` | Verified primary sources with limitations; unverified old claims removed from fact presentation; RESEARCH_TODO.md retained. Exact programs are untested. |
| Media | `ExerciseMedia.tsx`, `Library.tsx`, `exercises.json` | Rich trilingual technique, self-hosted fallback, explicit click-to-load YouTube consent. Real instructional media remains missing; see MEDIA_TODO.md. |
| Devices | `device.css`, `WorkoutTools.tsx`, `sw.js` | Safe-area, print, reduced motion, offline/update controls. Existing Chromium visual checks cover 375/768/1280/1920, both themes. Full physical-device / Firefox / WebKit matrix still pending. |
| Legal | `data/legal/`, `Legal.tsx`, `legal.config.ts` | Ten complete trilingual document drafts, footer, attribution. Real operator details, effective date and professional reviews pending. Production build fails; explicit preview works. |
| Consent | `ConsentGate.tsx`, `HealthScreen.tsx`, `consent.ts` | DOB adult gate without storing DOB, five separate unchecked consents, version renewal, health screen, equal storage choices and withdrawal. |
| Data rights | `PrivacyConsent.tsx`, `dataManagement.ts`, `fullBackup.ts` | Full export including local videos/custom foods; erase localStorage, IDB, caches and own service worker. Erasure verified in browser. Full export is plaintext; protect the file. |
| Encryption / PIN | `cryptoBackup.ts`, `BackupSecurity.tsx`, `AppLockGate.tsx` | AES-256-GCM / PBKDF2-SHA256, 600,000 iterations; encrypted profile/log backup excludes videos/catalog. PIN is an interface lock, not encryption at rest. No password recovery. |
| Security | `safeJson.ts`, `video.ts`, `_headers`, SECURITY.md | Import limits/prototype-key rejection, video signature checks, no raw HTML Markdown, local fonts/icons, CSP. GitHub Pages does not honor `_headers`; server-only header protections need another host. |
| Supply chain | CI, Dependabot, CodeQL, `check-security.mjs`, `check-licenses.mjs` | Audit and source secret-pattern/license gates. Hosted CodeQL and platform secret scanning require GitHub execution/settings; local pattern scan is not a complete secret audit. |
| Kazakh | `i18n/kk.json`, feature string modules, translated datasets | 368 equal base keys + feature triples; checked by `check:i18n`. Machine-assisted medical/legal wording still needs native/legal review. |
| UX | Profile, GlobalSearch, WorkoutTools, NotFound | Three-step profile with skip, search links, print/wake lock, same-as-last conservative load, undo, empty/error/offline states. |

## Verification record

- `npm run lint`, `npm run typecheck`, `npm test`: passed (115 unit tests).
- `npm run build:preview`: passed. `npm run build`: expected failure on real placeholders/review flags.
- Browser acceptance: catalog RU/KK/EN, custom/favorites/undo, constructor round-trip
  and invalid input rejection, scoped replacement undo, complete erasure, under-18
  no storage/third-party traffic, adult versioned consent: passed.
- Existing 21-scenario Chromium suite previously passed at the foundation stage.
  New backup/replacement controls required selectors to distinguish their actions;
  those regression cases passed after adjustment. Final broad rerun recorded below.
- `npm run audit`: zero vulnerabilities. Source pattern and all 684 lockfile license
  checks pass. One explicit tooling exception is `sentry@0.49.0`, FSL-1.1-Apache-2.0,
  transitively used by Lighthouse. It is development-only, not bundled or loaded by
  the app. Re-review this non-permissive tooling license on version/use changes.
- Lighthouse >=90 and the complete multi-engine device matrix are not claimed
  without corresponding measured final reports. INP needs real interactions/field data.

## Remaining release work

1. Operator completes actual legal config; counsel reviews Kazakhstan duties,
   Russia/EU visitors and 2026 legislative changes. Native reviewer checks Kazakh.
2. Finish cross-engine/device and performance verification; do not lower gates.
3. Supply licensed instructional media; clinically review exercise stress scores.
4. Consider export size limits for very large video libraries. Legacy idb-keyval
   videos from earlier builds are not migrated by this preview; export them before
   upgrading if needed. App data remains readable through browser tools at rest.

See LEGAL_REVIEW.md, FOOD_DATA.md, PROGRAM_SCHEMA.md, BACKEND_READINESS.md and
INCIDENT_RESPONSE.md for scope and sources. No backend, account or tracker added.

## Final local verification

All 25 Chromium browser scenarios passed, including axe checks and layouts in both themes at 375/768/1280/1920 px. After splitting database loading, six privacy/acceptance scenarios passed again. Lighthouse mobile: {'performance': 96, 'accessibility': 100, 'best-practices': 96, 'seo': 100}. LCP 2748 ms (target 2500 ms remains missed); CLS 0. Category scores pass 90, but the separate LCP gate intentionally remains red. No threshold was lowered. Cross-engine matrix remains pending.

The user subsequently authorized GitHub Pages publication of this explicit preview. Manual Pages dispatch with `preview=true` enables the banner without disabling the default production guard.

## Program storefront update (2026-11-16)

Public product pages and an anonymous in-memory demo now precede personal-data consent. The age/consent/health gates still protect training data. All tools remain. See STOREFRONT.md for verification, commercial limits and rollback. Final public-entry Lighthouse: {'performance': 100, 'accessibility': 100, 'best-practices': 96, 'seo': 100}; LCP 910 ms; all configured assertions passed. This supersedes the previous entry-page performance result, not the pending cross-engine review.

## 2026-11-17 verification and limits

App 1.1.0 uses the owner-approved Royal Blue palette (dark#4F8CFF/light#2563EB), clearer navigation/Focus/onboarding,93 specific RU/KK/EN exercise guides and schematics for34 entries. Existing routes, records and protected calculations remain preserved. No backend or monetization/tracking service was added.

Read [LAUNCH_REPORT](LAUNCH_REPORT.md) for all 12 section statuses, checks and screenshots, and [NEXT_STEPS](NEXT_STEPS.md) to resume. Production is blocked by genuine operator/contact details and independent reviews; explicit preview only. Cold mobile performance/LCP remains below target and strict Lighthouse assertions fail; do not call every check green. Confirmed Delete all erases application stores; withdrawal intentionally retains the journal while stopping access.
