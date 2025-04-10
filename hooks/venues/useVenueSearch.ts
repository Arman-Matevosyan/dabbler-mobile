import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface SearchParams {
  query?: string;
  category?: string[];
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

export interface Cluster {
  id?: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
  venue?: VenueWithCoordinates;
}

interface VenueLocation {
  latitude: number;
  longitude: number;
}

interface VenueWithCoordinates {
  id: string;
  name: string;
  location: {
    coordinates: number[];
    type: string;
  };
  covers: Array<{ url: string }>;
  categories?: Array<{ name: string }>;
}

export interface Venue {
  id: string;
  name: string;
  location: VenueLocation;
  covers: Array<{ url: string }>;
  categories?: Array<{ name: string }>;
}

interface VenueResponse {
  clusters: Cluster[];
  total: number;
}

// Serialize params to create a stable query key
const serializeParams = (params: SearchParams) => {
  return {
    q: params.query || '',
    lat: params.locationLat,
    lng: params.locationLng,
    rad: params.radius,
    lim: params.limit || 100,
    off: params.offset || 0,
    cat: Array.isArray(params.category) 
      ? [...params.category].sort().join(',') 
      : params.category || [],
  };
};

const fetchVenues = async (params: SearchParams): Promise<VenueResponse> => {
  try {
    // Prepare categories parameter in the correct format for the API
    // Different APIs may expect categories in different formats
    let categoryParam;
    
    if (params.category && Array.isArray(params.category) && params.category.length > 0) {
      // Some APIs expect a comma-separated string
      const categoryString = params.category.join(',');
      
      // Choose the format that works with your API:
      // 1. As an array of strings - most RESTful APIs
      categoryParam = params.category;
      
      // 2. As a comma-separated string - some older APIs
      // categoryParam = categoryString;
      
      console.log("Sending categories:", categoryParam);
    }
      
    const response = await axiosClient.get(
      '/content/venues/discover/map/search',
      {
        params: {
          q: params.query || '',
          latitude: params.locationLat,
          longitude: params.locationLng,
          distance: params.radius,
          limit: params.limit || 100,
          offset: params.offset || 0,
          category: categoryParam, // Send category in the determined format
        },
      }
    );

    return response.data?.response || { clusters: [], total: 0 };
  } catch (error) {
    console.error('Venue search error:', error);
    return { clusters: [], total: 0 };
  }
};

export const useVenueSearch = (params: SearchParams, isFocused: boolean) => {
  // Create a stable serialized query key
  const serializedParams = useMemo(() => serializeParams(params), [params]);
  
  // Only enable query when tab is focused and we have location parameters
  const hasLocationParams = Boolean(
    params.locationLat && params.locationLng && params.radius
  );

  return useQuery({
    queryKey: [QueryKeys.venuesSearchQueryKey, serializedParams],
    queryFn: () => fetchVenues(params),
    enabled: isFocused && hasLocationParams, // Only run when focused and we have location params
    retry: 0,
    select: (data: VenueResponse) => {
      const clusters = data.clusters || [];
      return {
        clusters: clusters
          .filter(
            (c) => c.count > 1 && c.center?.latitude && c.center?.longitude
          )
          .map((c) => ({
            ...c,
            id: c.id || `cluster-${c.center.latitude}-${c.center.longitude}`,
          })),
        venues: clusters
          .filter((c) => c.count === 1 && c.venue && Array.isArray(c.venue.location.coordinates))
          .map((c) => ({
            ...c.venue!,
            location: {
              latitude: c.venue!.location.coordinates[1],
              longitude: c.venue!.location.coordinates[0],
            },
          })),
        total: data.total || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    placeholderData: (previousData) => previousData, // Keep showing previous data while fetching new data
  });
};
