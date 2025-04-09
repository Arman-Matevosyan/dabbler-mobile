import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

export function useStoreSelector<T, U>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => U,
  equalityFn?: (a: U, b: U) => boolean
): U {
  if (equalityFn) {
    return store((state) => selector(state));
  }
  return store(selector);
}

export function useStoreWithQueryCache() {
  const queryClient = useQueryClient();

  const updateQueryCacheAfterMutation = useCallback(
    <T>(queryKey: unknown[], updater: (old: T | undefined) => T) => {
      queryClient.setQueryData<T>(queryKey, (oldData) => {
        return updater(oldData);
      });
    },
    [queryClient]
  );

  const invalidateQueriesAfterMutation = useCallback(
    (queryKey: unknown[]) => {
      return queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  return {
    updateQueryCacheAfterMutation,
    invalidateQueriesAfterMutation,
  };
}

export default { useStoreSelector, useStoreWithQueryCache };
