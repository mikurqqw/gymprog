export function isStorefrontPath(path: string) {
  return (
    ['/welcome', '/catalog', '/demo', '/about'].includes(path) || /^\/catalog\/[^/]+$/.test(path)
  );
}
