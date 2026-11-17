import { expect, it } from 'vitest';
import { feedbackLink, diagnostics } from './feedback';
it('does not create a working contact from placeholders or injected addresses', () => {
  expect(feedbackLink('__REQUIRED_SUPPORT_EMAIL__', '1.1.0', 'ru')).toBeNull();
  expect(feedbackLink('javascript:alert(1)', '1.1.0', 'en')).toBeNull();
});
it('prefills only app version and language without sending anything', () => {
  const url = new URL(feedbackLink('support@example.com', '1.1.0', 'kk')!);
  expect(url.protocol).toBe('mailto:');
  expect(url.searchParams.get('body')).toBe('IronCycle: 1.1.0\nLanguage: kk\n\n');
});
it('diagnostics uses an explicit three-field allowlist', () => {
  expect(diagnostics('1.1.0', 'Test browser', true)).toEqual({
    version: '1.1.0',
    browser: 'Test browser',
    storage: 'available',
  });
});
