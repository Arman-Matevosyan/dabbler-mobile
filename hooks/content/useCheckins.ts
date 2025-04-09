import { UserQueryKeys } from '@/constants/QueryKeys';
import { ContentAPI } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { ICheckinItem } from './classes.interfaces';

export const useUserCheckins = () => {
  const {
    data: checkins = [],
    isLoading,
    error,
  } = useQuery<ICheckinItem[]>({
    queryKey: [UserQueryKeys.checkins],
    queryFn: async () => {
      const response = await ContentAPI.getUserCheckins();
      if (!response) {
        throw new Error('No check-in data received');
      }
      return response.response;
    },
    retry: false,
  });

  return {
    checkins,
    isLoading,
    error,
  };
};
