import { db } from '../../client/sqlite';
import { messages, meta } from '../../schema/sqlite';
import { supabase } from '../../client/supabase';
import { eq, and } from 'drizzle-orm';

const META_KEY = 'messages_last_sync_at';

export async function pullMessages(userId: string) {
  const last = await db.query.meta.findFirst({
    where: and(eq(meta.key, META_KEY), eq(meta.userId, userId)),
  });
  const lastSync = last?.value ?? '1970-01-01T00:00:00.000Z';

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .gt('updated_at', lastSync)
    .eq('user_id', userId);

  if (error) throw error;

  const localById = new Map(
    (await db.select().from(messages)).map((r) => [r.id, r])
  );

  for (const r of data ?? []) {
    const local = localById.get(r.id);
    // Last-write-wins strategy based on updated_at
    const remoteTs = new Date(r.updated_at).getTime();
    const remoteCreatedTs = new Date(r.created_at).getTime();
    const localTs = local?.updatedAt ?? 0;

    if (!local || remoteTs >= localTs) {
      await db
        .insert(messages)
        .values({
          id: r.id,
          content: r.content,
          songId: r.song_id,
          createdAt: remoteCreatedTs,
          deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
          deviceId: r.device_id,
          version: r.version,
          updatedAt: remoteTs,
          userId,
          type: r.type,
          mediaUri: r.media_uri,
        })
        .onConflictDoUpdate({
          target: messages.id,
          set: {
            content: r.content,
            songId: r.song_id,
            updatedAt: remoteTs,
            deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
            deviceId: r.device_id,
            version: r.version,
            type: r.type,
            mediaUri: r.media_uri,
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
