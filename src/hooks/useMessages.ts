import { useEffect, useState } from "react";
import { MessagesService } from "@/services/messages-service/messages-service";
import { syncAll } from "../db/sync";

export function useMessages(userId: string, songId: string) {
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const service = new MessagesService(userId);
    const rows = await service.getMessages(songId);
    setItems(rows);
  }

  useEffect(() => {
    refresh();
  }, [userId, songId]);

  async function sync() {
    await syncAll(userId);
    await refresh();
  }

  return { items, refresh, sync };
}
