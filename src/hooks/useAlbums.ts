import { useEffect, useState } from "react";
import { db } from "../db/client/sqlite";
import { albums } from "../db/schema/sqlite";
import { eq, and, isNull } from "drizzle-orm";
import { syncAll } from "../db/sync";

export function useAlbums(userId: string) {
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const rows = await db.select().from(albums)
      .where(and(eq(albums.userId, userId), isNull(albums.deletedAt)));
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
