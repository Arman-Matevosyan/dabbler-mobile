import { axiosClient } from '@/api';
import { IUserProfile } from '@/types/user';

export const UserAPI = {
  getCurrentUser: async (): Promise<IUserProfile | null> => {
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

      return {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        image: userData.image || userData.avatarUrl,
        isVerified: userData.isVerified,
      };
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

  updateProfile: async (profileData: Partial<IUserProfile>): Promise<IUserProfile> => {
    try {
      const response = await axiosClient.patch('/users/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
};
