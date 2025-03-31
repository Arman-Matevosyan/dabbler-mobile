import { AuthAPI, AuthResponse, UserAPI } from '@/services/api';
import { User } from '@/types/types';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  socialLoading: 'google' | 'facebook' | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  setTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  handleSocialLogin: (
    type: 'google' | 'facebook',
    token?: string
  ) => Promise<{ authUrl: string; callbackUrl: string } | AuthResponse | void>;
  setSocialLoading: (provider: 'google' | 'facebook' | null) => void;
  fetchUser: () => Promise<User | null>;
  verifyEmail: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  socialLoading: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await AuthAPI.login(email, password);
      await get().setTokens(response.accessToken, response.refreshToken);
      await get().fetchUser();
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    set({ isLoading: true });
    try {
      const response = await AuthAPI.signup(
        email,
        password,
        firstName,
        lastName
      );

      await get().setTokens(response.accessToken, response.refreshToken);
      await get().fetchUser();
      await get().verifyEmail();
      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setTokens: async (accessToken: string, refreshToken?: string) => {
    await SecureStore.setItemAsync('accessToken', accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    set({ isAuthenticated: true });
  },

  getAccessToken: async () => {
    return SecureStore.getItemAsync('accessToken');
  },

  getRefreshToken: async () => {
    return SecureStore.getItemAsync('refreshToken');
  },

  refreshTokens: async () => {
    try {
      const refreshToken = await get().getRefreshToken();
      if (!refreshToken) return false;

      const response = await AuthAPI.refreshToken(refreshToken);
      await get().setTokens(response.accessToken, response.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      set({ user: null, isAuthenticated: false });
      return false;
    }
  },

  setSocialLoading: (provider) => {
    set({ socialLoading: provider });
  },

  handleSocialLogin: async (type: 'google' | 'facebook', token?: string) => {
    set({ socialLoading: type });

    if (token) {
      try {
        const response = await AuthAPI.refreshToken(token);
        await get().setTokens(response.accessToken, response.refreshToken);
        await get().fetchUser();
        set({ isAuthenticated: true, socialLoading: null });
        return response;
      } catch (error) {
        set({ socialLoading: null });
        throw error;
      }
    } else {
      set({ socialLoading: null });
      return {
        authUrl:
          type === 'google' ? AuthAPI.googleLogin() : AuthAPI.facebookLogin(),
        callbackUrl: 'dabbler://auth',
      };
    }
  },

  fetchUser: async () => {
    try {
      const response = await UserAPI.getCurrentUser();
      set({ user: response, isAuthenticated: true });
      return response;
    } catch (error) {
      // If unauthorized, try to refresh the token
      if (error instanceof Error) {
        const anyError = error as any;
        if (anyError.response?.status === 401) {
          const refreshed = await get().refreshTokens();
          if (refreshed) {
            // Try fetching the user again after token refresh
            return get().fetchUser();
          }
        }
      }
      set({ user: null, isAuthenticated: false });
      return null;
    }
  },

  verifyEmail: async () => {
    await UserAPI.verifyEmail();
  },
}));

// Initialize auth state
export const initializeAuth = async () => {
  const authStore = useAuthStore.getState();
  await authStore.fetchUser();
};
