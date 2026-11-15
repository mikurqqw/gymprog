# Backend readiness and Kazakhstan review

Status: local-only application; no backend is implemented or approved by this document. Reviewed for documentation on 2026-11-15. This is an engineering decision record, not legal advice or a compliance certificate. Kazakhstan-qualified counsel must review the actual operator, current legislation and data flows before production release; a native Kazakh speaker must review public Kazakh text.

## Current boundary

- Profile, training, nutrition and attached videos are stored in the user's browser after the required consent gate. There are no accounts, server-side health journals, cloud synchronization or remote recovery service.
- The static host handles connection metadata independently. GitHub Pages documents visitor IP logging. User-initiated support messages, exported backups and optional third-party media create separate flows; local-only does not mean that no personal information is processed anywhere.
- Browser storage is not application-level encryption. The optional local lock is a convenience control, not server authentication or a defense against someone controlling the browser profile.
- Consent withdrawal and app deletion cover the application's named storage, databases, caches and service worker. Downloaded exports, device/browser backups and host logs have different controllers and retention limits.

## Decisions required from Kazakhstan counsel

| Topic | Question and evidence required before approval |
| --- | --- |
| Roles and scope | Who is the actual owner/operator/third party for browser records, hosting logs and support messages? Do personal-use exceptions apply to any particular flow? Do not assume they apply to the service as a whole. |
| Localization | How do current Kazakhstan storage/localization rules apply to user-controlled browser storage, a foreign static host's logs, support email and a future backend? Record permitted database, replica, backup, log and CDN locations separately. |
| Registration and commencement | Is operator/business registration, a notification of commencement of processing, a registry entry, a responsible person or another filing required under the current framework for these precise activities? Obtain the applicable procedure and evidence; do not copy another country's registry model. |
| Incidents and rights requests | Which events, parties and authorities require notification, using which channels, trigger definitions, contents and statutory deadlines? Verify current effective provisions and record them in the operator runbook; no deadline is established by this draft. |
| Processors and transfers | What roles, contracts, instructions, security assurances and cross-border mechanisms are needed for hosting, email, media and a future database provider? Is consent sufficient for a given transfer, or are additional conditions required? |
| Sensitive records | How are health-related entries, uploaded videos and inferred fitness information classified? What consent, access, retention and technical safeguards apply? |
| Other markets | Do intentional offerings or monitoring create Russia/EU or other obligations? Website accessibility alone is not a completed territorial-scope assessment. |

The Ministry's 20 August 2026 announcement describes significant legislative changes, including commencement and incident notification. A press release establishes the need for a current review; it does not replace the operative legislation or determine applicability to IronCycle. Older official localization guidance is useful context but is not sufficient current clearance.

## Future backend plan only

Nothing below is claimed to exist in the static application. Adding accounts or uploads requires a separate reviewed design and migration plan.

1. Document purposes, minimized fields, lawful grounds, consent evidence, deletion/retention rules and a provider/location register. Complete a privacy impact and threat assessment before selecting a host.
2. Keep authorization on the server for every record; test ownership and tenant isolation. Use database row-level security as defense in depth where supported, with explicit deny-by-default policies and audited privileged access.
3. Use managed authentication or reviewed Argon2id/bcrypt password hashing; require MFA for privileged access. Use secure HttpOnly SameSite session cookies, CSRF protection, recovery controls and session revocation. Never store bearer credentials in localStorage.
4. Apply request validation, parameterized queries, rate limits, abuse controls, upload signature/size checks, private object storage and short-lived scoped access. Restrict outbound requests and origins.
5. Use transport and at-rest encryption, separated keys and least privilege. Verify Kazakhstan-specific cryptographic/security requirements with counsel rather than treating generic encryption as sufficient.
6. Define encrypted backup locations, retention and access; test restore and deletion propagation. Keep minimized security logs with controlled retention and no journal contents or credentials.
7. Establish operational owners, provider incident escalation, current legal notification rules, monitoring and recovery objectives. Test authorization, restore and incident drills before release.

## Official sources and retrieval limits

Checked 2026-11-15:

- [Ministry: updated legal framework, 20 August 2026](https://www.gov.kz/org/maidd/press/news/details/1277592?lang=ru): announces changes and notification topics; not an applicability opinion.
- [Information Security Committee: personal data protection](https://www.gov.kz/org/maidd/activities/9552?lang=ru): authority and complaint context.
- [Official localization and transfer guidance, 17 March 2023](https://www.gov.kz/org/infsecurity/press/article/details/118745?lang=ru): historical guidance; current effect must be confirmed.
- [Adilet: Law on Personal Data and their Protection](https://adilet.zan.kz/rus/docs/Z1300000094): current consolidated text was not independently retrieved because the page required JavaScript; legacy endpoint returned an error. Counsel must retrieve current operative text and amendments, including the 2026 framework.
- [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement): host metadata and provider practices.

Release evidence belongs with `docs/LEGAL_REVIEW.md`; unfilled operator configuration and unreviewed legal texts remain release blockers.
