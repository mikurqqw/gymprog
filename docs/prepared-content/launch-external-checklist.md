# External launch checklist — preparation for ga.txt sections 9–10

Snapshot: 2026-11-17. Read-only assessment of the current repository; no deployment, DNS change, account setting or legal approval was performed. These are owner inputs and verification tasks, not legal conclusions. Unknown values must stay unresolved until supplied and checked.

## Exact existing configuration fields

Source: `src/config/legal.config.ts`. Keep placeholders until genuine information is supplied. Do not use a fake value or machine-generated approval to pass a release guard.

| Field | Owner must supply or confirm |
| --- | --- |
| `operator.name` | Actual individual/legal operator name and intended public spelling. |
| `operator.status` | Actual legal/business status, reviewed for the intended service. |
| `operator.identifier` | BIN/IIN or other identifier only where applicable; counsel decides necessary disclosure. Do not automatically expose a private IIN. |
| `operator.registration` | Actual registration details or a counsel-approved factual applicability explanation. |
| `operator.address` | Genuine legal correspondence address appropriate for publication. |
| `operator.legalEmail` | Real monitored legal/general mailbox; verify receipt and reply. |
| `operator.privacyEmail` | Real monitored privacy/security mailbox; verify private report intake. |
| `operator.hostingProvider` | Currently `GitHub Pages, GitHub, Inc.`; confirm it matches the final hosting chain. Add CDN/other providers if actually introduced. |
| `operator.serverLocation` | Verified hosting/CDN/log/backup location information and uncertainty, based on provider evidence. A domain or region label is insufficient evidence for every copy. |
| `operator.jurisdiction` | Counsel-approved governing-law wording preserving applicable mandatory rights. |
| `operator.disputeForum` | Counsel-approved dispute process/forum for the actual operator. |
| `effectiveDate` | Real effective date of reviewed published documents, ISO YYYY-MM-DD. |
| `reviewedByKazakhstanLawyer` | Set true only after actual qualified Kazakhstan lawyer review; retain reviewer/date/scope evidence privately. |
| `reviewedByKazakhNativeSpeaker` | Set true only after actual native Kazakh review of the final texts. |
| `documentVersions.{terms,privacy,storage,medical,calories}` | Real release versions for changed consent documents; keep unchanged documents' values. This is release metadata, not an owner identity fact. |
| `emergency` | Confirm country-qualified 112/103 source and checked date remain accurate before release; do not silently internationalize Kazakhstan numbers. |

## Additional owner decisions not yet represented by configuration

The following are requirements from ga.txt, not claims that corresponding configuration fields already exist. The integrator must define a validated launch-config contract before consuming them.

- Final public HTTPS origin and optional subdirectory; use it consistently for intended `VITE_SITE_URL`, canonical/share URLs, sitemap, manifest scope and published links. No guessed purchased domain.
- Support/feedback destination and channel: real monitored email, or an owner-approved Telegram destination if explicitly selected. Confirm whether support shares `legalEmail`; do not create a fictional support address.
- Account controlling hosting/DNS/repository and a responsible release/incident contact. Verify access, MFA and recovery privately; never put tokens or recovery codes in VITE variables or source files.
- Choice of final host: GitHub Pages, or a separate static deployment supporting custom headers. A prepared Cloudflare/Netlify path is not authorization or evidence of an actual migration.
- Whether optional analytics will exist at all. Default remains absent/off. If later enabled, owner must supply the actual endpoint/provider and obtain a separate data-flow review; no advance blanket permission.
- Name/trademark clearance for IronCycle in intended markets. No registration or clearance is claimed by this project.

## External professional and operational checks

