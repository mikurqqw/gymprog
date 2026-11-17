# Launch polish progress

Source request: owner-provided `C:/Users/mikur/Desktop/ga.txt` (2026-11-17).
Working branch: `codex/launch-polish`. Existing deployed baseline: `2126f5e`.

## Section 1.1 — formatting

Commit `c09a06d`: Prettier 3.10.1 (MIT), LF/editor settings, format scripts and CI
gate. Protected files were excluded and their original hashes stayed unchanged.
Whitespace-sensitive build/i18n scanners were made formatting-compatible; media
registry output now has standard JSON indentation/final newline.
Before and after: lint/types/i18n/security/build pass, 121 unit +40 browser tests.

## Section 1.2–1.6 — complete

- UTF-8 manifest, separate safe-zone maskable icon, actual narrow/wide WebP screenshots.
- Build-derived service-worker ID, selective core precache, network-first navigation,
  stale-while-revalidate static files, complete old-cache cleanup and disable handshake.
- Ready numeric Profile separated from empty nullable onboarding draft, schema v2
  migration preserves existing v0/v1 profiles. Fixture data is test/demo-only.
- Development websocket CSP injected only by Vite dev; production output checked.
- Initial static JS budget:170 KiB gzip; current measurement158.5 KiB. Heavy food,
  chart and legal chunks are not in the initial graph or the precache.
- New migration/manifest tests currently bring total to126 unit tests.
- Full lint/type/unit/i18n/security/build/e2e chain passed:126 unit and42 browser scenarios.
- Update-A/B scenario verified user approval, new entry asset, removal of every old cache and offline reload.
- Legacy v1 profile preservation and empty placeholders are tested.
- Protected-source/field verification is now part of check:security.

## Prepared for section 8 (not integrated early)

Three bounded asset tasks produced original trilingual text for ex-0..ex-92 and
30 original SVG schematics under ignored `artifacts/launch-content-*.json` and
`artifacts/launch-illustrations/`. They do not touch source or protected fields.
Human coach/clinician/native review remains pending.

## Remaining sections, in request order

4 fast onboarding and gate presentation;
5 contextual disclaimers/footer; 6 landing/SEO; 7 design system/install/state polish;
8 exercise text/illustrations/content gate; 9 launch config/feedback/legal checks;
10 hosts/security/multi-engine/performance CI; 11 journeys; 12 final evidence report.

No server, payment, account, subscription, advertising or default analytics is added.

## Section 2 — complete

