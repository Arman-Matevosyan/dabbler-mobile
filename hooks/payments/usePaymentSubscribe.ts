import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';

const subscribeToPlan = async (subData) => {
  try {
    const response = await axiosClient.post('/payment/subscriptions', subData);
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw new Error('Payment verification failed. Please try again.');
  }
};

function usePaymentSubsccribe(subData) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [QueryKeys.paymentCreateSubQueryKey, subData],
    queryFn: () => subscribeToPlan(subData),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!subData?.paymentMethodId && !!subData?.planId,
  });

  return {
    data,
    isLoading,
    error: null,
    isSuccess,
    retry: null,
    refetch: () => {},
  };
}

export default usePaymentSubsccribe;
