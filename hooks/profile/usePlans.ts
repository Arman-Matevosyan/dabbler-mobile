import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { Plan } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

const fetchPlans = async (): Promise<Plan[]> => {
  const response = await axiosClient.get('/payment/plans');
  return response?.data?.response;
};

export function usePlans() {
  const queryKey = [QueryKeys.plansQueryKey];
  const {
    data: plans = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Plan[]>({
    queryKey,
    queryFn: fetchPlans,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    plans: plans || [],
    isLoading,
    error,
    refetch,
  };
}

export default usePlans;
