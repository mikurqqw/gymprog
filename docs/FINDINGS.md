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
