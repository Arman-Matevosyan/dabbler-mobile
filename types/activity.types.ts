import type {
  IActivityBookingRequest,
  IActivityBookingResponse,
  IActivityItem,
  IActivityResponse,
  IFavoriteRequest,
  IFavoriteResponse,
} from '../hooks/activity/activity.interfaces';

export interface IFavoriteVenue {
  id: string;
  name: string;
  description?: string;
  address?: {
    city?: string;
    country?: string;
  };
  covers?: Array<{ url: string }>;
}

export interface IUserFavorites {
  venues: IFavoriteVenue[];
}

export interface IClassBookingRequest {
  venueId: string;
  startDate: string;
  classId: string;
}

export interface ICancelBookingRequest {
  bookingId: string;
}

export type {
  IActivityBookingRequest,
  IActivityBookingResponse,
  IActivityItem,
  IActivityResponse,
  IFavoriteRequest,
  IFavoriteResponse
};

