export function parseSafeJson(raw: string, maxBytes = 15_000_000): unknown {
  if (new TextEncoder().encode(raw).length > maxBytes) throw Error('Import too large');
  let nodes = 0;
  const parsed: unknown = JSON.parse(raw, (key, value: unknown) => {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw Error('Unsafe object key');
    if (++nodes > 300000) throw Error('Import too complex');
    return value;
  });
  const visit = (value: unknown, depth: number) => {
    if (depth > 30) throw Error('Import too deep');
    if (value && typeof value === 'object')
      for (const child of Object.values(value)) visit(child, depth + 1);
  };
  visit(parsed, 0);
  return parsed;
}
