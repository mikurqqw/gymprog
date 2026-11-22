import { legalReleaseIssues } from '../src/config/legalValidation.ts';
for (const name of ['IRONCYCLE_PREVIEW', 'IRONCYCLE_ALLOW_UNREVIEWED_LAWYER']) {
  if (process.env[name] !== undefined && !['0', '1'].includes(process.env[name]))
    throw Error(name + ' must be 0 or 1');
}
const allowUnreviewedLawyer = process.env.IRONCYCLE_ALLOW_UNREVIEWED_LAWYER === '1';
if (allowUnreviewedLawyer)
  console.warn(
    'WARNING: LAWYER REVIEW OVERRIDDEN. This is NOT legal approval. Other launch requirements still apply.',
  );
const pending = legalReleaseIssues(undefined, { allowUnreviewedLawyer });
if (pending.length && process.env.IRONCYCLE_PREVIEW !== '1') {
  console.error(
    'Production release blocked. Complete real configuration and reviews:\n' + pending.join('\n'),
  );
  process.exitCode = 1;
} else if (pending.length)
  console.warn('Preview build: legal and operator details are pending for production.');
