# Incident response for the local-only product

Maintainer runbook draft, checked 2026-11-15. Requires operator ownership and Kazakhstan-qualified legal review before production use. It establishes no statutory deadline or service-level promise.

## Intake and scope

Use the verified private contact configured as `legalConfig.operator.privacyEmail` in `src/config/legal.config.ts`; `operator.legalEmail` is the legal escalation contact. These required fields must be completed and monitored before publication. A placeholder is not a working reporting channel. Do not ask users to publish health information, browser backups or videos in GitHub issues.

Ask for the affected URL/build, approximate time and timezone, browser/OS, expected versus actual behavior and a minimal reproduction with invented records. Request redacted screenshots only when necessary. Never request a password, PIN, complete health journal or unrelated device data. If sensitive evidence is unavoidable, agree a restricted transfer method and retention purpose first.

Classify the report: application vulnerability; local device/browser exposure; corrupt or lost local records; host/provider metadata incident; accidental disclosure through export/support/media; or a false alarm. Absence of a central health database limits central evidence and recovery; it does not rule out an incident.

## Response sequence

1. Assign an incident owner and record discovery time, report source, affected build, known facts and uncertainties. Restrict access to the case. Preserve only relevant evidence; avoid copying live journals into tickets or logs.
2. Reproduce in an isolated browser with synthetic data. Determine whether storage isolation, consent, deletion, import validation, script execution or optional media behavior is affected. Distinguish verified impact from a hypothesis.
3. Contain proportionately: pause a faulty release, disable an affected optional feature, remove a compromised artifact or contact the hosting provider through its official private channels. Preserve evidence needed to understand the cause. Do not indiscriminately erase users' data or unrelated same-origin applications.
4. If repository or publishing access is compromised, the authorized operator revokes affected access, rotates relevant deployment credentials and reviews release history. Do not request user account passwords: the current product has no accounts.
5. With counsel, determine affected records, actors, locations and notification duties. Check current Kazakhstan law, provider obligations and any other applicable market. Determine recipients, channels, contents and applicable deadlines from verified operative provisions; do not wait for complete forensics to begin that assessment.
6. Issue accurate private or public communications as appropriate. Describe known impact, affected versions, practical user actions and unresolved facts. Never claim that local-only means zero exposure; never identify affected individuals publicly.
7. Fix the cause, add a meaningful regression test and validate the replacement build. Consider cached older versions and service-worker update behavior. Verify deletion/export still work before resuming release.
8. Close only after documenting cause, scope, actions, communications, evidence retention/deletion and follow-up ownership. Review the runbook after the event. A closure note is not proof that all downloaded or third-party copies were destroyed.

## Device loss, corruption and recovery

- For suspected device compromise, advise the user to secure the device/browser profile and avoid entering more sensitive records. The application cannot remotely lock or wipe a user's browser, revoke an exported JSON file or recover a lost PIN as a server service.
- Local records may be lost through browser reset, eviction, private mode, an origin change or device failure. Restore only a user-controlled valid export. JSON exports and attached videos have different coverage; confirm the actual backup format before promising restoration.
- Before destructive troubleshooting, explain the effect and obtain the user's informed choice through the app's confirmation flow. Keep any recovered copies under the same privacy controls. A report of data loss is not authorization to upload the user's records.
- Application deletion covers its own storage namespaces. Copies in downloads, OS/browser backups, email recipients and provider systems need separate handling; the operator must explain what it can and cannot control.

## Legal escalation and primary sources

The operator must have counsel fill an internal notification matrix for each applicable incident type, recipient and trigger. This draft deliberately supplies no unverified legal time limits or exemption claims. See `docs/BACKEND_READINESS.md` for localization, commencement notification, processor and cross-border review questions.

Official sources checked 2026-11-15:

- [Ministry announcement of the 2026 framework](https://www.gov.kz/org/maidd/press/news/details/1277592?lang=ru) identifies commencement and incident notification as current review topics. Obtain the operative provisions and applicability analysis.
- [Information Security Committee: personal data protection](https://www.gov.kz/org/maidd/activities/9552?lang=ru) describes the competent authority and complaint context; it does not replace a verified operator incident-notification procedure.
- [Adilet law reference](https://adilet.zan.kz/rus/docs/Z1300000094): consolidated current text was not independently retrieved; counsel review remains open.
- [GitHub privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) explains provider processing; GitHub logs are not application journals and are outside local delete-all controls.
