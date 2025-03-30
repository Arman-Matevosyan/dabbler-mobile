import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';

export type ClassDetailResponse = {
  id: string;
  name: string;
  description?: string;
  date?: string | null;
  duration?: number;
  instructorName?: string;
  categories?: string[];
  venue?: {
    name: string;
    address?: any;
    id: string;
    openingHours?: any[];
    websiteUrl?: string;
  };
  scheduledSpots?: number;
  totalSpots?: number;
  covers?: any[];
  equipment?: string[];
  level?: string;
  location?: any;
  importantInfo?: string;
  isFree?: boolean;
};

interface UseClassDetailsProps {
  id: string;
  date?: string;
}

const fetchClassDetails = async (params: UseClassDetailsProps): Promise<ClassDetailResponse> => {
  try {
    const requestParams: Record<string, any> = {};
    
    if (params.date) {
      requestParams.date = params.date;
    }
    const response = await axiosClient.get(`/content/classes/discover/${params.id}`, {
      params: requestParams,
      requiresAuth: false,
    });
    
    const isClassFree = response?.data?.date === null;
    const classData = {
      ...response?.data?.response,
      isFree: isClassFree
    };
    
    return classData;
  } catch (error) {
    console.error('Error fetching class details:', error);
    return {} as ClassDetailResponse;
  }
};

export function useClassDetails(params: UseClassDetailsProps) {
  const queryKey = [
    QueryKeys.classDetailsQueryKey, 
    params.id,
    params.date
  ];

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: () => fetchClassDetails(params),
    enabled: Boolean(params.id),
  });

  return { 
    classData: data,
    isLoading, 
    error, 
    refetch 
  };
} 