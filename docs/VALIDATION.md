# Validation results

Validated locally on Windows with Node.js 24.13.1 and Google Chrome, 15 November 2026.

| Check | Result |
| --- | --- |
| `npm run lint` | Pass, no errors or warnings |
| `npm run typecheck` | Pass, strict TypeScript |
| `npm test` | 83 tests passed across five files |
| `npm run build` | Pass, complete static output in dist |
| `npm run e2e` | 18 browser tests passed |
| axe accessibility | Zero serious/critical violations on all twelve routes; additional mobile checks in both themes |
| Responsive visual verification | 375, 768, 1280, 1920 px; dark and light; two iterations; 90 screenshots |
| `npm run audit` | Zero vulnerabilities |
| `git diff --cached --check` | Pass |
| TypeScript AST review | No any types or console.log calls in src |

Browser scenarios cover profile recalculation, persistent set logging, timestamp timer, backup export, validated import/undo, exercise swaps, short-sleep reduction, pain stopping heavy work, failed test attempts, RU/EN, kg/lb, themes, demo charts, mobile navigation and offline reload.

## Lighthouse

One final mobile lab run on the production preview at localhost, using Lighthouse CI. `npx lhci assert` passed every configured threshold.

| Category / metric | Result |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 100 |
| Largest Contentful Paint | 0.9 s |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 80 ms |
| First Contentful Paint | 0.9 s |
| Initial application JavaScript | Approximately 153 KB gzip, below 170 KB |

Charts and reference rendering load in separate route chunks. The service worker precaches route assets after installation for complete offline use. This extra background cache traffic is separate from the initial JavaScript budget.

Limits: localhost timings do not measure an external host or real mobile network. INP needs real interaction/field measurement and was not established by this lab run; TBT is reported separately and is not claimed to be INP. Best Practices loses four points for a browser-reported CSP issue; no runtime page errors were observed. Host-only security headers require future hosting configuration.

Reports: `artifacts/lighthouse/`. Screenshots: `artifacts/screenshots/`. Clinical efficacy, individual injury suitability and guarantees of strength gains are not established by software tests.

GitHub publication was explicitly postponed by the user; no deployment was performed or claimed.
