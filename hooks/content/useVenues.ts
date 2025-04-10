import { axiosClient } from '@/api';
import { VenueQueryKeys } from '@/constants/QueryKeys';
import { ContentAPI } from '@/services/api';
import { IFullVenue, IVenueResponse, IVenuesListResponse } from '@/types';
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

export function useVenueDetails(venueId: string, options = {}) {
  const queryKey = [VenueQueryKeys.venueDetails, venueId];

  const {
    data: venueDetails,
    isLoading,
    error,
    refetch,
  } = useQuery<IFullVenue>({
    queryKey,
    queryFn: () => fetchVenueDetails(venueId),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });

  const formattedAddress = useMemo(() => {
    if (!venueDetails || !venueDetails.address) return '';

    const { street, houseNumber, city, stateOrProvince, postalCode, country } =
      venueDetails.address;
    const parts = [];

    if (street) parts.push(street + (houseNumber ? ' ' + houseNumber : ''));
    if (city) parts.push(city);
    if (stateOrProvince) parts.push(stateOrProvince);
    if (postalCode) parts.push(postalCode);
    if (country) parts.push(country);

    return parts.join(', ');
  }, [venueDetails]);

  return {
    venueDetails,
    isLoading,
    error,
    refetch,
    formattedAddress,
  };
}

const fetchVenueDetails = async (venueId: string): Promise<IFullVenue> => {
  try {
    const response = await ContentAPI.getVenueDetails(venueId);
    return response.response || response;
  } catch (error) {
    console.error('Error fetching venue details:', error);
    throw error;
  }
};

export function useVenueSearch(params: SearchParams, isFocused: boolean) {
  const serializedParams = useMemo(
    () => ({
      q: params.query || '',
      lat: params.locationLat,
      lng: params.locationLng,
      rad: params.radius,
      lim: params.limit || 100,
      off: params.offset || 0,
      cat: Array.isArray(params.category)
        ? [...params.category].sort().join(',')
        : params.category || [],
    }),
    [params]
  );

  const hasLocationParams = Boolean(
    params.locationLat && params.locationLng && params.radius
  );

  return useQuery({
    queryKey: [VenueQueryKeys.venuesSearch, serializedParams],
    queryFn: () => fetchVenues(params),
    enabled: isFocused && hasLocationParams,
    retry: 0,
    select: (data: IVenueResponse) => {
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
          .filter(
            (c) =>
              c.count === 1 &&
              c.venue &&
              Array.isArray(c.venue.location.coordinates)
          )
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

const fetchVenues = async (params: SearchParams): Promise<IVenueResponse> => {
  try {
    let categoryParam;

    if (
      params.category &&
      Array.isArray(params.category) &&
      params.category.length > 0
    ) {
      const categoryString = params.category.join(',');
      categoryParam = categoryString;
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
          category: categoryParam,
        },
      }
    );

    return response.data?.response || { clusters: [], total: 0 };
  } catch (error) {
    console.error('Venue search error:', error);
    return { clusters: [], total: 0 };
  }
};

export function useVenuesBottomSheet(params: SearchParams, enabled: boolean) {
  const queryKey = useMemo(
    () => [
      VenueQueryKeys.venuesSearchBottomSheet,
      params.query || '',
      params.locationLat,
      params.locationLng,
      params.radius,
      params.limit,
      params.offset,
      params.category?.join(','),
    ],
    [params]
  );

  return useQuery<IVenuesListResponse>({
    queryKey,
    queryFn: () =>
      ContentAPI.searchVenues({
        q: params.query || '',
        latitude: params.locationLat,
        longitude: params.locationLng,
        distance: params.radius,
        limit: params.limit || 20,
        offset: params.offset || 0,
        category: params.category?.join(','),
      }),
    enabled: enabled && (!!params.locationLat || !!params.query),
    select: (data) => data,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVenuesMap(params: any = {}) {
  return useQuery({
    queryKey: [VenueQueryKeys.venuesByCoords, params],
    queryFn: () => ContentAPI.searchVenuesOnMap(params),
    enabled: Object.keys(params).length > 0,
  });
}

export function useFavoriteVenues() {
  return useQuery({
    queryKey: [VenueQueryKeys.favorites],
    queryFn: () => ContentAPI.getFavoriteVenues(),
  });
}
