import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';

export type Subscription = {
  id: string;
  subscriptionId: string;
  userId: string;
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};
const fetchCheckIn = async (): Promise<Subscription[]> => {
  const response = await axiosClient.get('/content/classes/discover/me/checkins', {
    params: {
        offset: 0,
        limit: 50
    }
  });
  if (!response.data) {
    throw new Error('No subscription data received');
  }
  return response?.data?.response;
};

export function useCheckin() {
  const {
    data: checkIn = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryKeys.checkinQueryKey],
    queryFn: fetchCheckIn,
    retry: false,
  });

  return {
    checkIn,
    isLoading,
    error,
  };
}

export default useCheckin;
