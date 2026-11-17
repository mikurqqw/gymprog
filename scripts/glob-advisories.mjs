import { isDeepStrictEqual } from 'node:util';
export const remediatedGlobAdvisory = {
  id: 1247710,
  url: 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
  title: 'picomatch vulnerable to ReDoS through single-branch repeated extglobs',
  severity: 'high',
  vulnerable_versions: '<=4.0.7',
  cwe: ['CWE-1333'],
  cvss: { score: 7.5, vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H' },
};
export function verifyGlobAdvisories(result) {
  if (
    !result ||
    typeof result !== 'object' ||
    Array.isArray(result) ||
    Object.keys(result).some((key) => key !== 'picomatch')
  )
    throw Error('Invalid upstream advisory response');
  const advisories = Object.hasOwn(result, 'picomatch') ? result.picomatch : [];
  if (!Array.isArray(advisories)) throw Error('Invalid upstream advisory list');
  for (const advisory of advisories)
    if (!isDeepStrictEqual(advisory, remediatedGlobAdvisory))
      throw Error(
        'New or changed upstream advisory requires source review: ' + JSON.stringify(advisory),
      );
  return advisories;
}
