import { getDatabase } from './database';
export async function saveVideo(id: string, file: File) {
  if (!/^[a-zA-Z0-9_-]{1,200}$/.test(id) || file.size < 12 || file.size > 100 * 1024 * 1024)
    throw Error('videoError');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const mp4 = String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp',
    webm = bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  const type = mp4 ? 'video/mp4' : webm ? 'video/webm' : null;
  if (!type || (file.type && file.type !== type && !(mp4 && file.type === 'video/quicktime')))
    throw Error('videoError');
  await getDatabase().videos.put({ id, blob: new Blob([file], { type }), type, size: file.size });
}
export async function getVideo(id: string) {
  return (await getDatabase().videos.get(id))?.blob;
}
