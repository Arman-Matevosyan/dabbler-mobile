import { IUserProfile } from '@/types/user';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  user: IUserProfile | null;
  isLoading: boolean;

  setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => void;
  setUser: (user: IUserProfile | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      user: null,
      isLoading: false,

      setTokens: (accessToken, refreshToken, expiresIn) => set(() => {
        const tokenExpiry = expiresIn 
          ? Math.floor(Date.now() / 1000) + expiresIn 
          : null;
        
        return { 
          accessToken, 
          refreshToken, 
          tokenExpiry,
          isAuthenticated: true 
        };
      }),

      setUser: (user) => set(() => ({ user })),
      
      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      
      setIsLoading: (isLoading) => set(() => ({ isLoading })),
      
      logout: () => set(() => ({
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        isAuthenticated: false,
        user: null,
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export const shouldRefreshToken = (): boolean => {
  const tokenExpiry = useAuthStore.getState().tokenExpiry;
  
  if (!tokenExpiry) return false;
  
  const now = Math.floor(Date.now() / 1000);
  
  return tokenExpiry - now < 300;
};

export const isTokenExpired = (): boolean => {
  const tokenExpiry = useAuthStore.getState().tokenExpiry;
  
  if (!tokenExpiry) return false;
  
  const now = Math.floor(Date.now() / 1000);
  
  return now >= tokenExpiry;
}; 