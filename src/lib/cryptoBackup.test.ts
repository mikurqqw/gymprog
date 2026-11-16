import { it, expect } from 'vitest';
import { encryptBackup, decryptBackup } from './cryptoBackup';
it('authenticated backup round-trips and rejects wrong passphrases and tampering', async () => {
  const encrypted = await encryptBackup('{"private":"данные"}', 'long-test-passphrase');
  expect(encrypted).not.toContain('данные');
  expect(await decryptBackup(encrypted, 'long-test-passphrase')).toBe('{"private":"данные"}');
  await expect(decryptBackup(encrypted, 'incorrect-password')).rejects.toThrow();
  const tampered = JSON.parse(encrypted);
  tampered.ciphertext = 'AAAA' + tampered.ciphertext.slice(4);
  await expect(decryptBackup(JSON.stringify(tampered), 'long-test-passphrase')).rejects.toThrow();
}, 10000);
