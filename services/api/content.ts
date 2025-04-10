import { axiosClient } from '@/api';
import {
  ICategoriesResponse,
  ICheckinsResponse,
  IClassDetailResponse,
  IClassesListResponse,
  IDiscoverClassCheckinsResponse,
  IDiscoverClassDetailResponse,
  IDiscoverClassSchedulesResponse,
  IDiscoverClassSearchResponse,
  IDiscoverSchedulesResponse,
  IDiscoverVenueClassesResponse,
  ISchedulesResponse,
  IVenueClassesResponse,
  IVenueResponse,
  IVenuesListResponse,
} from '@/hooks/content';

export const ContentAPI = {
  getVenueDetails: async (venueId: string): Promise<IVenueResponse> => {
    const response = await axiosClient.get(
      `/content/venues/discover/${venueId}`
    );
    return response.data;
  },

  searchVenues: async (params: any): Promise<IVenuesListResponse> => {
    const response = await axiosClient.get('/content/venues/discover/search', {
      params,
    });
    return response.data?.response;
  },

  searchVenuesOnMap: async (params: any): Promise<IVenuesListResponse> => {
    const response = await axiosClient.get(
      '/content/venues/discover/map/search',
      { params }
    );
    return response.data;
  },

  getFavoriteVenues: async (): Promise<IVenuesListResponse> => {
    const response = await axiosClient.get(
      '/content/venues/discover/favorites/me'
    );
    return response.data;
  },

  // Class related endpoints
  searchClasses: async (params: any): Promise<IClassesListResponse> => {
    const response = await axiosClient.get('/content/classes/discover/search', {
      params,
    });
    return response.data;
  },

  getClassDetails: async (
    classId: string,
    params?: any
  ): Promise<IClassDetailResponse> => {
    const response = await axiosClient.get(
      `/content/classes/discover/${classId}`,
      {
        params,
      }
    );
    return response.data;
  },

  getVenueClasses: async (params: any): Promise<IVenueClassesResponse> => {
    const response = await axiosClient.get('/content/classes/discover/venue', {
      params,
    });
    return response.data;
  },

  getUserSchedules: async (): Promise<ISchedulesResponse> => {
    const response = await axiosClient.get(
      '/content/classes/discover/me/schedules'
    );
    return response.data;
  },

  getUserCheckins: async (): Promise<ICheckinsResponse> => {
    const response = await axiosClient.get(
      '/content/classes/discover/me/checkins'
    );
    return response.data;
  },

  discoverClassSearch: async (
    params: any
  ): Promise<IDiscoverClassSearchResponse> => {
    const response = await axiosClient.get('/content/classes/discover/search', {
      params,
    });
    return response.data;
  },

  discoverVenueClasses: async (
    venueId: string,
    params?: any
  ): Promise<IDiscoverVenueClassesResponse> => {
    const response = await axiosClient.get(`/content/classes/discover/venue`, {
      params: { venue_id: venueId, ...params },
    });
    return response.data;
  },

  discoverUserCheckins: async (): Promise<IDiscoverClassCheckinsResponse> => {
    const response = await axiosClient.get(
      '/content/classes/discover/me/checkins'
    );
    return response.data;
  },

  discoverUserSchedules: async (): Promise<IDiscoverClassSchedulesResponse> => {
    const response = await axiosClient.get(
      '/content/classes/discover/me/schedules'
    );
    return response.data;
  },

  discoverAllSchedules: async (
    params?: any
  ): Promise<IDiscoverSchedulesResponse> => {
    const response = await axiosClient.get(
      '/content/classes/discover/schedules',
      {
        params,
      }
    );
    return response.data;
  },

  discoverClassDetail: async (
    classId: string
  ): Promise<IDiscoverClassDetailResponse> => {
    const response = await axiosClient.get(
      `/content/classes/discover/${classId}`
    );
    return response.data;
  },

  // Category related endpoints
  getCategories: async (params?: any): Promise<ICategoriesResponse> => {
    const response = await axiosClient.get('/content/categories', { params });
    return response.data;
  },
};
