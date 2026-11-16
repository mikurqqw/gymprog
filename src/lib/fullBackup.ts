import { getDatabase } from './database';
import { readConsent, readPreferences } from './consent';
import type { AppState } from './storage';
export async function fullBackup(state: AppState) {
  const db = getDatabase();
  const [foods, favorites, rows] = await Promise.all([
    db.foods.where('customFlag').equals(1).toArray(),
    db.favorites.toArray(),
    db.videos.toArray(),
  ]);
  const videos = await Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      type: row.type,
      size: row.size,
      data: await blobData(row.blob),
    })),
  );
  return {
    format: 'ironcycle-full',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    state,
    consent: readConsent(),
    preferences: readPreferences(),
    foods,
    favorites,
    videos,
  };
}
function blobData(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(Error('Video export failed'));
    reader.onload = () =>
      typeof reader.result === 'string' ? resolve(reader.result) : reject(Error('Invalid video'));
    reader.readAsDataURL(blob);
  });
}
