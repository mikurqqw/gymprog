# Royal Blue launch revision — 2026-11-17

Public preview: https://mikurqqw.github.io/gymprog/
Source branch: codex/royal-blue-launch. App 1.1.0. This is a preview, not a certified commercial release.

| Section | Status | Evidence |
| --- | --- | --- |
|1 Housekeeping/PWA | Done | format:check; pwa.spec.ts manifest, empty profile, A→B consented update and offline; protected source hashes unchanged. |
|2 Navigation | Done | navigation.spec.ts, mobile5tabs, grouped sidebar/More, slash-search, actionable home; every previous route retained. |
|3 Focus training | Done | focus.spec.ts full Focus/Overview session yields identical validated logs; steppers, RPE, timer, replacement, pain and completion/resume. Physical wake-lock/haptics still need a real-device check. |
|4 Onboarding | Done | onboarding.spec.ts and journey-start.spec.ts in RU/KK/EN: empty numbers,3 steps, known/estimated/unknown, age/consent/health retained; complete first session reaches a real progress table. |
|5 Notices | Done | notices-theme.spec.ts: contextual expanders, always-visible pain stops, one algorithm chip, four-link footer; banner compiled only for preview. |
|6 Storefront/SEO | Done | landing.spec.ts/storefront.spec.ts/check-seo:8 directions,6 features,8 FAQs, actual WebP screenshots, static fallback,1200×630 OG, localized metadata/sitemap/robots. Hash catalog views are not individually indexable pages. |
|7 Design system | Done | Owner's Royal Blue reference supersedes lime. DESIGN_SYSTEM.md; dark/light/system, accessible set controls, reduced motion, install hint after completion; install-theme.spec.ts. Native phone installation remains manual. |
|8 Exercise content | Done, human review pending | check:content:93 specific original trilingual instruction sets;33 original SVG designs cover34 entries. Exercise-content tests RU/KK/EN and both themes; own-media pipeline preserved. No clinician/native approval invented. |
|9 Launch/legal | Partial: code done, real inputs pending | check:launch:preview; production guard rejects unknown operator/contact/review fields even with lawyer-only override. Preferences schema2 privacy boundary tested; privacy/storage preview-2 renewal preserves journal. Feedback disabled until genuine contact supplied. No analytics. |
|10 Hosting/performance | Partial | DEPLOY.md/_headers/COOP/manual production workflow; key flows Chromium/Firefox/WebKit;29 representative routes×3languages×2themes plus More axe checks with zero serious/critical. Widths320/375/414/768/1024/1280/1440/1920, landscape,200%zoom. Cold Lighthouse performance94/87/84/85/86; accessibility100, best-practices96, SEO100, CLS0. LCP3.1–4.5s misses2.5s. Strict performance checks remain failing; no thresholds disabled. |
|11 Journeys | Done with disclosed retention distinction | Full first session, unknown strength, nutrition, scoped replacements+undo, elbow/pain path, legacy import, erasure and under18 in RU/KK/EN; returning state/offline/A→B updates covered separately. Withdrawal revokes processing and retains records as the existing policy states; confirmed Delete all wipes stores/caches/workers. No claim that withdrawal itself erases the journal. |
|12 Handoff | Done | This report, README/STOREFRONT/COMPLIANCE/DEPLOY/LAUNCH_CHECKLIST/FINDINGS/MEDIA_TODO and NEXT_STEPS checkpoint. Screenshot paths below; actual deployment verification recorded separately after publish. |

## Verification

- npm run lint / typecheck / test:148 unit tests pass.
- npm run check:i18n / check:security / check:content / format:check pass.29 direct license entries match versions/licenses;685 resolved packages checked with the documented development-only FSL exception. npm audit:0 vulnerabilities. No dependency added.
- npm run build:preview / check:launch:preview pass. Initial static JS165.0 KiB gzip,170 KiB limit; optional foods/progress/legal/illustrations remain lazy. Worker menus execute the unchanged protected calculation off the main thread, with cancellation/error/retry. Formula/source hashes unchanged.
- npm run e2e -- --workers=4:96 browser scenarios, including Chromium and bounded Firefox/WebKit flows. Full run evidence: artifacts/final-e2e.log. Extra meal-worker test proves failure→retry without changed calorie targets.
- npm run lighthouse: strict mobile cold-start assertions fail. PERFORMANCE.json contains measured scores/LCP/TBT/CLS for all 5 screens. Intermediate warm-cache scores are not launch evidence. Stop-rule applied after3 bounded optimization iterations; further loading work remains.
- Production guard intentionally FAILS on unknown facts/reviews. This is correct protection, not a production-ready build.

## Screenshots and visual review

artifacts/screenshots/launch-{welcome,home,workout,nutrition}-{320,375,768,1280}-{dark,light}.png;
launch-more-{320,375}-{dark,light}.png (desktop equivalent is the grouped sidebar visible in home screenshots).
iteration2-*-1920-{dark,light}.png; library/schematic/onboarding/focus review images also retained.
Two visual iterations fixed contrast, card density, lazy-image capture, keyboard tables and control labels. Real devices, hardware install/lock/vibration and a human native-language review are not simulated approvals.

## Security review and remaining owner work

No backend/accounts/payments/ads/push/default tracking added. No secrets found by source patterns; these checks do not replace platform secret scanning. Untrusted SVG tags/attributes are rejected. Consent remains separate; personal journal is never opened before valid consent. Diagnostics have exactly version/browser/coarse-storage status and never send automatically. Exports contain sensitive data and require user-controlled handling.

Before a commercial launch: supply genuine operator/legal/privacy/support/security contacts and verified hosting/domain facts; qualified Kazakhstan lawyer reviews every legal document, native Kazakh reviewer checks final copy, coach/clinician reviews exercises; verify registration/notification duties, name/trademark and media rights. Keep all review flags false until actual evidence exists. See LAUNCH_CHECKLIST.md. Production remains blocked. Resolve cold-loading budgets; use a host with real headers for the documented response-only protections, and an origin-root security.txt with verified private contact. No DNS/account migration was performed.

Further technical work: split public/application entry and large exercise instruction payloads while preserving every protected calculation/rule field. Preserve existing withdrawal-vs-erasure semantics unless deliberately redesigned with clear disclosure and explicit confirmation. Owner WebP/MP4 filenames are listed in MEDIA_TODO.md; sketches are not professional demonstrations.
