# Security review

- No backend, credentials, authentication tokens, analytics, external fonts or remote image services are required. Personal data remains in this browser's storage.
- Inputs and JSON backups use Zod bounds and enums. Unknown backup versions, malformed JSON, oversized imports and unknown exercise references are rejected before replacing state.
- React escapes notes and labels. Markdown uses react-markdown without raw HTML. YouTube identifiers are restricted to an 11-character allowlist format; embeds use youtube-nocookie.
- Local media paths reject absolute paths, traversal and URL schemes. Automatic media discovery accepts only numeric exercise IDs and WebP/GIF/MP4 extensions.
- Local video attachments require a video MIME type, have a 100 MB limit and remain in IndexedDB. Browser quotas can still prevent saving; errors are shown. No file is uploaded to a server.
- Destructive UI operations require confirmation and preserve a one-level undo snapshot. JSON backup is separate from device-only videos.
- A restrictive meta Content-Security-Policy disallows third-party scripts, object embeds and unsafe evaluation. Inline styles are needed for charts and progress values. Production removes the local development WebSocket exception.
- HTTP-only controls such as HSTS, frame-ancestors, X-Content-Type-Options and Permissions-Policy must be configured by a future host. A static browser app cannot set those response headers itself.
- Dependencies are pinned with a lockfile. npm audit was run; findings and validation results are recorded separately in VALIDATION.md. No checks are disabled to obtain a green result.

Remaining limits: browser storage is not encrypted by this app; anyone using the same unlocked browser profile can open these records. Incognito, storage eviction, browser reset or origin changes may remove them. Export backups regularly. Exercise and nutrition rules are general fitness heuristics, not clinical safety guarantees.
