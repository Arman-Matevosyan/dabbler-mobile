import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useQuery } from '@tanstack/react-query';

export interface Category {
  id: string;
  name: string;
}

export const useCategories = (offset = 0, limit = 50) => {
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QueryKeys.categoriesQueryKey, offset, limit],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/content/categories', {
          params: { offset, limit },
          requiresAuth: false,
        });
        return response.data.response || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};

export default useCategories;
