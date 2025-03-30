import { axiosClient } from '@/api';
import { useMutation } from '@tanstack/react-query';

interface UseClassBookProps {
  venueId?: string | null;
  startDate?: string | null;
  classId?: string | null;
}

interface ClassDetailResponse {}

const createClassBook = async (params: UseClassBookProps) => {
  try {
    await axiosClient.post('/activity/schedules/me', params);
  } catch (error) {
    console.error('Error booking class:', error);
    throw error;
  }
};

export function useClassBook() {
  const mutation = useMutation<ClassDetailResponse, Error, UseClassBookProps>({
    mutationFn: (params) => {
      return createClassBook(params);
    },
    retry: 0,
  });

  return {
    classBookingData: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    bookMutationFn: mutation,
    isSuccess: mutation.isSuccess,
  };
}
