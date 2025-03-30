import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { Subscription } from '@/types/subscription';
import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends AxiosRequestConfig {
  skipErrorTooltip?: boolean;
}

const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const config: CustomRequestConfig = {
    skipErrorTooltip: true,
  };

  const response = await axiosClient.get('/payment/subscriptions/me', config);
  if (!response.data) {
    throw new Error('No subscription data received');
  }
  return response?.data;
};

export function useSubscriptions() {
  const {
    data: subscription = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryKeys.subscriptionsQueryKey],
    queryFn: fetchSubscriptions,
    retry: false,
  });

  return {
    subscription,
    isLoading,
    error,
  };
}

export default useSubscriptions;
