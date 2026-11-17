# Compact onboarding and everyday UI — 2026-11-17

Branch: codex/compact-onboarding-ux. Owner requested a compact interface, custom birth-date entry, editable personal details and optional explanations. Demo promotion was removed from the short landing/header; the existing direct route remains compatible.

## Changes

- BirthDatePicker replaces the browser calendar with a themed native modal, separate year/month/day selectors, date preview, confirmation/cancel and Escape/focus restoration. No date is guessed. Impossible days reset when year/month changes; future dates cannot be confirmed. Existing exact18+ validation remains.
- Supported age transfers to the onboarding draft only after explicit consent and storage activation, only without a saved profile. Birth date stays in component memory and is cleared after consent. No new storage schema or service.
- Setup starts with age, height, weight, sex and existing experience choices. Direction selection moves to the final settings step; eight existing choices, defaults and completion logic remain unchanged. Direction explanations and the repeated final summary expand on request.
- SavedProfile retains schema validation and updates only the same five personal fields. A training-preferences summary links to the existing advanced editor. No new program-selection or strength logic.
- Landing keeps one start action and catalog/about links. Desktop navigation shows four daily sections, More, profile and settings. Overview remains accessible through the brand and More; all routes remain.
- Home hides supporting metrics behind More, makes readiness compact and retains resume/start behavior. Red readiness text and every stop reason remain outside closed hints. Recommendation explanations remain optional.
- Workout results show completed sets, tonnage and RPE first. Exercise comparisons expand on demand; finish/reopen/next-session behavior and records remain unchanged.
- Royal Blue, RU/KK/EN, keyboard navigation,44px targets and reduced-motion support remain. No dependency added or updated.

## Verification

- npm test:151 pass, including invalid/future/leap-date and birthday-boundary cases.
- Full Playwright run:103 scenarios pass, artifacts/simple-final-e2e.log. After final stop-warning review,3 additional RU/KK/EN cases pass, artifacts/simple-safety-e2e.log.106 unique scenarios, two batches.
- lint, typecheck, format:check, check:i18n, check:content, check:security, build:preview and check:launch:preview pass. Protected hashes and dependency licenses pass. All existing src/data and src/lib files are byte unchanged.
- Two visual review iterations,32 dedicated screenshots each:375/768/1280/1920, light/dark, landing/home/profile/birth dialog. No overflow; dialog centering corrected after first review. Metadata:artifacts/simple-dimensions.json. Broader width/zoom and30-route trilingual axe matrix also passes, zero serious/critical findings.
- At375px light: landing document height2189→1449px; home1677→1310px. Profile1266→1359px includes the practical training-preferences summary. Page dimensions are not speed measurements.
- Initial static JS167.5KiB gzip, within170KiB budget, previously166.0KiB. Final build ID7a9c9733eb66cf23. Current Lighthouse results:SIMPLE_PERFORMANCE.json; existing strict thresholds remain.
- Cold mobile Lighthouse performance94/86/83/83/85 for welcome/home/workout/nutrition/program; accessibility100, best practices96, SEO100, CLS0 throughout. LCP3148–4553ms exceeds2500ms, so Lighthouse exits1. Nutrition's previous single run was99/LCP1528ms; current83/LCP4393ms remains an unresolved cold-start measurement difference. No performance improvement or production readiness is claimed.

## Security and remaining limits

Diff review: no new network requests, secrets, unsafe HTML, accounts, backend or dependency. Birth date is never saved; no personal writes before valid consent. Basic profile save preserves unrelated fields and journal. Adult blocking, policy renewal, erasure, import/export, offline and stop-symptom tests remain.

npm run audit still reports12 high findings from existing picomatch advisory GHSA-fc5q-39xc-vjpf. Owner declined a temporary exception and chose to wait for a fixed release. Existing audit and publication gates remain unchanged. GitHub Pages still serves the previous preview; local review:http://127.0.0.1:4183/#/welcome. Legal/contact facts and genuine human review remain pending. No public deployment is claimed.

Training content, generators, progression, prescriptions, formulas, substitutions and injury rules remain frozen until owner supplies replacement programs and explicitly authorizes changes. Keep AGENTS.md and PROTECTED_SOURCES.json intact.

References for existing React19.3/browser primitives: https://react.dev/reference/react-dom/components/select and https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog . No external code copied.
