# IronCycle project constraints

User instruction,2026-11-17: freeze training programs until the user supplies new program files and explicitly authorizes changes. This rule persists beyond the current task.

- Do not change program contents, prescribed exercises/order/sets/repetitions/loads/rest, progression, generators, formulas, injury rules, substitutions or selection logic.
- Existing protected paths/fields are enumerated in docs/PROTECTED_SOURCES.json. Run npm run check:security to verify their hashes. For this UX revision all existing src/data files must also remain unchanged.
- UI-only work is allowed: layout, navigation, progressive disclosure, labels, profile inputs using existing validation and stored fields. Never silently rewrite a program as a side effect of UI cleanup.
- Preserve all existing routes, records, import/export, consent and prominent stop-symptom warnings. Health data is not read before valid consent.
- Follow the existing React/TypeScript/Vite stack. No backend, accounts, payment, ads or default tracking. No new dependency unless justified and authorized.
- Keep RU/KK/EN strings and honest pending human-review flags. See docs/NEXT_STEPS.md for the handoff and known launch limitations.
