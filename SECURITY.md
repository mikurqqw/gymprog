# Security policy

## Reporting a vulnerability

Use the operator's verified private privacy contact configured in `src/config/legal.config.ts` as `legalConfig.operator.privacyEmail`. The legal escalation contact is `legalConfig.operator.legalEmail`. The operator must replace the required placeholders, monitor both contacts and publish them in the app before production release. While placeholders remain, no private reporting inbox is represented as operational.

Do not publish health records, videos, exports, credentials or exploitable personal details in GitHub issues. A report should contain the affected URL/build, browser version, approximate discovery time, impact and minimal reproduction using synthetic records. Do not send your PIN or a complete backup. Request a private transfer method if evidence cannot be safely redacted.

Test only your own records and devices or systems for which you have permission. Avoid destructive testing, accessing another person's data, load attacks or interference with hosting and media providers. Stop when you have the smallest evidence necessary to demonstrate the issue. This policy is not a promise of legal safe harbor or a bounty.

## Supported scope

Maintainers assess reports against the latest published IronCycle build. The current application is a static, local-only fitness journal with browser storage; it has no backend accounts, server-side health database or cloud recovery. Third-party hosting and media services have their own reporting processes. Provider behavior relevant to IronCycle can still be reported to the operator.

The operator must assess reports and communicate case-specific next steps. This draft promises neither a response deadline nor an uninterrupted service. Production readiness depends on real operator details and the legal review flags in configuration; this policy does not certify those reviews.

## Security boundaries

- Browser records and videos stay local unless the user exports or deliberately shares them. The static host still receives connection metadata, and optional media may contact its provider after consent.
- Browser storage is not encrypted by this app. Anyone controlling an unlocked browser profile, malicious extensions or compromised device may access it. The optional PIN lock is a convenience screen control, not an encrypted vault or server authentication.
- Local deletion cannot erase downloaded exports, external recipients, device backups or host logs. Browser storage eviction and origin changes may cause loss; user-controlled backups remain necessary.
- Static hosting limits response-header control. A content-security meta tag cannot replace HTTP-only protections such as `frame-ancestors`. Deployment review must identify which headers the actual host supplies.
- Dependency versions are pinned in the lockfile. The direct-dependency license inventory is `src/data/dependency-licenses.json`; it is metadata, not a complete transitive license audit or vulnerability clearance.

The engineering control inventory is in `docs/SECURITY.md`. Incident handling is in `docs/INCIDENT_RESPONSE.md`; future backend requirements are in `docs/BACKEND_READINESS.md`; unresolved legal release questions are in `docs/LEGAL_REVIEW.md`. Future password hashing, MFA, row-level authorization, server rate limits and managed backups are plans, not features of this static app.
