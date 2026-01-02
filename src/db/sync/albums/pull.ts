import { db } from '../../client/sqlite';
import { albums, meta } from '../../schema/sqlite';
import { supabase } from '../../client/supabase';
import { eq, and } from 'drizzle-orm';

const META_KEY = 'albums_last_sync_at';

export async function pullAlbums(userId: string) {
  const last = await db.query.meta.findFirst({
    where: and(eq(meta.key, META_KEY), eq(meta.userId, userId)),
  });
  const lastSync = last?.value ?? '1970-01-01T00:00:00.000Z';

  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .gt('updated_at', lastSync)
    .eq('user_id', userId);

  if (error) {
    console.error('Error pulling albums: ', error);
    throw error;
  }

  const localById = new Map(
    (await db.select().from(albums)).map((r) => [r.id, r])
  );

  for (const r of data ?? []) {
    const local = localById.get(r.id);
    // Last-write-wins strategy based on updated_at
    const remoteTs = new Date(r.updated_at).getTime();
    const remoteCreatedTs = new Date(r.created_at).getTime();
    const localTs = local?.updatedAt ?? 0;

    if (!local || remoteTs >= localTs) {
      // Convert tags array to JSON string for SQLite storage
      const tagsJson = r.tags ? JSON.stringify(r.tags) : null;

      await db
        .insert(albums)
        .values({
          id: r.id,
          name: r.name,
          description: r.description ?? null,
          tags: tagsJson,
          createdAt: remoteCreatedTs,
          deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
          deviceId: r.device_id,
          version: r.version,
          updatedAt: remoteTs,
          userId,
        })
        .onConflictDoUpdate({
          target: albums.id,
          set: {
            name: r.name,
            description: r.description ?? null,
            tags: tagsJson,
            updatedAt: remoteTs,
            deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
            deviceId: r.device_id,
            version: r.version,
          },
        });
    }
  }

  const nowIso = new Date().toISOString();
  await db
    .insert(meta)
    .values({ userId, key: META_KEY, value: nowIso })
    .onConflictDoUpdate({
      target: [meta.userId, meta.key],
      set: { value: nowIso },
    });
}
