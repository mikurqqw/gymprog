# Autoregulation

The implementation is in `src/lib/autoregulation.ts`. It is a conservative heuristic, not a validated diagnostic model or a medical decision system.

| Input | Weight |
| --- | --- |
| Sleep duration / individual baseline | 30 |
| Sleep quality | 10 |
| Subjective recovery | 20 |
| Soreness, reverse scored | 10 |
| Stress and mood | 10 |
| Yesterday calories and protein / targets | 10 |
| Warm-up bar speed | 10 |

Optional missing ratings receive neutral values. Missing nutrition is 75% of the nutrition component, not a claim that targets were met. Food logs fill missing yesterday-calorie/protein check-in fields immediately. Explicit check-in values take precedence.

Green (75–100) keeps the plan. Yellow (55–74) lowers loads 2.5%, caps RPE 0.5 lower and removes the final accessory while keeping the second main movement. Orange (35–54) lowers loads 5%, removes up to two sets, secondary accessories and singles above RPE 7. Red (<35), sharp/worsening pain, dizziness or severe weakness blocks heavy training.

Sleep below 5.5 h caps readiness at yellow, below 4.5 h at orange. Three consecutive nights below baseline minus 1.5 h warn about recovery debt. Two consecutive under-fueled days reduce the score and cap it at yellow. A short night combined with low recovery and unusually heavy warm-up caps readiness at orange. Dates must be consecutive; gaps do not manufacture streaks.

RPE at least one point above ceiling or deteriorating technique suggests an immediate 2.5–5% reduction. Two difficult sessions for one lift suggest a next-week reduction. Two easy volume sessions with stable sleep/technique may suggest +2.5%; weeks 4, 7 and 8 never receive this automatic increase. Every weekly change requires pressing Accept. Low adherence suggests repeating a week after that week has ended.

Planned loads are always derived from current 1RM, form, percentages and accepted weekly adjustments. Historical logs remain unchanged. Replacements require a manually calibrated load; the app does not transfer another exercise's 1RM.

Persistent pain warrants discussion with a physician or sports physiotherapist. Under-18 users need adult/coach supervision. No result is guaranteed.
