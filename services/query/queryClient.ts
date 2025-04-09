import {
  AuthQueryKeys,
  ClassQueryKeys,
  PaymentQueryKeys,
  UserQueryKeys,
  VenueQueryKeys,
} from '@/constants/QueryKeys';
import { showErrorTooltip } from '@/hooks/tooltip';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

const queryCache = new QueryCache({
  onError: (error: any) => {
    if (error?.response?.status !== 401) {
      showErrorTooltip(error);
    }
  },
});

const mutationCache = new MutationCache({
  onError: (error: any) => {
    if (error?.response?.status !== 401) {
      showErrorTooltip(error);
    }
  },
});

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error: any) => {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 404
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});

export const invalidateAuthDependentQueries = () => {
  queryClient.invalidateQueries({ queryKey: [UserQueryKeys.userData] });
  queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.SESSION] });
  queryClient.invalidateQueries({ queryKey: [AuthQueryKeys.USER_AVATAR] });
  queryClient.invalidateQueries({ queryKey: [VenueQueryKeys.favorites] });
  queryClient.invalidateQueries({
    queryKey: [ClassQueryKeys.schedules],
  });
  queryClient.invalidateQueries({
    queryKey: [PaymentQueryKeys.paymentMethods],
  });
  queryClient.invalidateQueries({
    queryKey: [PaymentQueryKeys.subscriptions],
  });
};
