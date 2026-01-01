import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuth";
import { SongsService } from "@/services/songs-service/songs-service";

interface CreateSongInput {
  albumId: string;
  name: string;
  description?: string;
}

interface UseCreateSongReturn {
  createSong: (input: CreateSongInput) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateSong(): UseCreateSongReturn {
  const userId = useAuthStore((state) => state.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSong = useCallback(async (input: CreateSongInput): Promise<string | null> => {
    if (!userId) {
      setError(new Error("User not authenticated"));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = new SongsService(userId);
      const id = await service.addSong(input.albumId, input.name, input.description);
      return id as string;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create song"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { createSong, isLoading, error };
}

