export interface ICover {
  url: string;
  name?: string;
}

export interface IAddress {
  country?: string;
  stateOrProvince?: string;
  city?: string;
  district?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  addressLine2?: string;
  landmark?: string;
}

export interface ILocation {
  type: string;
  coordinates: string[];
}

export interface ICoordinates {
  type: string;
  coordinates: string[];
}

export interface IDirection {
  type: string;
  url: string;
}

export interface IPlan {
  name: string;
  description: string;
  limit: number;
}

export interface ICheckinInfo {
  checkinCount: number;
}

export interface IFullVenue {
  id: string;
  name: string;
  description?: string;
  isFavorite?: boolean;
  address: IAddress;
  covers: ICover[];
  location: ILocation;
  categories?: string[];
  contacts?: string[];
  websiteUrl?: string;
  importantInfo?: string;
  openingHours?: string[];
  directions?: IDirection[];
  userPlan?: IPlan;
  plans?: IPlan[];
  checkinInfo?: ICheckinInfo;
}

export interface IVenueResponse {
  response: IFullVenue;
  metadata: Record<string, any>;
}

export interface IVenuesListResponse {
  response: IFullVenue[];
  metadata: Record<string, any>;
}

export interface IVenueSearchParams {
  q?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  limit?: number;
  offset?: number;
  category?: string;
}

export interface MapSearchParams {
  query?: string;
  category?: string[];
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

export interface MapCluster {
  id?: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
  venue?: MapVenueWithCoordinates;
}

export interface MapVenueLocation {
  latitude: number;
  longitude: number;
}

export interface MapVenueWithCoordinates {
  id: string;
  name: string;
  location: {
    coordinates: number[];
    type: string;
  };
  covers: Array<{ url: string }>;
  categories?: Array<{ name: string }>;
}

export interface MapVenue {
  id: string;
  name: string;
  location: MapVenueLocation;
  covers: Array<{ url: string }>;
  categories?: Array<{ name: string }>;
}
