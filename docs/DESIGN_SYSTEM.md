# Royal Blue visual direction

Owner reference supplied2026-11-17 supersedes the earlier lime requirement.
Dark: background#0B1020, cards#131B2D, accent#4F8CFF with dark button text#081225.
Light: background#F3F6FF, white cards, accent#2563EB with white button text.
A single royal-blue accent identifies primary actions and selected states. Secondary
actions are neutral; success/warning/danger retain independent semantic colors.

Tokens live in styles.css and royalBlue.css:4px spacing,6/10/12px radii,150/240ms motion,
tabular numbers and clamp-based headings. Controls retain44px targets and keyboard
focus. Native details/dialog semantics keep expanded text and modal navigation accessible.
Existing reduced-motion rules remain active. No new runtime dependency is required.

## Theme and installation behavior

Dark is the fresh-user default; Settings also offers explicit Light or Use device theme.
The small synchronous theme.js bootstrap reads only an existing local theme preference,
never writes before consent, and applies it before React. ThemeController covers legal
and public routes too. Older backups preserve their manual theme in schema5.

Install promotion captures the browser event but is shown only after a completed workout.
iOS users receive Share/Add to Home Screen instructions; dismissal persists locally.
Standalone mode hides it. No push, registration, analytics or remote install service is added.
Vendor reference: https://web.dev/articles/customize-install

Set controls are labeled rectangular44px+ targets. Secondary actions are neutral,
weights/counts use tabular numerals, and all motion is disabled under reduced-motion.
