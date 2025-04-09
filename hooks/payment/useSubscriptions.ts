import { PaymentQueryKeys } from '@/constants/QueryKeys';
import { PaymentAPI } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { ISubscription } from './payment.interfaces';

export const useSubscriptions = () => {
  return useQuery<ISubscription[]>({
    queryKey: [PaymentQueryKeys.subscriptions],
    queryFn: () => PaymentAPI.getSubscriptions(),
    retry: false,
  });
};
