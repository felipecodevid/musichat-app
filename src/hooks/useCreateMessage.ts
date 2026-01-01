import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuth";
import { MessagesService } from "@/services/messages-service/messages-service";

interface CreateMessageInput {
  songId: string;
  content: string;
  type?: 'text' | 'audio';
  mediaUri?: string;
}

interface UseCreateMessageReturn {
  createMessage: (input: CreateMessageInput) => Promise<string | null>;
  isLoading: boolean;
  error: Error | null;
}

export function useCreateMessage(): UseCreateMessageReturn {
  const userId = useAuthStore((state) => state.userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMessage = useCallback(async (input: CreateMessageInput): Promise<string | null> => {
    if (!userId) {
      setError(new Error("User not authenticated"));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = new MessagesService(userId);
      const id = await service.addMessage(input.content, input.songId, input.type, input.mediaUri);
      return id as string;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create message"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return { createMessage, isLoading, error };
}
