# Legal content review and release checklist

All legal texts in `src/data/legal/` require review by a qualified Kazakhstan lawyer. Kazakh legal and medical translations also require review by a native speaker. These are substantive working drafts, not a legal opinion, certification or representation that an unknown operator already complies with every applicable law.

## Asset contract

Each JSON document contains `id`, localized `title` (`ru`, `kk`, `en`), `sections` of localized `heading`/`body`, `requiresReview: true`, and `sources` with `title`, `url`, `checkedOn`. The ten IDs are `terms`, `privacy`, `storage`, `ai`, `medical`, `advertising`, `operator`, `sources`, `accessibility`, `contact`. Sections are complete text, not deferred implementation instructions.

Interpolation tokens deliberately identify unknown real facts: `{{operator.name}}`, `{{operator.status}}`, `{{operator.identifier}}`, `{{operator.registration}}`, `{{operator.address}}`, `{{operator.legalEmail}}`, `{{operator.privacyEmail}}`, `{{operator.hostingProvider}}`, `{{operator.serverLocation}}`, `{{operator.jurisdiction}}`, `{{operator.disputeForum}}`, `{{effectiveDate}}`. A token must never become a fake mailto address. Do not use fabricated identifiers or contacts to pass a production guard. Determine whether and how an individual IIN may lawfully be published rather than automatically exposing it.

## Verified primary facts (15 November 2026)

- [Gov.kz: acute deterioration and emergency help](https://www.gov.kz/situations/55/199?lang=ru), updated 14 October 2026, confirms Kazakhstan ambulance 103 and multi-service emergency 112. Use those numbers only with the Kazakhstan location qualifier. This does not establish clinical diagnostic thresholds.
- [GitHub Pages documentation: data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) explicitly states that GitHub logs visitor IP addresses for security regardless of sign-in. Consequently, never promise that opening a hosted app involves no personal-data processing whatsoever.
- [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement), displayed effective date 27 April 2026, describes provider-side connection information and international infrastructure. It does not establish the app operator's own legal status or a specific server country for every request.
- [YouTube embedding documentation](https://support.google.com/youtube/answer/171780?hl=en) describes youtube-nocookie privacy-enhanced mode. It is not a promise of anonymity or zero external processing. Require permission and a click before creating an external iframe/request.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the accessibility design reference. A Lighthouse/axe score is not certification of full WCAG conformance.
- [Dexie license](https://github.com/dexie/Dexie.js/blob/master/LICENSE) is Apache-2.0. Installed starting dependencies were checked from package metadata: React/React DOM/React Router/Tailwind/Vite/Zod/Recharts/react-markdown MIT; TypeScript/idb-keyval Apache-2.0; lucide-react ISC. Generate the actual complete dependency inventory for the final build.

## Legal questions that remain for counsel

1. Determine the real operator, legal status, business model, address and operational contact channels. Decide what identifiers are legally necessary to publish.
2. Verify current Kazakhstan law for this exact architecture, including consent, operator roles, sensitive health information, localization, retention, security, user rights, incident reporting, advertising and consumer terms. Local-only processing is not asserted to be automatically exempt.
3. The official [Adilet law page](https://adilet.zan.kz/rus/docs/Z1300000094) required JavaScript during research; the old Adilet text endpoint returned an error. The current consolidated text and amendments were not independently inspected. No exact article, legal deadline, registration exemption or localization exception is asserted in the public drafts on that basis.
4. Review Russia-facing obligations where relevant. An [official ministry copy of Federal Law 152-FZ](https://mintrud.gov.ru/docs/laws/130) is discoverable, but its current consolidated status and applicability to this operator were not established. Do not infer that every Russian visitor automatically triggers, or never triggers, every obligation.
5. Review EU applicability, territorial scope, data categories, consent, rights and transfers where relevant. The [official GDPR text endpoint](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) was blocked by a JavaScript/anti-bot screen during research. The drafts do not claim an article-by-article GDPR assessment or an exemption.
6. Finalize governing law, dispute process and mandatory rights. Never promise an enforceable blanket liability waiver or invent a monetary cap.
7. Establish legally reviewed response/breach notification procedures and deadlines. The texts deliberately do not invent numerical deadlines.
8. Review all translations for consistent meaning, especially medical stop signals, withdrawal, health-data consent and non-excludable rights. Decide any controlling-language arrangement expressly; none is invented by these drafts.

## Match the final implementation

- Entry must check age without reading legacy personal records first. Rejected birth dates remain in memory only. Persist only an adult-confirmation result after appropriate consent; no raw DOB in the consent record.
- Use separate unchecked choices for terms, privacy/processing, health data, injury risk and calorie-estimate limitations. Versions, language and timestamps must match the displayed documents. Re-prompt for material document-version changes.
- The storage page must display the exact current inventory. Agreed keys: `ironcycle:data`, `ironcycle:consent`, `ironcycle:preferences`, optional `ironcycle:lock`; IndexedDB `IronCycle` tables `foods`, `favorites`, `videos`, `metadata`; legacy `keyval-store`/`keyval` video support; caches `ironcycle-*`; app-scoped service worker. Remove unavailable optional entries or mark them accurately as conditional.
- Do not create databases/caches/register service workers before the required gate. Static own-origin files and inherent host logs must be distinguished from optional third-party calls.
- Delete only IronCycle namespaces and app-scoped registrations. Do not erase unrelated applications sharing the origin. Explain that downloaded backups, other-device copies, host logs and sent emails are separate.
- Support contact cannot see a local journal unless a user explicitly sends it. Do not describe a nonexistent upload, account, real-time AI or analytics pipeline.
- Optional encryption/PIN claims must match actual code: PIN lock is not encryption at rest; passphrases cannot be recovered by the operator. Plain JSON must not silently claim to include video blobs.
- Food/media/dependency attribution must come from real current metadata. No inference of rights from public availability or a visible source link.
- Terms/privacy acceptance must not purport to waive rights that cannot legally be waived. Pain >=4 is an application safety trigger, not a clinical threshold or proof of safety below 4.

## Production gate

Production must fail with unknown operator details, unresolved required review status, or unresolved placeholders. A distinct explicit preview flag can permit testing with a visible preview/review banner. Do not silently apply that flag to public production deployment to bypass this requirement. Final counsel approval and native-speaker approval are human release prerequisites; software tests cannot supply them.
