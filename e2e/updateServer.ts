import { createServer } from 'node:http';
import { cp, readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { resolve, extname, join, sep } from 'node:path';
export async function updateServer() {
  const artifacts = resolve('artifacts');
  await mkdir(artifacts, { recursive: true });
  const base = await mkdtemp(join(artifacts, 'update-fixture-'));
  for (const id of ['A', 'B']) {
    const directory = join(base, id);
    await cp('dist', directory, { recursive: true });
    const html = await readFile(join(directory, 'index.html'), 'utf8'),
      match = html.match(/src="(\.\/assets\/index-[^"]+\.js)"/);
    if (!match) throw Error('Missing entry module');
    const original = match[1],
      replacement = original.replace('.js', `-${id}.js`),
      module = await readFile(join(directory, original), 'utf8');
    await writeFile(
      join(directory, replacement),
      `window.__IRONCYCLE_TEST_BUILD__='${id}';\n` + module,
    );
    await writeFile(join(directory, 'index.html'), html.replaceAll(original, replacement));
    const worker = await readFile(join(directory, 'sw.js'), 'utf8');
    await writeFile(
      join(directory, 'sw.js'),
      worker
        .replace(/const BUILD_ID = '[^']+'/, `const BUILD_ID = 'fixture-${id}'`)
        .replaceAll(original, replacement),
    );
  }
  let version = 'A';
  const mime: Record<string, string> = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
  };
  const server = createServer(async (req, res) => {
    try {
      const root = join(base, version),
        pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname),
        file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(root + sep)) {
        res.writeHead(403).end();
        return;
      }
      const bytes = await readFile(file);
      res
        .writeHead(200, {
          'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
          'Cache-Control': 'no-store',
        })
        .end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('No update fixture port');
  return {
    url: `http://127.0.0.1:${address.port}`,
    publishB: () => {
      version = 'B';
    },
    close: async () => {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      if (!base.startsWith(artifacts + sep)) throw Error('Unsafe cleanup target');
      await rm(base, { recursive: true, force: true });
    },
  };
}
