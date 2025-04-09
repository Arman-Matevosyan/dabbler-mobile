import { showErrorTooltip } from '@/hooks/tooltip';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import axiosClient from './axiosClient';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  skipErrorTooltip?: boolean;
}

export function addErrorInterceptors(apiInstance: AxiosInstance): void {
  if (apiInstance.interceptors.response.eject) {
    try {
      const interceptors =
        (apiInstance as any).interceptors.response.handlers || [];
      interceptors.forEach((_: any, idx: number) => {
        apiInstance.interceptors.response.eject(idx);
      });
    } catch (e) {
      console.warn('Failed to clean up previous interceptors:', e);
    }
  }

  apiInstance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const config = error.config as CustomAxiosRequestConfig;

      if (
        !config?.skipErrorTooltip &&
        (error.response?.status !== 401 || config?._retry)
      ) {
        setTimeout(() => {
          showErrorTooltip(error);
        }, 100);
      }

      return Promise.reject(error);
    }
  );
}

export function setupGlobalErrorHandling(): void {
  addErrorInterceptors(axios);

  addErrorInterceptors(axiosClient);
}

export function showAPIErrorTooltip(error: unknown): void {
  showErrorTooltip(error);
}
