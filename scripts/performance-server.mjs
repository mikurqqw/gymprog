import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
const root = resolve('dist'),
  cache = new Map();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405);
      res.end();
      return;
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1:4175').pathname);
    const path = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!path.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!cache.has(path)) {
      const bytes = await readFile(path);
      cache.set(path, {
        bytes,
        gzip: /\.(?:js|css|html|json|svg|webmanifest|txt|xml)$/.test(path) ? gzipSync(bytes) : null,
      });
    }
    const file = cache.get(path),
      compressed = file.gzip && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
    const body = compressed ? file.gzip : file.bytes;
    res.writeHead(200, {
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      'Content-Length': body.length,
      Vary: 'Accept-Encoding',
      ...(compressed ? { 'Content-Encoding': 'gzip' } : {}),
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(4175, '127.0.0.1', () =>
  console.log('Local: http://127.0.0.1:4175 (compressed static build, cold browser cache)'),
);
