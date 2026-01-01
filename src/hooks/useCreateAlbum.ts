import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuth";
import { AlbumsService } from "@/services/albums-service/albums-service";

interface CreateAlbumInput {
  name: string;
  description?: string;
}

interface UseCreateAlbumReturn {
  createAlbum: (input: CreateAlbumInput) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateAlbum(): UseCreateAlbumReturn {
  const userId = useAuthStore((state) => state.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAlbum = useCallback(async (input: CreateAlbumInput): Promise<string | null> => {
    if (!userId) {
      setError(new Error("User not authenticated"));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = new AlbumsService(userId);
      const id = await service.addAlbum(input.name, input.description);
      return id as string;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create album"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { createAlbum, isLoading, error };
}
