import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';
import { formatISO } from 'date-fns';

export interface VenueClassesParams {
  venueId: string;
  fromDate: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

export interface ClassInstructor {
  id: string;
  name: string;
}

export interface VenueClass {
  id: string;
  name: string;
  description?: string;
  date: string;
  duration: number;
  venue: {
    id: string;
    name: string;
  };
  instructor: ClassInstructor;
  instructorInfo?: string;
  categories: string[];
  totalSpots: number;
  scheduledSpots: number;
  covers?: Array<{ url?: string; uri?: string }>;
}

export interface VenueClassesResponse {
  freeClasses: VenueClass[];
  scheduledClasses: VenueClass[];
  venue?: {
    id: string;
    name: string;
  };
}

const fetchVenueClasses = async (
  params: VenueClassesParams
): Promise<VenueClassesResponse> => {
  try {
    const toDate =
      params.toDate ||
      new Date(params.fromDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const requestParams = {
      venue_id: params.venueId,
      from_date: formatISO(params.fromDate),
      to_date: formatISO(toDate),
      limit: params.limit || 50,
      offset: params.offset || 0,
    };

    const response = await axiosClient.get('/content/classes/discover/venue', {
      params: requestParams,
      requiresAuth: false,
    });

    return (
      response?.data?.response || { freeClasses: [], scheduledClasses: [] }
    );
  } catch (error) {
    console.error('Error fetching venue classes:', error);
    return { freeClasses: [], scheduledClasses: [] };
  }
};

export const useVenueClasses = (params: VenueClassesParams, enabled = true) => {
  const queryKey = [
    QueryKeys.venueClassesQueryKey,
    params.venueId,
    formatISO(params.fromDate),
    params.toDate ? formatISO(params.toDate) : null,
    params.limit,
    params.offset,
  ];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchVenueClasses(params),
    enabled: enabled && Boolean(params.venueId && params.fromDate),
  });

  return {
    freeClasses: data?.freeClasses || [],
    scheduledClasses: data?.scheduledClasses,
    isLoading,
    error,
    refetch,
  };
};
