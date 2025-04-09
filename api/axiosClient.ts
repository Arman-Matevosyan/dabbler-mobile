import { getBaseURL } from '@/constants/constants';
import { showErrorTooltip } from '@/hooks/tooltip';
import { invalidateAuthDependentQueries } from '@/services/query/queryClient';
import * as authUtils from '@/utils/authUtils';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipErrorTooltip?: boolean;
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

    const accessToken = await authUtils.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      console.error('Network error detected:', error.message);

      if (
        error.code === 'ECONNABORTED' &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        originalRequest.timeout = 45000;
        return axiosClient(originalRequest);
      }

      if (!originalRequest?.skipErrorTooltip) {
        showErrorTooltip(
          new Error(
            `Network error - Please check your connection (${error.message})`
          )
        );
      }
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await authUtils.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.get(`${getBaseURL()}/auth/refresh`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (!data?.accessToken) throw new Error('Invalid token response');

        await authUtils.setTokens(data.accessToken, data.refreshToken);

        axiosClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.accessToken}`;
        invalidateAuthDependentQueries();
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        await authUtils.clearTokens();
        processQueue(refreshError as Error, null);

        if (!originalRequest?.skipErrorTooltip) {
          showErrorTooltip(new Error('Session expired - Please login again'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!originalRequest?.skipErrorTooltip) {
      if (error.response.status >= 500) {
        showErrorTooltip(new Error('Server error - Please try again later'));
      } else if (error.response.status !== 401) {
        showErrorTooltip(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
