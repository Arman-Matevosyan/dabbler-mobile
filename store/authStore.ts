import { axiosClient } from '@/api';
import { getBaseURL } from '@/constants/constants';
import { AuthQueryKeys } from '@/constants/QueryKeys';
import {
  invalidateAuthDependentQueries,
  queryClient,
} from '@/services/query/queryClient';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
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

export const TOKENS_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_STATE: 'auth_state',
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface TokenResponse {
  token: string;
  type?: string;
}

export interface SocialLoginResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  socialLoginLoading: boolean;
  socialLoginError: string | null;

  setTokens: (
    accessToken: string,
    refreshToken: string,
    expiresIn?: number
  ) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSocialLoginLoading: (loading: boolean) => void;
  setSocialLoginError: (error: string | null) => void;

  login: (email: string, password: string) => Promise<AuthResponse | null>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  startSocialLogin: (
    provider: 'google' | 'facebook',
    redirectUrl: string
  ) => Promise<SocialLoginResult>;
  exchangeToken: (token: string, type?: string) => Promise<SocialLoginResult>;

  refreshTokens: () => Promise<boolean>;
  checkAndRefreshTokenIfNeeded: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isLoading: false,
      isRefreshing: false,
      error: null,
      socialLoginLoading: false,
      socialLoginError: null,

      setTokens: (accessToken, refreshToken, expiresIn) =>
        set(() => {
          const tokenExpiry = expiresIn
            ? Math.floor(Date.now() / 1000) + expiresIn
            : null;

          return {
            accessToken,
            refreshToken,
            tokenExpiry,
            isAuthenticated: true,
            error: null,
          };
        }),

      setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
      setIsLoading: (isLoading) => set(() => ({ isLoading })),
      setError: (error) => set(() => ({ error })),
      setSocialLoginLoading: (loading) =>
        set(() => ({ socialLoginLoading: loading })),
      setSocialLoginError: (error) => set(() => ({ socialLoginError: error })),

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosClient.post<AuthResponse>(
            '/auth/signin',
            {
              email,
              password,
            }
          );

          await processAuthSuccess(response.data);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          console.error('Login error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to login';

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          return null;
        }
      },

      signup: async (email, password, firstName, lastName) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axiosClient.post<AuthResponse>(
            '/auth/signup',
            {
              email,
              password,
              firstName,
              lastName,
            }
          );

          await processAuthSuccess(response.data);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          console.error('Signup error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to signup';

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
          });

          return null;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });

          try {
            await axiosClient.post('/auth/logout');
          } catch (error) {
            console.warn('Error notifying server about logout:', error);
          }

          set(() => ({
            accessToken: null,
            refreshToken: null,
            tokenExpiry: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          }));

          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: false,
          });

          useUserStore.getState().clearUser();

          return Promise.resolve();
        } catch (error) {
          console.error('Logout error:', error);
          set({
            isLoading: false,
            error: 'Failed to logout properly',
          });
          return Promise.resolve();
        }
      },

      forgotPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });

          await axiosClient.post('/users/me/forget-password', { email });

          set({ isLoading: false });
          return true;
        } catch (error) {
          console.error('Forgot password error:', error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to process password reset';

          set({
            isLoading: false,
            error: errorMessage,
          });

          return false;
        }
      },

      startSocialLogin: async (provider, redirectUrl) => {
        try {
          set({
            socialLoginLoading: true,
            socialLoginError: null,
            error: null,
          });

          const baseUrl = axiosClient.defaults.baseURL;
          const authUrl =
            provider === 'google'
              ? `${baseUrl}/auth/google`
              : `${baseUrl}/auth/fb`;

          const tokenResponse = await extractTokenFromRedirect(redirectUrl);

          if (!tokenResponse || !tokenResponse.token) {
            set({
              socialLoginLoading: false,
              socialLoginError: 'Failed to get token from redirect',
            });
            return { success: false };
          }

          return await get().exchangeToken(
            tokenResponse.token,
            tokenResponse.type || provider
          );
        } catch (error) {
          console.error(`${provider} login error:`, error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Failed to login with ${provider}`;

          set({
            socialLoginLoading: false,
            socialLoginError: errorMessage,
          });

          return { success: false };
        }
      },

      exchangeToken: async (token, type) => {
        try {
          set({ isLoading: true, error: null });

          let response;

          if (type === 'google' || type === 'facebook') {
            const endpoint =
              type === 'google' ? '/auth/google/token' : '/auth/fb/token';

            response = await axios.post<AuthResponse>(
              `${getBaseURL()}${endpoint}`,
              { token },
              { headers: { 'Content-Type': 'application/json' } }
            );
          } else {
            get().setTokens('', token);
            const refreshSuccess = await get().refreshTokens();

            if (!refreshSuccess) {
              set({ isLoading: false });
              return { success: false };
            }

            const accessToken = get().accessToken;
            const refreshToken = get().refreshToken;
            const tokenExpiry = get().tokenExpiry;

            set({ isLoading: false });
            return {
              success: true,
              accessToken: accessToken || undefined,
              refreshToken: refreshToken || token,
              expiresIn: tokenExpiry
                ? tokenExpiry - Math.floor(Date.now() / 1000)
                : undefined,
            };
          }

          if (response?.data?.accessToken) {
            const refreshToken = response.data.refreshToken || token;

            await processAuthSuccess({
              ...response.data,
              refreshToken,
            });

            set({ isLoading: false });
            return {
              success: true,
              accessToken: response.data.accessToken,
              refreshToken,
              expiresIn: response.data.expiresIn,
            };
          }

          set({ isLoading: false, error: 'Invalid token exchange response' });
          return { success: false };
        } catch (error) {
          console.error('Token exchange error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to exchange token';

          set({
            isLoading: false,
            error: errorMessage,
          });

          return { success: false };
        }
      },

      refreshTokens: async () => {
        const refreshToken = get().refreshToken;

        if (!refreshToken) {
          set({ error: 'No refresh token available' });
          return false;
        }

        try {
          set({ isRefreshing: true });

          const response = await axios.get(`${getBaseURL()}/auth/refresh`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          if (response.data.accessToken) {
            get().setTokens(
              response.data.accessToken,
              response.data.refreshToken || refreshToken,
              response.data.expiresIn
            );

            queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
              isAuthenticated: true,
            });

            set({ isRefreshing: false, error: null });
            return true;
          }

          set({ isRefreshing: false, error: 'Invalid refresh token response' });
          return false;
        } catch (error) {
          console.error('Error refreshing tokens:', error);

          set({
            isRefreshing: false,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to refresh token',
          });

          await get().logout();
          return false;
        }
      },

      checkAndRefreshTokenIfNeeded: async () => {
        try {
          const isAuthenticated = get().isAuthenticated;
          if (!isAuthenticated) return false;

          if (shouldRefreshToken()) {
            console.log('Token expires soon, refreshing...');
            return await get().refreshTokens();
          }

          return true;
        } catch (error) {
          console.error('Error in checkAndRefreshTokenIfNeeded:', error);
          set({ error: 'Failed to check token status' });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

const extractTokenFromRedirect = (url: string): TokenResponse | null => {
  try {
    const urlParts = url.split('?');
    if (urlParts.length <= 1) return null;

    const params = new URLSearchParams(urlParts[1]);
    const token = params.get('token') || params.get('refresh');
    const type = params.get('type');

    if (!token) return null;

    return {
      token,
      type: type || undefined,
    };
  } catch (error) {
    console.error('Error extracting token from URL:', error);
    return null;
  }
};

const processAuthSuccess = async (response: AuthResponse): Promise<void> => {
  useAuthStore
    .getState()
    .setTokens(response.accessToken, response.refreshToken, response.expiresIn);

  useUserStore.getState().clearUser();

  queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
    isAuthenticated: true,
  });

  invalidateAuthDependentQueries();
};

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
