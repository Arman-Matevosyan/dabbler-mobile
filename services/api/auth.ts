import { axiosClient } from '@/api';
import { refreshToken as refreshTokenFunction } from '@/api/refreshToken';
import { AuthQueryKeys } from '@/constants/QueryKeys';
import { getBaseURL } from '@/constants/constants';
import {
  invalidateAuthDependentQueries,
  queryClient,
} from '@/services/query/queryClient';
import { useAuthStore } from '@/store/authStore';
import * as authUtils from '@/utils/authUtils';
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

export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/signin', {
      email,
      password,
    });

    useAuthStore
      .getState()
      .setTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresIn
      );

    await authUtils.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.expiresIn
    );

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

    useAuthStore
      .getState()
      .setTokens(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresIn
      );

    await authUtils.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
      response.data.expiresIn
    );

    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post('/users/me/forget-password', { email });
  },

  logout: async (): Promise<void> => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      useAuthStore.getState().logout();

      await authUtils.clearTokens();

      queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
        isAuthenticated: false,
      });
    }
  },

  refreshToken: refreshTokenFunction,

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
      if (type === 'google' || type === 'facebook') {
        const endpoint =
          type === 'google' ? '/auth/google/token' : '/auth/fb/token';
        const response = await axios.post<AuthResponse>(
          `${getBaseURL()}${endpoint}`,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.accessToken) {
          useAuthStore
            .getState()
            .setTokens(
              response.data.accessToken,
              response.data.refreshToken,
              response.data.expiresIn
            );

          await authUtils.setTokens(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.expiresIn
          );

          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: true,
          });

          invalidateAuthDependentQueries();

          return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            expiresIn: response.data.expiresIn,
          };
        }
      } else {
        const response = await axios.post<AuthResponse>(
          `${getBaseURL()}/auth/refresh`,
          { refreshToken: token },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.accessToken) {
          useAuthStore
            .getState()
            .setTokens(
              response.data.accessToken,
              response.data.refreshToken || token,
              response.data.expiresIn
            );

          await authUtils.setTokens(
            response.data.accessToken,
            response.data.refreshToken || token,
            response.data.expiresIn
          );

          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: true,
          });

          invalidateAuthDependentQueries();

          return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken || token,
            expiresIn: response.data.expiresIn,
          };
        }
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

    let loginType: 'google' | 'facebook' | 'unknown' | undefined;

    if (tokenData.type === 'google' || tokenData.type === 'facebook') {
      loginType = tokenData.type;
    } else {
      loginType = 'unknown';
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
