import { getCurrentLanguage } from '@/app/i18n';
import { getBaseURL } from '@/constants/constants';
import { showErrorTooltip } from '@/hooks/tooltip';
import { NavigationHandler } from '@/services/navigation/navigationHandler';
import { invalidateAuthDependentQueries } from '@/services/query/queryClient';
import { shouldRefreshToken, useAuthStore } from '@/store/authStore';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Alert } from 'react-native';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipErrorTooltip?: boolean;
  skipAuthRefresh?: boolean;
}

type QueueItem = {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: CustomAxiosRequestConfig;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.config.headers.Authorization = `Bearer ${token}`;
      axiosClient(item.config).then(item.resolve).catch(item.reject);
    }
  });
  failedQueue = [];
};

const axiosClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      const parts = [];
      for (const key in params) {
        const value = params[key];
        if (Array.isArray(value) && value.length === 0) {
          parts.push(`${encodeURIComponent(key)}=[]`);
        } else if (Array.isArray(value)) {
          parts.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(
              JSON.stringify(value)
            )}`
          );
        } else if (value !== undefined && value !== null) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      }
      return parts.join('&');
    },
  },
});

axiosClient.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    if (
      config.url?.includes('/auth/refresh') ||
      config.headers?.['x-refresh']
    ) {
      return config;
    }

    if (shouldRefreshToken() && !config._retry) {
      try {
        await useAuthStore.getState().refreshTokens();
      } catch (error) {
        console.error('Failed to refresh token on request:', error);
      }
    }

    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const currentLanguage = await getCurrentLanguage();
    if (currentLanguage) {
      config.headers['x-lang'] = currentLanguage;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!error.response) {
      if (!originalRequest?.skipErrorTooltip) {
        showErrorTooltip(
          new Error(`Network error - Please check your connection`)
        );
      }
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenValue = useAuthStore.getState().refreshToken;
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        const refreshed = await useAuthStore.getState().refreshTokens();
        if (!refreshed) {
          throw new Error('Token refresh failed');
        }

        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          throw new Error('Failed to get new access token');
        }

        axiosClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        invalidateAuthDependentQueries();

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);

        if (!originalRequest?.skipErrorTooltip) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please log in again to continue.',
            [
              {
                text: 'OK',
                onPress: () => {
                  NavigationHandler.navigateToLogin('Your session has expired');
                },
              },
            ]
          );
        } else {
          NavigationHandler.navigateToLogin();
        }

        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!originalRequest?.skipErrorTooltip) {
      if (error.response?.status >= 500) {
        showErrorTooltip(new Error('Server error - Please try again later'));
      } else if (error.response?.status !== 401) {
        showErrorTooltip(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
