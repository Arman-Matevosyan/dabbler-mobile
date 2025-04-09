import { PaymentQueryKeys, UserQueryKeys } from '@/constants/QueryKeys';
import { PaymentAPI } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IPaymentGatewayToken,
  IPaymentMethod,
  IPlan,
  ISubscription,
  ISubscriptionCreateRequest,
} from './payment.interfaces';

export const usePaymentMethods = () => {
  return useQuery<IPaymentMethod[]>({
    queryKey: [PaymentQueryKeys.paymentMethods],
    queryFn: () => PaymentAPI.getPaymentMethods(),
    retry: false,
  });
};

export const usePlans = () => {
  return useQuery<IPlan[]>({
    queryKey: [PaymentQueryKeys.plans],
    queryFn: () => PaymentAPI.getPlans(),
  });
};

export const useSubscriptions = () => {
  const subscriptionQuery = useQuery<ISubscription, Error>({
    queryKey: [PaymentQueryKeys.subscriptions],
    queryFn: () => PaymentAPI.getSubscriptions(),
    retry: false,
  });
  
  return subscriptionQuery;
};

export const useClientToken = () => {
  const { data, isLoading } = useQuery<IPaymentGatewayToken[]>({
    queryKey: [PaymentQueryKeys.gatewayToken],
    queryFn: () => {
      const response = PaymentAPI.getClientToken();
      if (!response) {
        throw new Error('No client token received');
      }
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error: null,
    data: data,
    refetch: () => {},
  };
};

export const usePaymentSubscribe = () => {
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
    mutationFn: (subData: ISubscriptionCreateRequest) => {
      try {
        return PaymentAPI.subscribe(subData);
      } catch (error) {
        console.error('Verification error:', error);
        throw new Error('Payment verification failed. Please try again.');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.createSubscription],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.subscriptions],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.plans],
      });
      await queryClient.invalidateQueries({
        queryKey: [PaymentQueryKeys.paymentMethods],
      });
      await queryClient.invalidateQueries({
        queryKey: [UserQueryKeys.userData],
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
};

export const useVerifyPayment = (nonceData: any) => {
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [PaymentQueryKeys.paymentSuccess, nonceData],
    queryFn: () => {
      try {
        return PaymentAPI.verifyPayment(nonceData);
      } catch (error) {
        console.error('Verification error:', error);
        throw new Error('Payment verification failed. Please try again.');
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!nonceData,
  });

  if (isSuccess) {
    queryClient.invalidateQueries({
      queryKey: [PaymentQueryKeys.paymentMethods],
    });
    queryClient.invalidateQueries({
      queryKey: [PaymentQueryKeys.subscriptions],
    });
  }

  return {
    isLoading,
    data,
    error: null,
    isSuccess,
    refetch: () => {},
  };
};
