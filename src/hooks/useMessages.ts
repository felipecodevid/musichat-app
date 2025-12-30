import { useEffect, useState } from "react";
import { db } from "../db/client/sqlite";
import { messages } from "../db/schema/sqlite";
import { eq, and, isNull } from "drizzle-orm";
import { syncAll } from "../db/sync";

export function useMessages(userId: string) {
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const rows = await db.select().from(messages)
      .where(and(eq(messages.userId, userId), isNull(messages.deletedAt)));
    setItems(rows);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function sync() {
    await syncAll(userId);
    await refresh();
  }

  return { items, refresh, sync };
}
