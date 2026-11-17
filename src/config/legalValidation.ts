import { legalConfig } from './legal.config.ts';
import { launchConfig } from './launch.config.ts';
export function legalReleaseIssues(
  config: typeof legalConfig = legalConfig,
  options: { allowUnreviewedLawyer?: boolean; launch?: typeof launchConfig } = {},
) {
  const issues: string[] = [];
  const launch = options.launch ?? launchConfig;
  for (const [key, value] of Object.entries(config.operator)) {
    if (!value.trim() || value.includes('__REQUIRED')) issues.push('operator.' + key);
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(config.effectiveDate) ||
    !Number.isFinite(Date.parse(config.effectiveDate))
  )
    issues.push('effectiveDate');
  if (!config.reviewedByKazakhstanLawyer && !options.allowUnreviewedLawyer)
    issues.push('Kazakhstan lawyer review');
  if (!config.reviewedByKazakhNativeSpeaker) issues.push('Kazakh native-speaker review');
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(launch.supportEmail) ||
    launch.supportEmail.includes('__REQUIRED')
  )
    issues.push('supportEmail');
  try {
    const contact = new URL(launch.securityContact);
    if (
      !['https:', 'mailto:'].includes(contact.protocol) ||
      contact.username ||
      contact.password ||
      launch.securityContact.includes('__REQUIRED')
    )
      throw Error('Invalid contact');
    if (contact.protocol === 'mailto:' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.pathname))
      throw Error('Invalid mailbox');
  } catch {
    issues.push('securityContact');
  }
  try {
    const site = new URL(launch.siteUrl);
    if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash)
      throw Error('Invalid site');
  } catch {
    issues.push('siteUrl');
  }
  return issues;
}
