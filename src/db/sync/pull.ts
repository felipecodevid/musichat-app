import { db } from "../client/sqlite";
import { messages, meta } from "../schema/sqlite";
import { supabase } from "../client/supabase";
import { eq } from "drizzle-orm";

export async function pullChanges(userId: string) {
  const last = await db.query.meta.findFirst({ where: eq(meta.key, "last_sync_at") });
  const lastSync = last?.value ?? "1970-01-01T00:00:00.000Z";

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .gt("updated_at", lastSync)
    .eq("user_id", userId);

  if (error) throw error;

  const localById = new Map(
    (await db.select().from(messages)).map((r) => [r.id, r])
  );

  for (const r of data ?? []) {
    const local = localById.get(r.id);
    // regla: last-write-wins (por updated_at)
    const remoteTs = new Date(r.updated_at).getTime();
    const localTs = local?.updatedAt ?? 0;

    if (!local || remoteTs >= localTs) {
      // aplicar remoto
      await db
        .insert(messages)
        .values({
          id: r.id, content: r.content, createdAt: remoteTs,
          deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
          deviceId: r.device_id, version: r.version,
        })
        .onConflictDoUpdate({
          target: messages.id,
          set: {
            content: r.content, updatedAt: remoteTs,
            deletedAt: r.deleted_at ? new Date(r.deleted_at).getTime() : null,
            deviceId: r.device_id, version: r.version,
          },
        });
    }
  }

  const nowIso = new Date().toISOString();
  await db
    .insert(meta).values({ key: "last_sync_at", value: nowIso })
    .onConflictDoUpdate({ target: meta.key, set: { value: nowIso } });
}
