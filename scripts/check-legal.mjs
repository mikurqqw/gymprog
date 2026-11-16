import { legalConfig } from '../src/config/legal.config.ts';
const pending = Object.entries(legalConfig.operator)
  .filter(([, value]) => !value.trim() || value.includes('__REQUIRED'))
  .map(([key]) => 'operator.' + key);
if (!/^\d{4}-\d{2}-\d{2}$/.test(legalConfig.effectiveDate)) pending.push('effectiveDate');
if (!legalConfig.reviewedByKazakhstanLawyer) pending.push('Kazakhstan lawyer review');
if (!legalConfig.reviewedByKazakhNativeSpeaker) pending.push('Kazakh native-speaker review');
if (
  process.env.IRONCYCLE_PREVIEW !== undefined &&
  !['0', '1'].includes(process.env.IRONCYCLE_PREVIEW)
)
  throw Error('IRONCYCLE_PREVIEW must be 0 or 1');
if (pending.length && process.env.IRONCYCLE_PREVIEW !== '1') {
  console.error(
    'Production release blocked. Complete legal.config.ts and obtain actual reviews:\n' +
      pending.join('\n'),
  );
  process.exitCode = 1;
} else if (pending.length)
  console.warn(
    'Explicit preview build. Legal/review placeholders remain; a preview banner is mandatory.',
  );
