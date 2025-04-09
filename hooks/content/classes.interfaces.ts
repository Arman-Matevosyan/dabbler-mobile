import { ICoordinates } from './venues.interfaces';

export interface IClass {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  duration: number;
  instructor?: string;
  category?: string;
  venue?: IVenue;
  capacity?: number;
  attendees?: number;
  isBooked?: boolean;
}

export interface IVenue {
  id: string;
  name: string;
  description?: string;
  address?: IAddress;
  covers?: ICover[];
  websiteUrl?: string;
  openingHours?: string[];
}

export interface IAddress {
  country?: string;
  city?: string;
  street?: string;
  district?: string;
  postalCode?: string;
}

export interface ICover {
  url: string;
  name?: string;
}

export interface IClassDetailResponse {
  response: IClass;
  metadata: Record<string, any>;
}

export interface IClassesListResponse {
  response: {
    classes: IClass[];
  };
  metadata: Record<string, any>;
}

export interface IVenueClassesResponse {
  response: {
    freeClasses: IClass[];
    scheduledClasses: IClass[];
  };
  metadata: Record<string, any>;
}

export interface IClassBookingResponse {
  response: {
    bookingId: string;
    status: string;
  };
  metadata: Record<string, any>;
}

export interface IScheduleItem {
  id: string;
  classId: string;
  className: string;
  venueId: string;
  venueName: string;
  startDate: string;
  duration: number;
  status: string;
}

export interface ISchedulesResponse {
  response: IScheduleItem[];
  metadata: Record<string, any>;
}

export interface ICheckinItem {
  id: string;
  classId: string;
  className: string;
  venueId: string;
  venueName: string;
  checkInDate: string;
}

export interface ICheckinsResponse {
  response: ICheckinItem[];
  metadata: Record<string, any>;
}

// Common interfaces for discover endpoint responses
export interface IClassVenueInfo {
  name: string;
  id?: string;
}

export interface IDiscoverClass {
  id: string;
  name: string;
  covers: ICover[];
  categories: string[];
  instructorInfo: string;
  totalSpots: number;
  scheduledSpots: number;
  scheduled: boolean;
  date: string;
  duration: number;
  location: ICoordinates;
  venue: IClassVenueInfo;
}

export interface IDiscoverClassSearchResponse {
  response: IDiscoverClass[];
  metadata: Record<string, any>;
}

export interface IDiscoverVenueClassesResponse {
  response: {
    freeClasses: IDiscoverClass[];
    scheduledClasses: IDiscoverClass[];
  };
  metadata: Record<string, any>;
}

export interface IDiscoverClassCheckinsResponse {
  response: IDiscoverClass[];
  metadata: Record<string, any>;
}

export interface IDiscoverClassSchedulesResponse {
  response: IDiscoverClass[];
  metadata: Record<string, any>;
}

export interface IDiscoverSchedulesResponse {
  response: {
    freeClasses: IDiscoverClass[];
    scheduledClasses: IDiscoverClass[];
  };
  metadata: Record<string, any>;
}

export interface IVenueAddress {
  country: string;
  stateOrProvince: string;
  city: string;
  district: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  addressLine2: string;
  landmark: string;
}

export interface IVenueDetail {
  id: string;
  name: string;
  address: IVenueAddress;
  websiteUrl: string;
  openingHours: string[];
}

export interface IDiscoverClassDetailResponse {
  response: {
    id: string;
    name: string;
    description: string;
    date: string;
    covers: ICover[];
    instructorName: string;
    duration: number;
    importantInfo: string;
    cancellationPeriodInMinutes: number;
    totalSpots: number;
    scheduledSpots: number;
    location: ICoordinates;
    venue: IVenueDetail;
  };
  metadata: Record<string, any>;
}

export type ClassDetailResponse = {
  id: string;
  name: string;
  description?: string;
  date?: string | null;
  duration?: number;
  instructorName?: string;
  categories?: string[];
  venue?: {
    name: string;
    address?: any;
    id: string;
    openingHours?: any[];
    websiteUrl?: string;
  };
  scheduledSpots?: number;
  totalSpots?: number;
  covers?: any[];
  equipment?: string[];
  level?: string;
  location?: any;
  importantInfo?: string;
  isFree?: boolean;
};
