import { describe, it, expect } from 'vitest';
import { legalConfig } from './legal.config';
import { legalReleaseIssues } from './legalValidation';
describe('production legal guard', () => {
  it('blocks unresolved facts and reviews by default', () => {
    expect(legalReleaseIssues()).toContain('operator.name');
    expect(legalReleaseIssues()).toContain('Kazakhstan lawyer review');
  });
  it('lawyer-only override cannot bypass other requirements', () => {
    const issues = legalReleaseIssues(legalConfig, { allowUnreviewedLawyer: true });
    expect(issues).not.toContain('Kazakhstan lawyer review');
    expect(issues).toEqual(
      expect.arrayContaining([
        'operator.name',
        'Kazakh native-speaker review',
        'supportEmail',
        'securityContact',
      ]),
    );
  });
});

it('rejects contact control characters and impossible effective dates', () => {
  expect(legalReleaseIssues({ ...legalConfig, effectiveDate: '2026-02-30' })).toContain(
    'effectiveDate',
  );
  expect(
    legalReleaseIssues(legalConfig, {
      launch: {
        siteUrl: 'https://example.com/',
        supportEmail: 'team@example.com',
        securityContact: 'mailto:team@example.com\n#ignored',
      },
    }),
  ).toContain('securityContact');
});
