import { axiosClient } from '@/api';
import { User } from '@/types/types';

/**
 * User API service
 */
export const UserAPI = {
  /**
   * Get the current user's profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosClient.get('/user/profile');
    return response.data;
  },
  
  /**
   * Verify the user's email
   */
  verifyEmail: async (): Promise<void> => {
    await axiosClient.post('/user/verify-email');
  },
  
  /**
   * Update the user's profile
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosClient.patch('/user/profile', data);
    return response.data;
  },
}; 