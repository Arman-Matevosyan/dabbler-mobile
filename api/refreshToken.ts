import { getBaseURL } from '@/constants/constants';
import { AuthQueryKeys } from '@/constants/QueryKeys';
import { invalidateAuthDependentQueries, queryClient } from '@/services/query/queryClient';
import { useAuthStore } from '@/store/authStore';
import * as authUtils from '@/utils/authUtils';
import axios from 'axios';

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  try {
    const response = await axios.get(`${getBaseURL()}/auth/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        'x-refresh': 'true',
      },
    });
    
    if (!response.data?.accessToken) {
      throw new Error('Invalid refresh token response');
    }
    
    useAuthStore.getState().setTokens(
      response.data.accessToken,
      response.data.refreshToken || refreshToken,
      response.data.expiresIn
    );
    
    await authUtils.setTokens(
      response.data.accessToken,
      response.data.refreshToken || refreshToken,
      response.data.expiresIn
    );
    
    queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
      isAuthenticated: true,
    });
    
    invalidateAuthDependentQueries();
    
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    
    useAuthStore.getState().logout();
    
    await authUtils.clearTokens();
    
    queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
      isAuthenticated: false,
    });
    
    throw error;
  }
}; 