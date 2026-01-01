import { useEffect, useState } from "react";
import { db } from "../db/client/sqlite";
import { songs } from "../db/schema/sqlite";
import { eq, and, isNull } from "drizzle-orm";
import { syncAll } from "../db/sync";

export function useSongs(userId: string, albumId?: string) {
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const conditions = [eq(songs.userId, userId), isNull(songs.deletedAt)];

    if (albumId) {
      conditions.push(eq(songs.albumId, albumId));
    }

    const rows = await db.select().from(songs)
      .where(and(...conditions));
    setItems(rows);
  }

  useEffect(() => {
    refresh();
  }, [albumId]);

  async function sync() {
    await syncAll(userId);
    await refresh();
  }

  return { items, refresh, sync };
}

