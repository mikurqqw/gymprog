import { z } from 'zod';
import { parseSafeJson } from './safeJson';
const iterations = 600000;
const envelope = z.object({
  format: z.literal('ironcycle-encrypted'),
  version: z.literal(1),
  iterations: z.literal(iterations),
  salt: z.string().regex(/^[A-Za-z0-9+/=]{24}$/),
  iv: z.string().regex(/^[A-Za-z0-9+/=]{16}$/),
  ciphertext: z
    .string()
    .regex(/^[A-Za-z0-9+/=]+$/)
    .max(30_000_000),
});
const encode = (bytes: Uint8Array) => {
  let value = '';
  for (let i = 0; i < bytes.length; i += 8192)
    value += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(value);
};
const decode = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
async function derive(passphrase: string, salt: Uint8Array<ArrayBuffer>) {
  const source = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    source,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}
export async function encryptBackup(raw: string, passphrase: string) {
  if (passphrase.length < 10 || passphrase.length > 1024 || raw.length > 15_000_000)
    throw Error('Invalid backup or passphrase');
  const salt = crypto.getRandomValues(new Uint8Array(16)),
    iv = crypto.getRandomValues(new Uint8Array(12)),
    key = await derive(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode('ironcycle:v1') },
    key,
    new TextEncoder().encode(raw),
  );
  return JSON.stringify({
    format: 'ironcycle-encrypted',
    version: 1,
    iterations,
    salt: encode(salt),
    iv: encode(iv),
    ciphertext: encode(new Uint8Array(ciphertext)),
  });
}
export async function decryptBackup(raw: string, passphrase: string) {
  if (passphrase.length > 1024) throw Error('Invalid passphrase');
  const data = envelope.parse(parseSafeJson(raw, 31_000_000)),
    key = await derive(passphrase, decode(data.salt));
  const clear = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: decode(data.iv),
      additionalData: new TextEncoder().encode('ironcycle:v1'),
    },
    key,
    decode(data.ciphertext),
  );
  if (clear.byteLength > 15_000_000) throw Error('Backup too large');
  return new TextDecoder().decode(clear);
}
