import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { SongsService } from '@/services/songs-service/songs-service';

interface UseDeleteSongReturn {
  deleteSong: (songId: string) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

export function useDeleteSong(): UseDeleteSongReturn {
  const userId = useAuthStore((state) => state.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteSong = useCallback(
    async (songId: string): Promise<boolean> => {
      if (!userId) {
        setError(new Error('User not authenticated'));
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const service = new SongsService(userId);
        await service.softDeleteSong(songId);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to delete song')
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  return { deleteSong, isLoading, error };
}
