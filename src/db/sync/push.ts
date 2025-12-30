import { db } from "../client/sqlite";
import { messages, outbox } from "../schema/sqlite";
import { supabase } from "../client/supabase";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function pushChanges(userId: string) {
  const pending = await db.select().from(outbox).orderBy(asc(outbox.createdAt));
  if (pending.length === 0) return;

  // Lote de payloads por tabla; aquí solo "messages"
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
      created_at: safeDate(payload.createdAt || payload.created_at),
      updated_at: safeDate(payload.updatedAt || payload.updated_at),
      user_id: payload.userId || payload.user_id || userId,
      device_id: payload.deviceId || payload.device_id,
      version: payload.version,
      deleted_at: safeDateNullable(payload.deletedAt || payload.deleted_at),
    };
  });

  // Upsert en Supabase
  const { data, error } = await supabase
    .from("messages")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: false });


  if (error) throw error;

  // Si todo OK, limpiamos outbox
  const opIds = pending.map((p) => p.opId);
  for (const id of opIds) {
    await db.delete(outbox).where(eq(outbox.opId, id));
  }
}
