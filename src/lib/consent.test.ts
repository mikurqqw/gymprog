import { expect,it } from 'vitest';
import { isAdult,validConsent } from './consent';
import { legalConfig } from '../config/legal.config';
import { legalReleaseIssues } from '../config/legalValidation';
it('blocks under-18 and invalid calendar dates',()=>{expect(isAdult('2008-11-16','2026-11-15')).toBe(false);expect(isAdult('2008-11-15','2026-11-15')).toBe(true);expect(isAdult('2007-02-30','2026-11-15')).toBe(false);});
it('requires separate current-version consent flags',()=>{const c={schemaVersion:1,adult:true,acceptedAt:'2026-11-15T00:00:00Z',language:'ru',versions:legalConfig.documentVersions,terms:true,privacy:true,health:true,medical:true,calories:true};expect(validConsent(c)).toBe(true);expect(validConsent({...c,health:false})).toBe(false);expect(validConsent({...c,versions:{...c.versions,privacy:'old'}})).toBe(false);});
it('blocks release while actual operator details and reviews are missing',()=>{expect(legalReleaseIssues()).toContain('operator.name');expect(legalReleaseIssues()).toContain('Kazakhstan lawyer review');});
