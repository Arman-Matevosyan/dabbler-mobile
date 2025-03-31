import { axiosClient } from '@/api';
import { useMutation } from '@tanstack/react-query';

const fetchCheckIn = async (url: string) => {
  try {
    const response = await axiosClient.get(url);
    return response?.data?.response;
  } catch (error) {
    throw error;
  }
};

export function useCheckIn() {
  const mutation = useMutation<any, Error, string>({
    mutationFn: (url: string) => {
      return fetchCheckIn(url);
    },
    retry: 0,
  });

  return {
    checkInData: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
    checkInMutation: mutation,
    isSuccess: mutation.isSuccess,
  };
}
