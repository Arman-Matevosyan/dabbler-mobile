import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { Venue } from '@/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const fetchFavorites = async (userId: string): Promise<Venue[]> => {
  try {
    const response = await axiosClient.get(
      '/content/venues/discover/favorites/me',
      {
        params: { userId, offset: 0, limit: 100 },
      }
    );

    return response.data.response;
  } catch (error) {
    throw error;
  }
};

export function useFavorites() {
  const queryClient = useQueryClient();

  const userData = queryClient.getQueryData([QueryKeys.userQueryKey]);
  const userId = userData?.userId;

  const {
    data: favoriteVenues = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Venue[]>({
    queryKey: [QueryKeys.favoritesQueryKey, userId],
    queryFn: ({ queryKey }) => {
      return fetchFavorites(queryKey[1]);
    },
    enabled: !!userId,
    staleTime: 0,
    gcTime: 15 * 60 * 1000,
  });

  const toggleFavorite = useCallback(
    async (venueId: string) => {
      if (!userId) {
        throw new Error('User must be logged in to modify favorites');
      }

      const previousFavorites =
        queryClient.getQueryData<Venue[]>([
          QueryKeys.favoritesQueryKey,
          userId,
        ]) || [];

      const isFavorite = previousFavorites.some((fav) => fav.id === venueId);

      queryClient.setQueryData(
        [QueryKeys.favoritesQueryKey, userId],
        isFavorite
          ? previousFavorites.filter((fav) => fav.id !== venueId)
          : [...previousFavorites, { id: venueId, _optimistic: true } as Venue]
      );

      try {
        isFavorite
          ? await axiosClient.delete('/activity/favorites/me', {
            params: { venueId },
            })
          : await axiosClient.post('/activity/favorites/me', { venueId });

        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.favoritesQueryKey, userId],
        });
      } catch (error) {
        console.error('Mutation error:', error);
        queryClient.setQueryData(
          [QueryKeys.favoritesQueryKey, userId],
          previousFavorites
        );
        throw error;
      }
    },
    [queryClient, userId]
  );

  return {
    favorites: favoriteVenues,
    isLoading,
    error,
    toggleFavorite,
    refetch,
    isFavorite: useCallback(
      (venueId: string) => favoriteVenues.some((fav) => fav.id === venueId),
      [favoriteVenues]
    ),
  };
}

export default useFavorites;
