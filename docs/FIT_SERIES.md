# Training series from fit.zip

The catalog groups eight directions from the supplied archive. Seven directions have cycles I–III, and the introductory gym course has two four-week blocks of training (four seven-day calendar blocks per month), followed by the archive's mapped fitness variant. Some bodybuilding calendars use eight-day blocks. The player keeps those calendars rather than imposing seven-day weeks.

The importer verifies the SHA-256 of all 23 workbooks against the archive's source register. It imports the accompanying checked calendar and assignment exports, joins by profile, plan, mode and session, and verifies all rows have a matching parent. Workbook references remain on the calendar and exercise details. The site loads one of 1,634 compressed adult profile/mode/cycle files on demand. The data occupies about 9 MB on the host and does not enter the initial JavaScript bundle.

After basic profile setup, an adult chooses the source variant and equipment. The schedule shows rest days, session order, exercise prescriptions, ranges, effort, rest and the recorded load basis. Short doses are shown as reference when available. Exercise names and source notes are preserved in Russian. The controls are available in Russian, Kazakh and English.

A run keeps its own completion dates in the local journal and backup. Once all sessions are recorded, the user verifies the source entry conditions and can open the matching next cycle. Cycle III can restart at I. History remains available across a restart or introductory transfer. A confirmation is a self-report, since the app cannot verify performed sets or technique. Health flags, unresolved injuries or stop symptoms restrict the cycle to preview. The application does not calculate weights for these source programs or choose clinical substitutions. The adult-only site excludes the archive's adolescent variants.

Rebuild from the original archive with `python scripts/import-fit-pack.py <path-to-fit.zip>`. The original workbooks and any executable material in the archive stay outside the application. Existing training programs, training calculations and substitution rules are covered by `npm run check:security`.
