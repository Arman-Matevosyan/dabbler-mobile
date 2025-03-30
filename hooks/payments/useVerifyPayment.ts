import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const verifyPayment = async (data) => {
  try {
    const response = await axiosClient.post(
      '/payment/payment-methods/me',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw new Error('Payment verification failed. Please try again.');
  }
};

function useVerifyPayment(nonceData) {
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [QueryKeys.paymentSuccessQueryKey, nonceData],
    queryFn: () => verifyPayment(nonceData),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!nonceData,
  });
  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.paymentMethodsQueryKey],
    });
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.subscriptionsQueryKey],
    });
  }
  return {
    isLoading,
    data,
    error: null,
    isSuccess,
    refetch: () => {},
  };
}

export default useVerifyPayment;
