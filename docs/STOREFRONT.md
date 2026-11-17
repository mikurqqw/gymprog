# Program storefront and training continuity

## Scope

The existing application remains available. A public product experience introduces
ready training cycles before asking visitors for personal or sensitive data.
No payment, account, tracking or server has been added.

Routes:
- `/` shows the public landing page without valid consent, the dashboard otherwise.
- `/welcome` always opens the public landing page, including for returning users.
- `/catalog` and `/catalog/:goal` show all eight existing directions, their intended
  audiences, requirements, example first weeks and existing evidence blocks.
- `/demo` is an interactive, fictional, in-memory example. It writes no data.
- `/start?program=...` requires the existing age/consent/health flow before handing
  the validated choice to profile setup. Returning users configure via the editor.

The visitor is told that this is an open preview and that choosing a program is
not a purchase. No price, testimonial, clinical validation or guaranteed outcome
is invented. Existing verified evidence and its limitations remain visible.
Forum discussions are not represented as scientific verification.

## Training continuity

`sessionInsights.ts` derives progress only from matching current prescription IDs,
exercise IDs and dates. Archived/skipped logs are not counted. Completed sets,
volume load and set-weighted RPE are shown; no strength or health improvement is
inferred from these numbers. Previous results compare the same movement on an
older date.

An `activeSession` pointer supports resuming. `sessionCompletions` uses program,
custom-document ID, cycle start, week and day, so another cycle is not mistakenly
marked complete. New fields default safely when reading old backups. Finishing
partial work requires confirmation and never fills in missing sets. Finish/reopen
supports the existing undo mechanism. The resume action is tested within a
375x812 first viewport. Workout entry asks unconfigured users to review the profile;
skipping the wizard no longer silently confirms example strength values.

All original sections remain: program, workout, check-in, nutrition, progress,
max test, exercise library, reference, full constructor, injuries and settings.
The dashboard emphasizes the next action; strength details are expandable.

## Design and verification

Retains IronCycle lime, neutral surfaces, self-hosted typography and light/dark
support. The product preview is HTML/SVG and is labeled illustrative. All added
copy is in RU/KK/EN; machine-assisted Kazakh still needs native review.

Local checks: lint, TypeScript, 121 unit tests, translation parity, source secret
patterns, license scan and dependency audit pass. The broad Chromium run passed
39 browser scenarios; five focused scenarios were rerun after final polish,
including a new first-screen resume test (40 distinct scenarios covered overall).
Screenshots cover public pages at 320/375/768/1280/1920 in both themes and existing
private pages at 375/768/1280/1920. Serious/critical axe checks pass in tested flows.
Firefox/WebKit and real-device testing remain outside this verification.

## Commercial next step

To accept real money, the owner must provide actual offer prices/currency, merchant
and payment-provider setup, delivery/access terms, and reviewed legal/operator
information. Protected paid access needs server-side entitlement verification;
localStorage cannot enforce a purchase. No local switch pretends to be payment
verification. The current preview is suitable for reviewing the presentation and
collecting feedback, not for claiming a functioning paid checkout.

## Rollback

The previous deployed revision is `5a9810f58a177ab00d7a73d3d9abb8e12a8cd816`.
The storefront is isolated in the `codex/program-storefront` feature commit. Revert
that commit and publish another explicit preview to restore the previous product
presentation. Existing logs remain; older builds do not use new completion metadata.
Do not reset or force-push shared main history.

Final mobile Lighthouse on the public entry page: {'performance': 100, 'accessibility': 100, 'best-practices': 96, 'seo': 100}. LCP 910 ms; CLS 0. All existing Lighthouse assertions passed without threshold changes. This is a local lab measurement, not field data.

## Royal Blue launch revision

Welcome now shows Start free/demo,3 steps, all8 directions,6 capability sections,
8 honest trilingual FAQs, safety strip and actual Focus screenshots captured with
isolated fixture data by npm run media:capture. Public pages never receive personal
profile data. Images have fixed intrinsic dimensions and lazy loading.

VITE_SITE_URL controls canonical, OG1200x630, language alternates, sitemap and robots.
Only the root and localized query-language landing URLs appear in the sitemap.
The existing hash catalog stays compatible but is not separately indexable; see FINDINGS.md.
