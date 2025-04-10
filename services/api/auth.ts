import { axiosClient } from '@/api';
import { AuthQueryKeys } from '@/constants/QueryKeys';
import { getBaseURL } from '@/constants/constants';
import {
  invalidateAuthDependentQueries,
  queryClient,
} from '@/services/query/queryClient';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import axios from 'axios';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface TokenResponse {
  token: string;
  type?: string;
}

export interface SocialAuthResult {
  authUrl: string;
  callbackUrl: string;
}

export interface SocialLoginResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface SocialAuthDeepLinkResult {
  refreshToken: string;
  loginType?: 'google' | 'facebook' | 'unknown';
}

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

export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/signin', {
      email,
      password,
    });

    await processAuthSuccess(response.data);
    return response.data;
  },

  signup: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    });

    await processAuthSuccess(response.data);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post('/users/me/forget-password', { email });
  },

  logout: async (): Promise<void> => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      await useAuthStore.getState().logout();
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const success = await useAuthStore.getState().refreshTokens();

      if (!success) {
        throw new Error('Token refresh failed');
      }

      const accessToken = useAuthStore.getState().accessToken;
      const refreshToken = useAuthStore.getState().refreshToken;
      const tokenExpiry = useAuthStore.getState().tokenExpiry;

      return {
        accessToken: accessToken || '',
        refreshToken: refreshToken || '',
        expiresIn: tokenExpiry
          ? tokenExpiry - Math.floor(Date.now() / 1000)
          : undefined,
      };
    } catch (error) {
      console.error('Error in refreshToken:', error);
      throw error;
    }
  },

  googleLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/google`;
  },

  facebookLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/fb`;
  },

  exchangeToken: async (
    token: string,
    type?: string
  ): Promise<SocialLoginResult> => {
    try {
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
        try {
          useAuthStore.getState().setTokens('', token);
          const refreshSuccess = await useAuthStore.getState().refreshTokens();

          if (!refreshSuccess) {
            return { success: false };
          }

          const accessToken = useAuthStore.getState().accessToken;
          const refreshToken = useAuthStore.getState().refreshToken;
          const tokenExpiry = useAuthStore.getState().tokenExpiry;

          return {
            success: true,
            accessToken: accessToken || undefined,
            refreshToken: refreshToken || token,
            expiresIn: tokenExpiry
              ? tokenExpiry - Math.floor(Date.now() / 1000)
              : undefined,
          };
        } catch (err) {
          console.error('Error exchanging refresh token:', err);
          return { success: false };
        }
      }

      if (response?.data?.accessToken) {
        const refreshToken = response.data.refreshToken || token;

        await processAuthSuccess({
          ...response.data,
          refreshToken,
        });

        return {
          success: true,
          accessToken: response.data.accessToken,
          refreshToken,
          expiresIn: response.data.expiresIn,
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Error exchanging token:', error);
      return { success: false };
    }
  },
};

export const extractTokenFromUrl = (url: string): TokenResponse | null => {
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

export const processSocialAuthDeepLink = async (
  url: string
): Promise<SocialAuthDeepLinkResult | null> => {
  try {
    const tokenData = extractTokenFromUrl(url);
    if (!tokenData?.token) return null;

    let loginType: 'google' | 'facebook' | 'unknown' = 'unknown';

    if (tokenData.type === 'google' || tokenData.type === 'facebook') {
      loginType = tokenData.type;
    }

    return {
      refreshToken: tokenData.token,
      loginType,
    };
  } catch (error) {
    console.error('Social auth deep link processing failed:', error);
    return null;
  }
};
