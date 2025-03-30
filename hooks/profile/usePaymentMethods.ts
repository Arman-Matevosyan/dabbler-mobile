import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { PaymentMethod } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

interface CustomRequestConfig extends AxiosRequestConfig {
  skipErrorTooltip?: boolean;
}

const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const config: CustomRequestConfig = {
    skipErrorTooltip: true 
  };
  
  const response = await axiosClient.get('/payment/payment-methods/me',  config );
  return response?.data?.response;
};

export function usePaymentMethods() {
  const queryKey = [QueryKeys.paymentMethodsQueryKey];

  const {
    data: paymentMethods = [],
    isLoading,
    error,
    refetch,
  } = useQuery<PaymentMethod[]>({
    queryKey,
    queryFn: fetchPaymentMethods,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    paymentMethods,
    isLoading,
    error,
    refetch,
  };
}

export default usePaymentMethods;
