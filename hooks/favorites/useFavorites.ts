import { UserQueryKeys, VenueQueryKeys } from '@/constants/QueryKeys';
import { ActivityAPI } from '@/services/api';
import { IVenue } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UserData {
  userId: string;
  [key: string]: any;
}

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const userData =
    queryClient.getQueryData<UserData>([UserQueryKeys.userData]) || null;
  const userId = userData?.userId;

  const {
    data: favoriteVenues = [],
    isLoading,
    error,
    refetch,
  } = useQuery<IVenue[]>({
    queryKey: [VenueQueryKeys.favorites, userId],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1] as string;
      return ActivityAPI.getFavorites(id);
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
        queryClient.getQueryData<IVenue[]>([
          VenueQueryKeys.favorites,
          userId,
        ]) || [];

      const isFavorite = previousFavorites.some((fav) => fav.id === venueId);

      const optimisticVenue = {
        id: venueId,
        _optimistic: true,
        name: 'Loading...',
        description: '',
        address: {},
        location: { type: 'Point', coordinates: [] },
      } as unknown as IVenue;

      queryClient.setQueryData(
        [VenueQueryKeys.favorites, userId],
        isFavorite
          ? previousFavorites.filter((fav) => fav.id !== venueId)
          : [...previousFavorites, optimisticVenue]
      );

      try {
        if (isFavorite) {
          await ActivityAPI.removeFavorite(venueId);
        } else {
          await ActivityAPI.addFavorite(venueId);
        }

        await queryClient.invalidateQueries({
          queryKey: [VenueQueryKeys.favorites, userId],
        });
      } catch (error) {
        queryClient.setQueryData(
          [VenueQueryKeys.favorites, userId],
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
};
