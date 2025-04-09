import { getBaseURL } from '@/constants/constants';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const TOKENS_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  AUTH_STATE: 'auth_state',
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(
      TOKENS_STORAGE_KEYS.ACCESS_TOKEN
    );
    return token;
  } catch (error) {
    console.error('Error retrieving access token from storage:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(
      TOKENS_STORAGE_KEYS.REFRESH_TOKEN
    );
    return token;
  } catch (error) {
    console.error('Error retrieving refresh token from storage:', error);
    return null;
  }
};

export const setTokens = async (
  accessToken: string,
  refreshToken?: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(
      TOKENS_STORAGE_KEYS.ACCESS_TOKEN,
      accessToken
    );
    if (refreshToken) {
      await SecureStore.setItemAsync(
        TOKENS_STORAGE_KEYS.REFRESH_TOKEN,
        refreshToken
      );
    }
    await SecureStore.setItemAsync(TOKENS_STORAGE_KEYS.AUTH_STATE, 'true');
  } catch (error) {
    console.error('Error setting tokens in storage:', error);
  }
};

export const clearTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKENS_STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(TOKENS_STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(TOKENS_STORAGE_KEYS.AUTH_STATE);
  } catch (error) {
    console.error('Error clearing tokens from storage:', error);
  }
};

export const checkAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAccessToken();
    const authState = await SecureStore.getItemAsync(
      TOKENS_STORAGE_KEYS.AUTH_STATE
    );
    return !!token && authState === 'true';
  } catch (error) {
    console.error('Error checking authentication state:', error);
    return false;
  }
};

export const refreshTokens = async (): Promise<boolean> => {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    const response = await axios.get(`${getBaseURL()}/auth/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.data.accessToken) {
      await setTokens(
        response.data.accessToken,
        response.data.refreshToken || refreshToken
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    await clearTokens();
    return false;
  }
};
