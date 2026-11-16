# Legal text change assessment — Focus, installation hint and feedback

Prepared 2026-11-17 from the current legal JSON, legal config, consent version checks, docs, workflow and settings implementation. No legal text or version was modified. This is an integration review memo, not a legal opinion. Final RU/KK/EN changes require qualified Kazakhstan lawyer and native Kazakh review; existing review flags stay false.

## Baseline and boundary

The current consent registry tracks `terms`, `privacy`, `storage`, `medical` and `calories`, all `preview-1`. `validConsent()` compares every configured key/value with the saved record. Therefore bumping any tracked document version currently invalidates full consent and invokes the existing gate. There is no existing separate contact-document version in this registry. Do not add one mechanically or bump all five versions for cosmetic UI changes.

The repository snapshot still shows the earlier workout/settings implementation; Focus mode, completion-triggered install hint and feedback diagnostics are proposed changes. This memo assumes they preserve existing log writes, stay local, use no remote API, and open feedback only on a user action. Verify these assumptions against final code before updating policies.

## Document-by-document decision

| Text | Required change for these features | Version handling when integrated |
| --- | --- | --- |
| `terms.json` | No inherent change for presenting the same workout in Focus/Overview or showing a local install hint. Local data/backups/availability and external sites are already covered. Revisit only if a new promise, obligation or data flow is actually introduced. | Keep `terms` unchanged for presentation-only work. |
| `privacy.json` | Small precise clarification in external links/contact section: feedback pre-fills app version and language, user controls sending, no journal/health data is attached automatically. Explain user-triggered copy diagnostics only if implemented. Existing correspondence/provider caveats remain. | If this clarification is actually added, assign a new `privacy` revision only; counsel assesses materiality. Current code will re-prompt regardless of whether the edit is explanatory. Do not bump in advance. |
| `storage.json` | Update exact inventory for any persisted Focus/Overview preference and install-hint dismissal/eligibility. Use actual namespace/field, purpose, timing and deletion behavior from final code. No new key is assumed here. No update is needed for ephemeral state alone. | Bump `storage` only if the text/inventory actually changes. Keep old key names intact unless the implementation has a reviewed compatible migration. |
| `contact.json` | Explain prefilled version/language, no automatic send, optional user-added message and minimal copied diagnostics. Keep privacy/security contact distinction and no-emergency/no-guaranteed-response limitations. | Record a content revision in release notes. No corresponding consent-version key currently exists; do not invent a consent requirement solely to version contact instructions. |
| `operator.json` | Fill real factual values later; change hosting wording only if actual providers change. Focus/install/mailto do not alter operator identity by themselves. | No new standalone consent key; counsel reviews actual factual amendments. |
| `ai.json` | No inherent change: rule-based recommendations and AI-assisted authorship remain accurate. Focus UI is not a live AI assistant. Existing error-report guidance already requests version/language. | No tracked version change. |
| `medical.json` and calorie warning | Keep existing stop symptoms, injury cautions, 18+ requirements and estimate limits. Collapsing some notices must not remove their accessibility or prominent stop guidance. No new medical wording is required solely by these UI changes. | Keep `medical` and `calories` unchanged unless substantive text actually changes. |
| `advertising.json` | No change while no ads/payments/affiliates are added. An install hint for this same local PWA is not a new ad pipeline. | No tracked version change. |
| `sources.json` | No change solely for Focus/install/mailto. Separate section 8 original SVG attributions and final dependency-license metadata need their own factual review, not an implied medical approval. | Record factual attribution updates separately; no blanket consent bump. |
| `accessibility.json` | Existing navigation, alternatives and limitation language covers the redesign. Add only verified feature instructions or limitations that materially help users; no conformance claim based on new visuals. | No tracked version change for these features alone. |

## Suggested narrow wording for feedback clarification

These are original draft snippets for later integration, not already approved replacements. Avoid duplicating them across every legal page; the privacy paragraph explains flow, contact page gives instructions. Preserve the existing host metadata, international infrastructure, retention/rights and health warnings.

Privacy/contact flow:

