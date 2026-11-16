export function isStorefrontPath(path:string){return ['/welcome','/catalog','/demo'].includes(path)||/^\/catalog\/[^/]+$/.test(path);}
