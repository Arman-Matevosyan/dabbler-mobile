import { ClassQueryKeys } from '@/constants/QueryKeys';
import { IClassBookingResponse } from '@/hooks/content';
import { ActivityAPI } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface UseClassBookProps {
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

export interface UseCancelBookingProps {
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