- RU: «Кнопка обратной связи открывает выбранное почтовое приложение с черновиком, где заранее указаны версия IronCycle и язык интерфейса. Это действие не отправляет сообщение автоматически. Дневник, показатели здоровья и видео не прикладываются. Проверьте текст и получателя перед отправкой: добавленные вами сведения получат оператор и используемые почтовые службы.»
- KK, machine-assisted: «Кері байланыс түймесі таңдалған пошта қолданбасында IronCycle нұсқасы мен интерфейс тілі алдын ала жазылған хат жобасын ашады. Бұл әрекет хабарламаны автоматты түрде жібермейді. Күнделік, денсаулық көрсеткіштері және бейнелер тіркелмейді. Жіберер алдында мәтін мен алушыны тексеріңіз: сіз қосқан мәліметтерді оператор мен пайдаланылатын пошта қызметтері алады.»
- EN: “The feedback button opens your chosen mail application with a draft containing the IronCycle version and interface language. It does not automatically send a message. Journals, health measurements and videos are not attached. Check the message and recipient before sending: the operator and mail services used receive information you choose to include.”

Only if copy diagnostics exists and its final payload matches:

- RU: «По вашему нажатию “Скопировать диагностику” в буфер обмена помещаются версия приложения, сведения о браузере и состояние доступности локального хранилища. Записи тренировок, питания, травм и другие показатели здоровья не включаются. Копирование не отправляет данные оператору; проверьте текст перед вставкой в сообщение.»
- KK, machine-assisted: «“Диагностиканы көшіру” түймесін басқанда алмасу буферіне қолданба нұсқасы, браузер туралы мәлімет және жергілікті сақтау орнының қолжетімділік күйі көшіріледі. Жаттығу, тамақтану, жарақат жазбалары және басқа денсаулық көрсеткіштері қосылмайды. Көшіру деректерді операторға жібермейді; хабарламаға қоймас бұрын мәтінді тексеріңіз.»
- EN: “When you choose Copy diagnostics, the application version, browser information and local-storage availability status are copied to the clipboard. Training, nutrition, injury records and other health measurements are excluded. Copying does not send information to the operator; inspect the text before pasting it into a message.”

Storage wording must name only verified actual fields. Describe view selection and install-hint dismissal as local UI preferences, rather than calling them anonymous analytics. If the eligibility check reads an existing completed-session record, disclose the local use accurately without claiming a new completion-event upload. Never promise that OS installation preserves records indefinitely or that uninstall guarantees deletion.

## Integration evidence required before version decisions

1. Confirm Focus and Overview write identical existing validated log records; no new upload or changed calculation purpose. If new persistence is added, inventory it and test deletion/export/schema compatibility.
2. Verify install hint appears only after a completed session and after the existing gate; its dismissal is scoped to the app. Identify whether state is memory-only, existing profile preference or another actual key. Confirm no installation telemetry, push subscription or tracking request exists.
3. Verify feedback link creation is user-triggered, recipient comes from validated real launch config and subject/body are URL-encoded. Inspect the full draft: version/language only by default, no profile, path query containing personal data, notes, logs, videos, device identifiers or hidden attachments.
4. Verify clipboard behavior requires an explicit click and handles unsupported/denied clipboard access. Browser data is diagnostic information, not guaranteed anonymity. Storage status must be a coarse available/blocked state, not a dump of keys or contents.
5. Test no network send occurs merely opening the feedback UI or copying diagnostics. Opening an external mail client/provider may itself contact its provider; do not promise that a mailto click creates zero external requests in every environment.
6. Default analytics remains absent/off. If the optional analytics adapter is later implemented, it requires a separate source-level data-flow and policy review. Do not pre-authorize it using the narrow feedback clarification.
7. Compare final JSON text diffs and bump only changed tracked documents. Record changed sections, languages, dates and approval scope. Keep current material-change/withdrawal/export protections; don't weaken `validConsent` just to avoid a re-prompt.

## Snapshot findings for the main integrator

Current public documents already distinguish local journals from host logs and voluntary email, so wholesale rewrites would add noise. The primary narrow changes are privacy §7/contact instructions and storage inventory if new preferences persist. Existing `public/.well-known/security.txt` points to GitHub private advisories rather than an operator mailbox; external verification and configuration alignment remain separate launch work. No support email or actual domain is present in the existing legal config; do not interpolate a placeholder into a working link.