1. Counsel reviews all ten legal documents against the final implementation and actual operator, current Kazakhstan law, localization, registration/commencement notification, incident notification, processor/hosting arrangements, transfers and relevant other markets. Obtain applicable procedures/deadlines from verified operative law, not this checklist. Local-only is not asserted to exempt the product automatically.
2. Native Kazakh reviewer checks interface, consent, safety and legal translations. Coach/qualified clinician reviews exercise content, joint-stress estimates and injury caveats; keep exercise review flags false until an actual review is documented. New SVGs are educational schematics, not certified demonstrations.
3. Owner verifies rights/notices for supplied media, fonts, icons and food sources. Refresh direct/transitive dependency inventories after the final dependency changes. `prettier` was added after the earlier direct-license inventory, so exact current parity must be rechecked.
4. Verify private security reporting works. Current `public/.well-known/security.txt` uses a GitHub private-advisory URL, expires 2027-11-01 and lists a repository policy link; do not assume private advisories are enabled without an external test. Section 9 requires contact from real config. Keep expiry and policy URL current; never publish a placeholder mailto.
5. Confirm final production build has no placeholders and both human-review requirements are met. Current production guards reject incomplete details/reviews; explicit preview is separate. An override, if implemented later, is a warning-bearing exception and never evidence of human review.

## Hosting and domain verification

- Existing `.github/workflows/pages.yml` deploys `dist` using GitHub Actions after checks; a main push requests production, while manual `preview=true` enables a visibly marked preview. Confirm repository Settings → Pages uses Actions and the deployment URL serves the intended artifact. Check HTTPS and an actual workflow run; local YAML alone proves neither.
- Existing Vite base is relative and routes use hashes. Test the real project subdirectory, manifest start/scope, local media, offline reload and service-worker update; a change of origin does not transfer browser records automatically. Offer export/import before a domain move and never suggest otherwise.
- For Cloudflare Pages preparation: use static output `dist`, Node 24 and the final reviewed build command; associate the custom domain in Pages before relying on a DNS CNAME. Official docs require a Cloudflare zone/nameservers for an apex domain; subdomains can use external DNS with the specified CNAME. Confirm domain activation and HTTPS in the actual account.
- Cloudflare Pages and Netlify document `_headers` parsing for deployed static output. Verify the built file is present and the deployed responses contain the intended headers. Cloudflare `_headers` does not govern Pages Functions responses; no Functions/backend is required here.
- Do not treat a `_headers` file as evidence that GitHub Pages returned those headers. Verify actual response headers at the final origin. Check CSP including `frame-ancestors`, HSTS, nosniff, Referrer-Policy, Permissions-Policy and intended COOP; distinguish meta-CSP protection from response-only directives.
- Existing `_headers` has no COOP line. Existing CSP allows inline styles. Section 10 still requires a documented compatibility decision and runtime verification; do not silently remove needed chart styles or weaken unrelated CSP directives. HSTS `includeSubDomains` needs owner review of all covered subdomains before deployment.

## Repository/account verification still needed

- Current CI installs Chromium only. Verify the requested Firefox/WebKit runs and final browser artifacts when the cross-engine work is integrated; do not extrapolate old Chromium scores to untested routes/languages/devices.
- Existing CodeQL workflow and Dependabot configuration are present. Confirm actual successful GitHub runs, actionable alerts and available repository secret-scanning settings; source pattern scans alone are not comprehensive secret detection.
- Final build/hosting checks must inspect the real manifest, sitemap, robots, OG image, security.txt, placeholder absence, HTTP headers and canonical origin. `docs/DEPLOY.md`, `docs/LAUNCH_CHECKLIST.md`, `scripts/check-launch.mjs` and VITE_SITE_URL handling were absent in this snapshot; this assessment does not certify their later implementation.
- Run the full requested quality matrix and keep measured reports: route/language/theme axe checks, device/zoom screenshots, key journeys, update/offline/backups, default zero third-party requests, dependency audit and Lighthouse per target route. No new test result is claimed by this preparation task.

## Official hosting references

Checked 2026-11-17: [GitHub Pages overview and IP logging](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Cloudflare static response headers](https://developers.cloudflare.com/pages/configuration/headers/), [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Netlify custom headers](https://docs.netlify.com/manage/routing/headers/). Provider docs do not supply the operator's legal facts or prove the actual deployed configuration.
