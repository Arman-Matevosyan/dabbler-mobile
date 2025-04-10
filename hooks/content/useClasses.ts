import { ClassQueryKeys } from '@/constants/QueryKeys';
import { ActivityAPI, ContentAPI } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ClassDetailResponse,
  IClassBookingResponse,
  IClassDetailResponse,
  IClassesListResponse,
  IDiscoverClassCheckinsResponse,
  IDiscoverClassDetailResponse,
  IDiscoverClassSchedulesResponse,
  IDiscoverClassSearchResponse,
  IDiscoverSchedulesResponse,
  IDiscoverVenueClassesResponse,
  IVenueClassesResponse,
} from './classes.interfaces';

export interface DiscoverClassSearchParams {
  q?: string;
  category?: string | string[];
  latitude?: number;
  longitude?: number;
  distance?: number;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export function useClassDetails(classId: string, params?: any) {
  return useQuery<IClassDetailResponse>({
    queryKey: [ClassQueryKeys.classDetails, classId, params],
    queryFn: () => ContentAPI.getClassDetails(classId, params),
    enabled: !!classId,
  });
}

export function useClassesSearch(params: any = {}) {
  return useQuery<IClassesListResponse>({
    queryKey: [ClassQueryKeys.classesSearch, params],
    queryFn: () => ContentAPI.searchClasses(params),
    enabled: Object.keys(params).length > 0,
  });
}

export function useVenueClasses(params: any = {}) {
  return useQuery<IVenueClassesResponse>({
    queryKey: [ClassQueryKeys.venueClasses, params],
    queryFn: () => ContentAPI.getVenueClasses(params),
    enabled: Object.keys(params).length > 0,
  });
}

export const useDiscoverClassSearch = (
  params: DiscoverClassSearchParams = {}
) => {
  return useQuery<IDiscoverClassSearchResponse>({
    queryKey: [ClassQueryKeys.discoverSearch, params],
    queryFn: () => ContentAPI.discoverClassSearch(params),
    enabled: Object.keys(params).length > 0,
  });
};

export const useDiscoverVenueClasses = (
  venueId: string,
  params?: Record<string, any>
) => {
  return useQuery<IDiscoverVenueClassesResponse>({
    queryKey: [ClassQueryKeys.discoverVenue, venueId, params],
    queryFn: () => ContentAPI.discoverVenueClasses(venueId, params),
    enabled: !!venueId,
  });
};

export const useDiscoverUserCheckins = () => {
  return useQuery<IDiscoverClassCheckinsResponse>({
    queryKey: [ClassQueryKeys.discoverCheckins],
    queryFn: () => ContentAPI.discoverUserCheckins(),
  });
};

export const useDiscoverUserSchedules = () => {
  return useQuery<IDiscoverClassSchedulesResponse>({
    queryKey: [ClassQueryKeys.discoverSchedules],
    queryFn: () => ContentAPI.discoverUserSchedules(),
  });
};

export const useDiscoverAllSchedules = (params?: Record<string, any>) => {
  return useQuery<IDiscoverSchedulesResponse>({
    queryKey: [ClassQueryKeys.discoverAllSchedules, params],
    queryFn: () => ContentAPI.discoverAllSchedules(params),
  });
};

export const useDiscoverClassDetails = (classId: string) => {
  return useQuery<IDiscoverClassDetailResponse>({
    queryKey: [ClassQueryKeys.discoverClassDetails, classId],
    queryFn: () => ContentAPI.discoverClassDetail(classId),
    enabled: !!classId,
  });
};

interface UseDetailedClassProps {
  id: string;
  date?: string;
}

const fetchClassDetails = async (
  params: UseDetailedClassProps
): Promise<ClassDetailResponse> => {
  try {
    const requestParams: Record<string, any> = {};

    if (params.date) {
      requestParams.date = params.date;
    }

    const response = await ContentAPI.getClassDetails(params.id, requestParams);

    const isClassFree = !response?.response?.startDate;
    const classData = {
      ...response?.response,
      isFree: isClassFree,
    };

    return classData;
  } catch (error) {
    console.error('Error fetching class details:', error);
    return {} as ClassDetailResponse;
  }
};

export function useDetailedClassDetails(params: UseDetailedClassProps) {
  const queryKey = [ClassQueryKeys.classDetails, params.id, params.date];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchClassDetails(params),
    enabled: Boolean(params.id),
  });

  return {
    classData: data,
    isLoading,
    error,
    refetch,
  };
}

interface UseClassBookProps {
  venueId?: string | null;
  startDate?: string | null;
  classId?: string | null;
}

export const useClassBook = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IClassBookingResponse, Error, UseClassBookProps>(
    {
      mutationKey: [ClassQueryKeys.classBooking],
      mutationFn: (params) => {
        try {
          const response = ActivityAPI.bookClass(params);
          return (
            response || {
              response: { bookingId: '', status: '' },
              metadata: {},
            }
          );
        } catch (error) {
          console.error('Error booking class:', error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [ClassQueryKeys.schedules],
        });
      },
      retry: 0,
    }
  );

  return {
    classBookingData: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    bookMutationFn: mutation,
    isSuccess: mutation.isSuccess,
  };
};

interface UseCancelBookingProps {
  classId: string;
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    IClassBookingResponse,
    Error,
    UseCancelBookingProps
  >({
    mutationKey: [ClassQueryKeys.cancelBooking],
    mutationFn: ({ classId }) => {
      try {
        const response = ActivityAPI.cancelBooking(classId);
        return (
          response || { response: { bookingId: '', status: '' }, metadata: {} }
        );
      } catch (error) {
        console.error('Error cancelling class booking:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [ClassQueryKeys.schedules],
      });
    },
    retry: 0,
  });

  return {
    cancelBookingMutation: mutation,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};
