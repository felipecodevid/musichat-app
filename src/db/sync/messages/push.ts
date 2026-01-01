import { db } from "../../client/sqlite";
import { outbox } from "../../schema/sqlite";
import { supabase } from "../../client/supabase";
import { asc, eq, and } from "drizzle-orm";

export async function pushMessages(userId: string) {
  const pending = await db
    .select()
    .from(outbox)
    .where(eq(outbox.table, "messages"))
    .orderBy(asc(outbox.createdAt));

  if (pending.length === 0) return;

  const rows = pending.map((o) => {
    const payload = JSON.parse(o.payload);

    const safeDate = (val: any) => {
      if (!val) return new Date().toISOString();
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    };

    const safeDateNullable = (val: any) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    return {
      id: payload.id,
      content: payload.content,
      song_id: payload.songId || payload.song_id,
      created_at: safeDate(payload.createdAt || payload.created_at),
      updated_at: safeDate(payload.updatedAt || payload.updated_at),
      user_id: payload.userId || payload.user_id || userId,
      device_id: payload.deviceId || payload.device_id,
      version: payload.version,
      deleted_at: safeDateNullable(payload.deletedAt || payload.deleted_at),
    };
  });

  const { error } = await supabase
    .from("messages")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: false });

  if (error) throw error;

  // Clean up processed outbox entries
  const opIds = pending.map((p) => p.opId);
  for (const id of opIds) {
    await db.delete(outbox).where(eq(outbox.opId, id));
  }
}
