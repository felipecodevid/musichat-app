import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  setUserId: (id: string) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isAuthenticated: false,
  setUserId: (id: string) => set({ userId: id, isAuthenticated: !!id }),
  logout: () => set({ userId: null, isAuthenticated: false }),
}));
