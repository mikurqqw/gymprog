# Build dependency repair — 2026-11-18

Branch: codex/fix-glob-security. This repair changes no application source, UI, UX, training logic, data schemas or user records.

## Actual fix

The registry's latest picomatch4.0.7 is affected by GHSA-fc5q-39xc-vjpf. The original matcher hangs on +(*a) with a short crafted string; the regression was reproduced in a child process and terminated by timeout.

The project now uses the explicit private fork @ironcycle/picomatch-hardened4.0.7+ironcycle.1 through an npm override. It contains the actual parser fix from upstream proposed PR237, plus a correction for consecutive bare stars: PR237 alone still hangs on +(**a). Redundant outer repetition of the relevant single branch is removed. Other runtime files are unchanged. This is a source backport, not an official patched release or a renamed unmodified archive.

vendor/picomatch-security.patch contains the complete source difference. The runtime archive retains the upstream MIT license and copyright. vendor/picomatch-hardened.provenance.json records exact upstream/patch commits and every installed file hash. The tarball URL is pinned to immutable repository commitd8b81a8c1cc1f32fbbacf75c62bcf0f7fd366415, and package-lock.json pins its SHA512 integrity. A relative file override was rejected by npm's nested peer-resolution path; the immutable URL makes clean installs portable.

## Security gates

No audit threshold, workflow permission, test expectation or publication exception was weakened. npm run audit now runs installed-source/archive integrity tests and time-bounded exploit regressions before the original npm audit --audit-level=high, then queries upstream picomatch advisories separately. The full upstream report remains visible. A new advisory, changed existing metadata, malformed response or network failure blocks the check. The existing issue is marked source-fixed only alongside the verified patched bytes and passing exploit tests.

This explicit upstream check is necessary because npm's registry audit cannot analyze a private vendored fork. Zero registry findings alone is not evidence that vendored code is safe. The inherited maxExtglobRecursion:false safeguard opt-out remains unsafe and is not used by this project's tools.

## Verification

- Original exploit regression failed by timeout before replacement; fixed regressions pass across dot, Windows, Bash, capture and case-insensitive options, including consecutive-star variants.
-1983 upstream tests pass,131 suites, zero skipped. Exact upstream4.0.7 tests ran using Node's built-in test API; fill-range7.1.1 was isolated in ignored test artifacts.
-151 application unit tests and106 consolidated Playwright scenarios pass, including Chromium/Firefox/WebKit, trilingual30-route accessibility/theme matrix, privacy, persistence, offline, updates and injury stop paths.
-6 permanent tooling/advisory tests pass. Changed ranges, severity, URLs, new advisories and malformed responses fail as intended.
- npm run audit passes:0 registry vulnerabilities plus verified source-fixed upstream report. Clean isolated npm ci installs620 packages and reports0 vulnerabilities; installed fork identity/version is correct.
- lint, typecheck, format:check, security/licenses/protected hashes, content, i18n, preview build and preview launch checks pass. package-lock.json changes only the matcher record; direct dependencies are unchanged.
- All75 non-timestamp output files are byte-identical to the pre-repair build. Only generated security.txt expiration time differs. Build ID remains7a9c9733eb66cf23; initial JS remains167.5KiB gzip. No performance improvement is claimed. Existing cold Lighthouse limits remain documented in SIMPLE_PERFORMANCE.json.

Ignored evidence:artifacts/glob-regression-before.log, glob-upstream-tests.log, glob-audit-final.log, glob-clean-install.log, glob-unit.log, glob-e2e.log, glob-artifact-equality.json and glob-final-*.log.

## Remaining work

This small fork requires maintenance until a genuine fixed upstream release can replace it after verification. Existing legal/human-review and cold-start performance limitations are unrelated and remain. No public Pages deployment is claimed by this checkpoint. The owner has requested a separate follow-up for Checkin and food search; keep those application changes separate from this verified repair.

Sources: https://github.com/advisories/GHSA-fc5q-39xc-vjpf , https://github.com/micromatch/picomatch/pull/237 , https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides .
