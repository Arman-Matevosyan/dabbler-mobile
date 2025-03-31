import { QueryKeys } from '@/constants/QueryKeys';
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
  queryClient.invalidateQueries({ queryKey: [QueryKeys.userQueryKey] });
  queryClient.invalidateQueries({ queryKey: [QueryKeys.favoritesQueryKey] });
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.schedulesDataQuerykey],
  });
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.paymentMethodsQueryKey],
  });
  queryClient.invalidateQueries({
    queryKey: [QueryKeys.subscriptionsQueryKey],
  });
};
