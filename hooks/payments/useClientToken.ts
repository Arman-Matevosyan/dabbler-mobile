import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';

interface ClientTokenResponse {
  token: string;
  merchantId: string;
}

const fetchClientToken = async (): Promise<ClientTokenResponse> => {
  const response = await axiosClient.get('/payment/gateway/token');

  if (!response.data) {
    throw new Error('No subscription data received');
  }
  return response?.data;
};

export function useClientToken() {
  const { data, isLoading } = useQuery<ClientTokenResponse>({
    queryKey: [QueryKeys.paymentGatewayTokenQueryKey],
    queryFn: fetchClientToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error: null,
    data: data,
    refetch: () => {},
  };
}

export default useClientToken;
