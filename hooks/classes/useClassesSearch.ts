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
  from_date?: Date;
  to_date?: Date;
}

interface ClassResponse {
  classes: Array<{
    id: string;
    name: string;
    covers: Array<{ url: string }>;
    date?: string;
    duration: number;
    venue: { name: string };
    instructorInfo: string;
    categories: string[];
    scheduled: boolean;
    scheduledSpots: number;
    totalSpots: number;
  }>;
}

const serializeParams = (params: SearchParams) => {
  return {
    q: params.query || '',
    lat: params.locationLat,
    lng: params.locationLng,
    rad: params.radius,
    lim: params.limit || 50,
    off: params.offset || 0,
    fromDate: params.from_date?.toISOString() || '',
    toDate: params.to_date?.toISOString() || '',
    category: Array.isArray(params.category)
      ? [...params.category].sort().join(',')
      : params.category || [],
  };
};

const fetchClasses = async (params: SearchParams): Promise<ClassResponse> => {
  try {
    let categoryParam;
    
    if (params.category && Array.isArray(params.category) && params.category.length > 0) {
      const categoryString = params.category.join(',');
      
      categoryParam = params.category;
      
      console.log("Sending classes categories:", categoryParam);
    }
      
    const apiParams = {
      q: params.query || '',
      latitude: params.locationLat,
      longitude: params.locationLng,
      distance: params.radius,
      limit: params.limit || 50,
      offset: params.offset || 0,
      from_date: params.from_date?.toISOString(),
      to_date: params.to_date?.toISOString(),
      category: categoryParam,
    };

    const response = await axiosClient.get('/content/classes/discover/search', {
      params: apiParams,
      requiresAuth: false,
    });
    const responseData = response.data?.response || { classes: [] };

    return responseData;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return { classes: [] };
  }
};

export const useClassesSearch = (params: SearchParams, isFocused: boolean) => {
  const serializedParams = useMemo(() => serializeParams(params), [params]);

  const enabled = Boolean(
    isFocused &&
      params.locationLat !== undefined &&
      params.locationLng !== undefined &&
      params.from_date &&
      params.to_date
  );

  return useQuery({
    queryKey: [QueryKeys.classesSearchQueryKey, serializedParams],
    queryFn: () => fetchClasses(params),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
};
