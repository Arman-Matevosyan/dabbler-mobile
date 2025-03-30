import { axiosClient } from '@/api';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication API service
 */
export const AuthAPI = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  /**
   * Register a new user
   */
  signup: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },
  
  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post('/users/me/forget-password', { email });
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },
  
  /**
   * Refresh the access token using a refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  /**
   * Get Google login URL
   */
  googleLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/google/login`;
  },
  
  /**
   * Get Facebook login URL
   */
  facebookLogin: (): string => {
    return `${axiosClient.defaults.baseURL}/auth/facebook/login`;
  },
}; 