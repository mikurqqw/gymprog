# Findings in protected or externally reviewed content

The launch-polish task does not modify the protected program/calculation sources.
Original snapshots are retained during work and compared after each section.

## Exercise equipment inconsistency

`ex-33` is named "Kettlebell deadlift" but has `equipment: "dumbbell"`.
This can affect equipment filtering in the protected generator. No equipment or
generator change is made here. Educational text can describe a single dumbbell
or kettlebell; a maintainer/coach must decide the actual equipment taxonomy.

## Review flags were not evidence of human review

The previous machine-authored exercise dataset contains checked review flags.
No human coach, clinician or Kazakh-native review was documented in this work.
Section 8 will mark the corresponding review flags false; it will not modify the
protected `requiresClinicalReview`, joint stress, injury or substitution fields.

## Unassessed strength needs a UI boundary

The protected generator accepts a complete numeric Profile and assumes calibrated
strength references. It does not accept null/unassessed measurements. New-user
drafts therefore remain separate from Profile and cannot enter calculation routes
until onboarding completes. The onboarding unknown-strength path must clearly
distinguish provisional loading from measured strength, with no max-test inference.

## Legal and specialist reviews remain external

Legal, clinical and native-language approval cannot be established by automated
tests or AI-authored flags. Required operator details and human review markers
remain unset until the owner provides actual verification.

## Unassessed strength boundary (section4)

The protected generator requires numeric1RM inputs. The new explicitly unknown path
uses a numeric compatibility floor internally, tagged unknown in version4 profile
metadata; it is not a strength measurement. The unprotected plannedProgram boundary
suppresses numeric load/percent on every unknown lift. Strength totals, max testing,
warm-up calculations and forecasts are hidden while input remains unknown. The UI
asks for unloaded/lightest-implement technique practice and manual recording.
Protected generator/formulas/programs were not edited. A qualified coach should review
this initial load-selection explanation before public launch.

## Hash-routing SEO limit

Existing hash routes are preserved for Pages compatibility and user links. The build
generates real root/localized-query landing URLs in sitemap.xml, never fragment URLs.
Catalog and personal hash screens are not claimed as separately indexable pages.
A future static/History-API public catalog is needed for per-program organic search.
Primary guidance: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
React19 metadata behavior: https://react.dev/reference/react-dom/components/title
