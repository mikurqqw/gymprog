# Latest compact onboarding refinement

2026-11-17: latest branch is codex/compact-onboarding-ux. Read SIMPLE_UX.md and SIMPLE_PERFORMANCE.json. Personal details first, custom birth-date modal, consent-only age transfer, compact navigation/home and optional result details.151 unit tests,103 consolidated browser scenarios and3 final stop-warning cases pass. Protected programs and all existing src/data and src/lib files are unchanged.

Owner rejected a temporary audit exception and chose to wait for a patched dependency. Existing audit and publication gates remain unchanged. No Pages publication attempted for this revision; public Pages still serves the old Royal Blue preview. Local review:http://127.0.0.1:4183/#/welcome while the retained server runs. Merge/publication waits for the blocker.

Next: owner reviews compact UI. After an actual dependency fix, run existing checks and explicit preview workflow, then smoke-test public birth-trigger/dialog, compact landing, empty gate, build-info, themes and absence of third-party requests. Older smoke scripts expect input[type=date] and need adapting. No new demo flow or training logic changes are wanted.

# Publication blocker — previous UX revision

Latest compact UI is saved on codex/compact-product-ux. Attempted Pages run44140040134 failed at npm audit, before deployment. The previous public Pages version remains live; do not claim the new compact UI was deployed. A local preview on127.0.0.1:4183 is available for owner review while the session runs.

Existing picomatch4.0.7 now triggers GHSA-fc5q-39xc-vjpf (high ReDoS); the reviewed advisory currently lists affected<=4.0.7 and no patched release. Registry latest is4.0.7. No dependency version, audit threshold, workflow guard or program was changed to evade this block. Do not run npm audit fix --force (it suggests a breaking downgrade). Resume deployment after a genuine reviewed fix exists; otherwise keep the blocker explicit. Source: https://github.com/advisories/GHSA-fc5q-39xc-vjpf

# Latest user constraint and UX revision

2026-11-17: training programs are FROZEN until the owner sends replacement files and authorizes changes. Do not alter program contents/generators/sets/reps/loads/progression/selection/injury rules, now or on continuation. UI-only work is authorized. Read root AGENTS.md and COMPACT_UX.md first. All existing src/data files are unchanged in this revision; current lib-only diff recognizes /about.

Verified current revision:148 unit tests/99 browser scenarios;24 visual review screenshots and the trilingual route/theme matrix. See COMPACT_UX.md and COMPACT_PERFORMANCE.json for exact evidence and remaining cold-start limits.

Compact redesign: short public welcome + /about details, reduced sidebar, native disclosures across screens, visible editable saved profile, experience selector using the existing years field. Body-profile save preserves every unrelated program/profile field and record. Existing routes, old advanced editor and safety/consent functionality remain.

# Continuation checkpoint — Royal Blue preview

Date2026-11-17. Repository https://github.com/mikurqqw/gymprog; preview https://mikurqqw.github.io/gymprog/.
Branch codex/royal-blue-launch. Request source C:/Users/mikur/Desktop/ga.txt plus owner's Royal Blue image.

Implemented sections1–9 and functional parts10–12. Read LAUNCH_REPORT.md for exact status, evidence and limits; LAUNCH_PROGRESS.md for section commits. Preserve current features, paths and existing records. App state schema5, necessary preferences schema2. Privacy/storage versions preview-2 require renewal without deleting existing records. Theme bootstrap only reads nonpersonal preferences before consent.

## Resume here

1. Cold mobile startup: Lighthouse performance welcome94/home87/workout84/nutrition85/program86; LCP3.1–4.5s, goal2.5s. Accessibility100/best-practices96/SEO100/CLS0. Strict assertions intentionally remain failing. Three optimization attempts completed; do not repeat the same blind attempts. Split entry/code/data loading with profiling and preserve protected rules. Current menus already run in a cancellable local worker; catalog initialization batches are atomic.
2. Owner supplies actual legal/operator/hosting/domain/support/security facts and obtains real lawyer/native-Kazakh/coach-clinician reviews. Do not invent values or turn review flags true. LAUNCH_CHECKLIST.md lists fields. Feedback disabled until real recipient exists. Preview security.txt explicitly unconfigured; origin-root/custom-domain reporting remains pending.
3. Real-device install, update, wake-lock/haptics and assistive-technology review. Browser tests do not certify physical devices.
4. Owner exercise WebP/MP4 assets and rights: MEDIA_TODO.md exact filenames.33 original SVG designs cover34 entries;93 trilingual instructional texts are educational and human review pending.
5. Withdrawal stops processing and keeps journal as existing disclosure states; confirmed Delete all wipes localStorage/IndexedDB/caches/workers. Do not silently convert withdrawal into destructive erasure.

## Invariants

Never edit protected paths/fields in docs/PROTECTED_SOURCES.json; npm run check:security enforces canonical hashes. Unknown1RM compatibility floor stays internal: plannedProgram suppresses all automatic numeric prescriptions and forecasts for an unknown lift. Existing Log schema fields stay unchanged; per-set IDs end ::set:N and workbook helpers handle legacy entries.

No server, accounts, payments, subscriptions, ads, push or default tracking. No new dependency this revision. Read LAUNCH_REPORT.md and PERFORMANCE.json before claiming release readiness. Continue on a codex/ branch with scoped commits. Never force-push or expose credentials.

## Publication

Windows GCM authentication works. Ignored artifacts/github_cli.py passes GitHub credential to gh in memory. After local checks fetch origin/main, verify ancestor, push without force; dispatch pages.yml preview=true. Normal production push is intentionally blocked by unknown real facts/reviews. Follow the actual workflow to completion and smoke-test public theme colors, empty new-user gate, manifest/build-info, page errors and zero third-party requests. Do not report publication solely from a local build.
