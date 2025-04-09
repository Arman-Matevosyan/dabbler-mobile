import { axiosClient } from '@/api';
import { AuthQueryKeys } from '@/constants/QueryKeys';
import { getBaseURL } from '@/constants/constants';
import { invalidateAuthDependentQueries, queryClient } from '@/services/query/queryClient';
import * as authUtils from '@/utils/authUtils';
import axios from 'axios';

// Basic Auth Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
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
}

export interface SocialAuthDeepLinkResult {
  refreshToken: string;
  loginType?: 'google' | 'facebook' | 'unknown';
}

// Regular Authentication API
export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/signin', {
      email,
      password,
    });
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
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post('/users/me/forget-password', { email });
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosClient.get('/auth/refresh', {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data;
  },

  // Social Auth Functions
  googleLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/google`;
  },

  facebookLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/fb`;
  },

  // Token exchange for social auth
  exchangeToken: async (token: string, type?: string): Promise<SocialLoginResult> => {
    try {
      // If we have a type, this is a social login token
      if (type === 'google' || type === 'facebook') {
        const endpoint = type === 'google' ? '/auth/google/token' : '/auth/fb/token';
        const response = await axios.post<AuthResponse>(
          `${getBaseURL()}${endpoint}`,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data.accessToken) {
          await authUtils.setTokens(
            response.data.accessToken,
            response.data.refreshToken
          );
          
          // Update auth state
          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: true
          });
          
          invalidateAuthDependentQueries();
          
          return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          };
        }
      } 
      // Otherwise, treat it as a refresh token
      else {
        const response = await axios.post<AuthResponse>(
          `${getBaseURL()}/auth/refresh`,
          { refreshToken: token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        if (response.data.accessToken) {
          await authUtils.setTokens(
            response.data.accessToken,
            response.data.refreshToken || token
          );
          
          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: true
          });
          
          invalidateAuthDependentQueries();
          
          return {
            success: true,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken || token
          };
        }
      }
      
      return { success: false };
    } catch (error) {
      console.error('Error exchanging token:', error);
      return { success: false };
    }
  }
};

// Utility Functions for Social Auth
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
      type: type || undefined 
    };
  } catch (error) {
    console.error('Error extracting token from URL:', error);
    return null;
  }
};

export const processSocialAuthDeepLink = async (url: string): Promise<SocialAuthDeepLinkResult | null> => {
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
