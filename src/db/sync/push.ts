import { db } from "../client/sqlite";
import { messages, outbox } from "../schema/sqlite";
import { supabase } from "../client/supabase";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function pushChanges(userId: string) {
  const pending = await db.select().from(outbox).orderBy(asc(outbox.createdAt));
  if (pending.length === 0) return;

  // Lote de payloads por tabla; aquí solo "todos"
  const rows = pending.map((o) => JSON.parse(o.payload));

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
