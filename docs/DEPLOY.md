# Static deployment

Runtime: Node24; Vite8.3.8/React19.3.1. No server is required. Existing hash paths and relative assets work under /gymprog/ and a domain root.

## GitHub Pages

1. Repository Settings → Pages → Source: GitHub Actions.
2. Run npm ci, npm run build:preview and npm run check:launch:preview for an explicitly marked demonstration. Dispatch pages.yml with preview=true. Production pushes use npm run build and check:launch; incomplete real configuration blocks publication.
3. Verify the successful deploy job, actual HTTPS URL, manifest, theme, media, offline reload and user-approved update. Never force-push to publish.
4. Before commercial launch fill the real legal/launch fields and obtain documented human reviews (LAUNCH_CHECKLIST.md). IRONCYCLE_ALLOW_UNREVIEWED_LAWYER=1 prints a warning and exempts only lawyer review; it does not waive any other fact/review requirement. It is not legal approval.

## Cloudflare Pages and a custom domain

1. Export backups first: browser data does not transfer to a different origin.
2. Connect the same repository to Cloudflare Pages, use Node24, build command npm run build, output dist. Use npm run build:preview only for an explicit preview deployment. Set VITE_SITE_URL to the final HTTPS base URL, ending with /; no secrets belong in VITE_ variables. Update launch.config.ts and legal hosting disclosures to the actual deployment.
3. In Pages → Custom domains, associate the domain before relying on DNS. For an apex domain use the Cloudflare zone/nameservers; for an external-DNS subdomain use the CNAME shown by Pages. Wait for domain and certificate activation, then verify HTTPS. These steps do not claim DNS was changed by this task.
4. Inspect real response headers (curl -I final-url). Static dist/_headers includes CSP, frame-ancestors, HSTS, nosniff, Referrer-Policy, Permissions-Policy and COOP. Review HSTS includeSubDomains coverage before using a domain with other services. Pages Functions are not used and would need their own headers.
5. The same dist/_headers syntax supports Netlify static deployment. No redirects are required for preserved HashRouter routes; do not redirect missing assets to HTML.

## Security and browser constraints

GitHub Pages does not apply _headers. Meta-CSP protects allowed sources, but frame-ancestors, HSTS, nosniff, Permissions-Policy and COOP require actual HTTP headers. Never claim these response-only protections exist from a local file. CSP allows no remote scripts/fonts or remote connections. YouTube nocookie frames require optional-media consent and an explicit click.

style-src unsafe-inline remains because React supplies dynamic progress/ring styles, Recharts layout styles and SVG dimensions. Removing it currently breaks those controls. Script policy stays self only; there is no unsafe-eval or inline script exception. Restricted SVG illustrations use React nodes, not raw HTML. A future nonce/hash architecture would require a separate compatibility review.

security.txt is generated from a real verified private contact with an expiry 180 days after build. Explicit previews state that contact is unconfigured. RFC9116 discovery requires /.well-known/security.txt at the origin root; the project subdirectory /gymprog/.well-known/security.txt is not root discovery. Use a custom origin/root deployment or arrange the root file before claiming standard discovery. Rebuild before expiry.

Sources checked2026-11-17: [Cloudflare headers](https://developers.cloudflare.com/pages/configuration/headers/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [Netlify headers](https://docs.netlify.com/manage/routing/headers/), [RFC9116](https://www.rfc-editor.org/rfc/rfc9116.html), [Playwright projects](https://playwright.dev/docs/test-projects).

## Performance evidence

`npm run lighthouse` uses a compressed static artifact on127.0.0.1:4175, isolated demonstration profiles, mobile simulation and a cold HTTP cache for EACH route. No real user records are exported. Exact measured results are in PERFORMANCE.json. All five routes score accessibility100, best-practices96 and SEO100. Cold-start performance/LCP budgets are not yet met on every screen; strict assertions remain enabled and currently fail. Do not describe this as a fully green commercial release. GitHub Pages preview publication is separate from this known performance failure.

The weekly meal calculation now runs in a same-origin worker using the original protected function, with pending state and cancellation on changed inputs. Catalog validation/indexing is batched; transaction metadata is written only after every batch succeeds. Neither change alters nutrition targets or generated ingredients. Cold compressed nutrition performance rose from67 to85 after moving weekly work off the main thread; timings remain hardware/browser dependent. Warm-cache measurements are not substituted for cold-start results.
