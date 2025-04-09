export interface IActivityItem {
  type: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface IActivityResponse {
  response: IActivityItem[];
  metadata: Record<string, any>;
}

export interface IFavoriteRequest {
  venueId: string;
}

export interface IFavoriteResponse {
  venueId: string;
  status: string;
}

export interface IActivityBookingRequest {
  venueId?: string | null;
  startDate?: string | null;
  classId?: string | null;
}

export interface IActivityBookingResponse {
  bookingId: string;
  status: string;
}
