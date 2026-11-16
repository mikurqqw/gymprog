import { readFileSync } from 'node:fs';
import { it, expect } from 'vitest';
it('manifest is UTF-8, scoped for subpath hosting and has separate maskable icon and screenshots', () => {
  const raw = readFileSync('public/manifest.webmanifest', 'utf8'),
    manifest = JSON.parse(raw);
  expect(raw).not.toMatch(/вЂ|\uFFFD/);
  expect(manifest.name).toBe('IronCycle');
  expect(manifest.id).toBe('./');
  expect(manifest.scope).toBe('./');
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(
    true,
  );
  expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'any')).toBe(true);
  expect(manifest.screenshots).toHaveLength(2);
  expect(manifest.shortcuts.map((shortcut: { url: string }) => shortcut.url)).toEqual([
    './#/workout',
    './#/nutrition',
    './#/checkin',
  ]);
});
it('source production CSP contains no websocket or wildcard allowance', () => {
  const html = readFileSync('index.html', 'utf8');
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  expect(csp).toBeTruthy();
  expect(csp).not.toMatch(/ws:|wss:|\*/);
});
