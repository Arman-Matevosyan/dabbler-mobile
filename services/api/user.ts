import { axiosClient } from '@/api';

// Create a User interface if not already in @/types
interface IUser {
  userId: string;
  [key: string]: any;
}

export const UserAPI = {
  getCurrentUser: async (): Promise<IUser | null> => {
    try {
      const response = await axiosClient.get('/users/me');

      if (!response.data) {
        console.error('Empty API response');
        return null;
      }

      const userData = response.data.response || response.data;

      if (!userData || !userData.userId) {
        console.error('Invalid user data format', userData);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  verifyEmail: async (): Promise<void> => {
    await axiosClient.post('/user/verify-email');
  },

  uploadAvatar: async (formData: FormData): Promise<any> => {
    try {
      const response = await axiosClient.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};
