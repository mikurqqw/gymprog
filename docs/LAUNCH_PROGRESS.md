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

2 navigation and home; 3 Focus workout; 4 fast onboarding and gate presentation;
5 contextual disclaimers/footer; 6 landing/SEO; 7 design system/install/state polish;
8 exercise text/illustrations/content gate; 9 launch config/feedback/legal checks;
10 hosts/security/multi-engine/performance CI; 11 journeys; 12 final evidence report.

No server, payment, account, subscription, advertising or default analytics is added.
