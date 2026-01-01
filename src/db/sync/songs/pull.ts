import { db } from "../../client/sqlite";
import { songs, meta } from "../../schema/sqlite";
import { supabase } from "../../client/supabase";
import { eq } from "drizzle-orm";

const META_KEY = "songs_last_sync_at";

export async function pullSongs(userId: string) {
  const last = await db.query.meta.findFirst({ where: eq(meta.key, META_KEY) });
  const lastSync = last?.value ?? "1970-01-01T00:00:00.000Z";

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .gt("updated_at", lastSync)
    .eq("user_id", userId);

  if (error) throw error;

  const localById = new Map(
    (await db.select().from(songs)).map((r) => [r.id, r])
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
        .insert(songs)
        .values({
          id: r.id,
          albumId: r.album_id,
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
          target: songs.id,
          set: {
            albumId: r.album_id,
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
    .values({ key: META_KEY, value: nowIso })
    .onConflictDoUpdate({ target: meta.key, set: { value: nowIso } });
}
