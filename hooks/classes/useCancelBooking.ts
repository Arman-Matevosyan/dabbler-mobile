import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

interface UseCancelBookingProps {
  classId: string;
}

const cancelClassBooking = async ({ classId }: UseCancelBookingProps) => {
  try {
    const response = await axiosClient.delete('/activity/schedules/me', {
      params: { class_id: classId },
    });
    return response?.data?.response;
  } catch (error) {
    console.error('Error cancelling class booking:', error);
    throw error;
  }
};

export function useCancelBooking() {
  const mutation = useMutation({
    mutationFn: (params: UseCancelBookingProps) => {
      return cancelClassBooking(params);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.schedulesDataQuerykey],
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
} 