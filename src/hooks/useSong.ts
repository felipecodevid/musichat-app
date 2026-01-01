import { useEffect, useState, useCallback } from "react";
import { SongsService } from "../services/songs-service/songs-service";
import { songs } from "../db/schema/sqlite";

export function useSong(songId: string, userId: string) {
  const [song, setSong] = useState<typeof songs.$inferSelect | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!songId || !userId) {
      setSong(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const service = new SongsService(userId);
      const result = await service.getSong(songId);
      setSong(result ?? null);
    } catch (e) {
      console.error("Failed to fetch song", e);
      setSong(null);
    } finally {
      setLoading(false);
    }
  }, [songId, userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { song, loading, refresh };
}
