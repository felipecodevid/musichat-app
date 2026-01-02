import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuth';
import { SongsService } from '@/services/songs-service/songs-service';

interface EditSongInput {
  songId: string;
  name?: string;
  description?: string;
}

interface UseEditSongReturn {
  editSong: (input: EditSongInput) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

export function useEditSong(): UseEditSongReturn {
  const userId = useAuthStore((state) => state.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const editSong = useCallback(
    async (input: EditSongInput): Promise<boolean> => {
      if (!userId) {
        setError(new Error('User not authenticated'));
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const service = new SongsService(userId);
        await service.updateSong(input.songId, {
          name: input.name,
          description: input.description,
        });
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to update song')
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  return { editSong, isLoading, error };
}
