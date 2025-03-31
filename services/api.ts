import axiosClient from '@/api/axiosClient';
import { getBaseURL } from '@/constants/constants';
import { User } from '@/types/types';
import { AxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig interface for our custom properties
interface CustomAxiosConfig extends AxiosRequestConfig {
  skipErrorTooltip?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

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

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    // Use a direct axios call to avoid the interceptors
    const config: CustomAxiosConfig = {
      headers: { 'Content-Type': 'application/json' },
      skipErrorTooltip: true
    };
    
    const response = await axiosClient.post('/auth/refresh', { refreshToken }, config);
    return response.data;
  },

  facebookLogin: () => `${getBaseURL()}/auth/fb`,
  googleLogin: () => `${getBaseURL()}/auth/google`,
};

export const UserAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  verifyEmail: async (): Promise<void> => {
    await axiosClient.post('/users/me/verify-email');
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosClient.patch('/users/me', data);
    return response.data;
  },
};
