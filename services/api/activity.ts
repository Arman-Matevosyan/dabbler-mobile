import { axiosClient } from '@/api';
import { IClassBookingResponse, IVenuesListResponse } from '@/hooks/content';

export const ActivityAPI = {
  // Favorites management
  getFavorites: async (
    userId: string
  ): Promise<IVenuesListResponse['response']> => {
    const response = await axiosClient.get(
      '/content/venues/discover/favorites/me',
      {
        params: { userId, offset: 0, limit: 100 },
      }
    );
    return response.data.response;
  },

  addFavorite: async (venueId: string): Promise<any> => {
    const response = await axiosClient.post('/activity/favorites/me', {
      venueId,
    });
    return response.data.response;
  },

  removeFavorite: async (venueId: string): Promise<any> => {
    const response = await axiosClient.delete('/activity/favorites/me', {
      params: { venueId },
    });
    return response.data.response;
  },

  // Class bookings
  bookClass: async (params: any): Promise<IClassBookingResponse> => {
    const response = await axiosClient.post('/activity/schedules/me', params);
    return response.data;
  },

  cancelBooking: async (classId: string): Promise<IClassBookingResponse> => {
    const response = await axiosClient.delete('/activity/schedules/me', {
      params: { class_id: classId },
    });
    return response.data;
  },
};
