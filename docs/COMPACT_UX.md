# Compact UI/UX revision — 2026-11-17

Owner instruction: UI/UX only. Every existing src/data file and every program generator, formula, progression, replacement and injury-rule implementation is unchanged. The only existing lib change is public-route recognition for /about. Program.tsx only wraps explanations; its prescriptions, inputs, row mapping and actions are retained. Root AGENTS.md records the continuing freeze until owner-supplied replacement programs and authorization.

- Short welcome page: one start CTA, demonstration and two compact links. Original directions, screenshots, features, sources and FAQ remain on the public /about page; all existing routes retained.
- Sidebar: overview and four daily sections, one expandable tools area, profile/settings. Mobile More groups remain; legal/contact/feedback extras collapse and legal links stay in footer. Native keyboard-accessible disclosures retain mounted form state.
- Home: next-session action and readiness remain first; week, nutrition/results and detailed metrics expand on demand.
- Workout: calendar/session tools collapse; first navigation to Today chooses Focus when no view was previously chosen. Explicit Overview/Focus preference is respected. Results and pain/stop warnings remain available without opening secondary panels.
- Program: only presentation changes: short header and optional sources/review. No program changes.
- Nutrition: target estimates and diary stay first; preferences, weekly menu and body trends expand. Progress: actual data stays first; forecasts and auxiliary metrics expand.
- Profile: saved basic metrics immediately editable, body/sex/experience use existing schema/fields; saving patches only those fields into the current profile. Existing lift/schedule/nutrition/injury/program fields and logs remain intact. Full old editor is an explicit advanced link.
- Five self-reported experience bands use the existing numeric years field (representative0/0.5/2/4/8years); precise existing values are preserved unless the user changes them. Exact-year input remains available. No new training-selection or assessment rules were introduced.
- Exercise library: summary, diagram and safety stay visible; technique, mistakes/filming and joint loading/alternatives expand. Reference articles keep search; large evidence appendix collapses. Injury history collapses while clearance warnings/add form stay visible.
- Settings: language/theme/units and plain backups remain immediate; equipment, advanced/reset, encrypted backup and install instructions expand. Empty safety-only card removed.

Validation: existing unit, privacy/data/update/offline and cross-browser journeys retained. Tests explicitly open the newly closed panels instead of removing assertions. New trilingual cases verify profile changes preserve all unrelated fields/records and that controls retain edits after closing/reopening; expanded-state axe checks remain enforced. Updated 30-route language/theme matrix covers /about. See artifacts/compact-e2e-final.log for the final consolidated run.

Existing preview/legal/contact/human-review limitations remain. No legal consent version changed: fields and processing remain the same, with no server/tracking/service added. Performance budgets must be measured; no new score is implied by shorter screens.

References checked for the existing React19.3 stack: [controlled selects](https://react.dev/reference/react-dom/components/select) and [native disclosures](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details). No dependency added.

Final evidence:148 unit tests,99 consolidated browser scenarios, plus3 profile cases repeated after final layout/validation polish. Lint/typecheck/i18n/security/content/preview build and bundle budget pass; initial JS166.0KiB gzip/170budget.24 separate review screenshots cover375/768/1280/1920 in both themes; broader existing width/zoom/axe matrix retained. No serious/critical axe violations. Cold Lighthouse results are in COMPACT_PERFORMANCE.json; strict startup/LCP goals still fail and were not relaxed. Existing legal/real-contact review blockers remain unchanged.

Input-edge regression: clearing/invalidating optional exact experience previously could persist NaN/null in an onboarding draft. Reproduced with a failing browser test; bounded Zod validation now retains the last valid value and exact fractional years remain supported. This is input validation only; no profile schema, program field or engine changed.

Publication status: Pages run44140040134 failed at the unchanged npm audit gate (existing picomatch4.0.7, GHSA-fc5q-39xc-vjpf; no patched registry release available at review). No audit guard bypassed and no breaking dependency downgrade applied. Public Pages still serves the previous revision. New compact UI is reviewable locally.99 consolidated browser cases plus4 final profile cases (including the additional invalid-draft regression) passed;148unit tests pass.
