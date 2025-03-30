import { Region } from 'react-native-maps';

export interface VenueAddress {
  addressLine2: string;
  city: string;
  country: string;
  district: string;
  houseNumber: string;
  landmark: string;
  postalCode: string;
  stateOrProvince: string;
  street: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: {
    coordinates: number[];
    type: string;
  };
  address: VenueAddress;
  covers: any[];
}

export interface Cluster {
  id: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
  venue: Venue | null;
}

export interface MapComponentProps {
  onRegionChange: (region: Region, radius: number) => void;
  venues: Venue[];
  clusters: Cluster[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  showUserLocation?: boolean;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
} 