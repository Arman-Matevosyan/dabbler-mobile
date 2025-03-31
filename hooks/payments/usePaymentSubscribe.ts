import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const subscribeToPlan = async (subData) => {
  try {
    const response = await axiosClient.post('/payment/subscriptions', subData);
    return response.data;
  } catch (error) {
    console.error('Verification error:', error);
    throw new Error('Payment verification failed. Please try again.');
  }
};

function usePaymentSubscribe() {
  const queryClient = useQueryClient();

  const {
    mutate,
    data,
    isPending,
    isSuccess,
    error,
    reset,
    mutateAsync,
    status,
  } = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.paymentCreateSubQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.subscriptionsQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.plansQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.paymentMethodsQueryKey],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.userQueryKey],
      });
    },
  });

  return {
    mutate,
    mutateAsync,
    data,
    isPending,
    isSuccess,
    error,
    reset,
    status,
  };
}

export default usePaymentSubscribe;