- Five labeled mobile tabs and native full-screen More dialog; grouped desktop sidebar.
- Header search dialog, actual search input, slash shortcut, Escape/focus restoration.
- Home adds actual nutrition rings, personal milestone and last-session summary.
- Existing routes/features retained; no new dependency or stored schema change.
- Full lint/types/unit/i18n/security/build chain passes:126 unit and44 browser tests.
- Two visual iterations at375/768/1280/1920 in both themes; fixed tablet Check-in overflow.
- Navigation regression covers promise-returning scrollTo without returning it from React effects
  (CSSOM View https://drafts.csswg.org/cssom-view/); route changes no longer trigger invalid cleanup.
- Initial JS159.0 KiB gzip; protected hashes unchanged.
- Security review: native modal focus handling, existing consent-controlled storage, no new remote requests.

## Section 3 — complete

- Start workout defaults to Focus unless a presentation was explicitly selected; choice persists.
- One exercise, specific technique expander, per-set weight/reps steppers with hold repeat,
  RPE6–10 descriptions, completion, automatic timestamp timer, +30s/skip, warm-up, plates,
  previous result, scoped replacement and pain/date handoff remain available.
- Previous/Next, exercise progress and existing saved result; wake lock while active,
  optional supported vibration and reduced-motion handling. Compact readiness/why expander.
- Shared Zod-validated log writer retains the existing Log fields; individual sets use reserved
  ::set:N IDs and one boolean, while legacy exercise logs stay readable and expand on editing.
  Schema v3 adds only the nullable presentation preference; v0/v1/v2 migration is tested.
- Updated summaries, replacement archiving, resume and exercise adherence handle both formats.
- Browser regression fixed a first-install waiting-worker notification being mistaken for an update.
- Full checks pass:132 unit +47 browser scenarios; full-session Focus/Overview stored logs identical.
- Focus screenshots320/375/768/1280 in both themes, two visual iterations; serious/critical axe0.
- Initial JS159.4 KiB gzip. Protected-source hashes unchanged; no added remote request/dependency.
- Wake lock and vibration remain platform-dependent progressive enhancements.

## Section 4 — complete, publication checkpoint

- Fast three-step setup: eight goals/body; known/recent-set/explicitly unknown strength;
  equipment/days, existing injury-schema entries, date and summary. Draft autosaves.
- Age/consent/health gates retain their behavior and now have a visible1/3–3/3 indicator.
- Known profiles retain exact numeric values. Version4 stores assessment provenance, with
  tested v0–v3 migrations. Unknown1RM never becomes an automatic numeric workout load;
  its internal compatibility floor is suppressed at the presentation boundary, in warm-up,
  strength totals, max testing and forecast display. See FINDINGS.md for review requirements.
- New KK copy is machine-assisted; onboardingTranslationReview.kkNativeSpeaker=false.
- All checks pass:136 unit and50 browser scenarios, including both strength-entry paths,
  persistence, full Focus/Overview parity, PWA update/offline and erasure.
- Onboarding screenshot/axe checks at320/375/768/1280 in both themes; no serious/critical violations.
- Initial JS161.0 KiB gzip /507.3 KiB raw, under170 KiB gzip budget.
- User requested a deployment/checkpoint instead of continuing the remaining expansion.
  Resume at section5. No section5 code has been integrated.

## Section5 and Royal Blue owner reference — complete

Owner's2026-11-17 reference replaces lime with #4F8CFF dark / #2563EB light.
Royal Blue surfaces/cards/buttons/links are applied across the existing application,
with independent semantic success/warning/danger roles. SVG/PNG PWA icons and manifest
colors match. Tokens and the visual choice are documented in DESIGN_SYSTEM.md.

- Contextual expandable notices on program, calories, injuries, workout and1RM test.
- Calorie summary explicitly retains individual-metabolism limitation; max-test warning
  starts expanded; symptom/pain stop instructions stay prominent. Consent logic unchanged.
- Consistent algorithm chip replaces repeated full AI labels on recommendation cards.
- Footer has3 primary legal links + More legal, language and18+; all documents retained.
- Preview banner remains build-flag gated; no data schema/calculation change.
- Full chain passes:136 unit +52 browser scenarios; protected hashes unchanged.
- Screenshots in both themes at375/768/1280/1920 plus320 storefront/onboarding;
  existing route accessibility and new notice/theme behavior checks pass.
- Initial static JS161.7 KiB gzip (170 budget).
- No dependency, server, tracking or external request added.

## Section6 — complete with explicit hash-routing SEO limit

- Landing: Start free/demo,3 steps,8 directions,6 capability sections,8 honest RU/KK/EN
  FAQs, safety strip, final CTA and compact sources teaser. Food count729 verified.
- Actual fixture-data Focus WebP screens in both themes, fixed dimensions and lazy loading;
  npm run media:capture regenerates them, manifest shots and original1200x630 OG.
- Static fallback/noscript, localized canonical/alternates, unrated SoftwareApplication
  JSON-LD, sitemap/robots derive from validated VITE_SITE_URL. Route titles/lang update.
- URL language is validated and manual switching keeps the URL/reload consistent.
- Hash routes preserved; only real localized landing URLs go into sitemap. Separate
  per-program search indexing needs future public static/History-API routes (FINDINGS.md).
- Full chain:137 unit +54 browser tests pass; protected hashes unchanged.
- Two visual passes in dark/light; screenshot capture now actually loads lazy images
  before taking full-page review shots. Default public routes make no third-party requests.
- Initial static JS162.9 KiB gzip /511.8 KiB raw. No new dependency or stored-data change.
