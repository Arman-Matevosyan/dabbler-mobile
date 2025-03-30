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

interface VenueResponse {
  venues: Array<{
    id: string;
    name: string;
    covers: Array<{ url: string }>;
    categories?: Array<{ name: string }>;
    address?: { city?: string; district?: string };
  }>;
}

const fetchVenues = async (params: SearchParams): Promise<VenueResponse> => {
  const response = await axiosClient.get('/content/venues/discover/search', {
    params: {
      q: params.query || '',
      latitude: params.locationLat,
      longitude: params.locationLng,
      distance: params.radius,
      limit: params.limit || 20,
      offset: params.offset || 0,
      category: params.category?.join(','),
    },
    requiresAuth: false,
  });
  return response.data?.response || { venues: [] };
};

export const useVenuesBottomSheet = (
  params: SearchParams,
  enabled: boolean
) => {
  const queryKey = useMemo(
    () => [
      QueryKeys.venuesSearchBottomSheetQueryKey,
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

  return useQuery({
    queryKey,
    queryFn: () => fetchVenues(params),
    enabled: enabled && (!!params.locationLat || !!params.query),
    select: (data) => data,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};
