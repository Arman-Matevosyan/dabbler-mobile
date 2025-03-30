import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { PaymentMethod } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends AxiosRequestConfig {
  skipErrorTooltip?: boolean;
}

const fetchSchedules = async (): Promise<PaymentMethod[]> => {
  const config: CustomRequestConfig = {
    skipErrorTooltip: true,
  };

  const response = await axiosClient.get(
    '/content/classes/discover/me/schedules',
    config
  );
  return response?.data?.response;
};

export function useMyschedules() {
  const queryKey = [QueryKeys.schedulesDataQuerykey];

  const { data, isLoading, error, refetch } = useQuery<PaymentMethod[]>({
    queryKey,
    queryFn: fetchSchedules,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useMyschedules;
