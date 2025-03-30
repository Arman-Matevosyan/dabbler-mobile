import axiosClient from '@/api/axiosClient';
import { getBaseURL } from '@/constants/constants';
import { User } from '@/types/types';

export const AuthAPI = {
  login: async (email: string, password: string) => {
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
  ) => {
    const response = await axiosClient.post('/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axiosClient.get('/auth/refresh', {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
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

  verifyEmail: async () => {
    const response = await axiosClient.post('/users/me/verify-email');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await axiosClient.patch('/users/me', data);
    return response.data;
  },
};
