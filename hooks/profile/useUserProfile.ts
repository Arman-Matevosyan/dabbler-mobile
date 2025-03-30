import { QueryKeys } from '@/constants/QueryKeys';
import { User } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useUserProfile() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, fetchUser } = useAuthStore();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: [QueryKeys.userQueryKey],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const result = await fetchUser();
      if (!result) {
        throw new Error('Failed to fetch user profile');
      }
      
      return result;
    },
    initialData: user || undefined,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const refreshProfile = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.userQueryKey],
        refetchType: 'active',
      });
      return await refetch();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  }, [queryClient, refetch]);

  return {
    user: userData || user,
    isLoading,
    error,
    refetch: refreshProfile,
    isAuthenticated,
  };
}

export default useUserProfile;
