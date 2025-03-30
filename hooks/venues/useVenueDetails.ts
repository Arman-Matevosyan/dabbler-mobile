import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { Venue } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const fetchVenueDetails = async (venueId: string): Promise<Venue> => {
  try {
    const response = await axiosClient.get(
      `/content/venues/discover/${venueId}`,
      { requiresAuth: false }
    );
    return response.data.response || response.data;
  } catch (error) {
  }
};

export function useVenueDetails(venueId: string, options = {}) {
  const enabled = !!venueId;
  const queryKey = [QueryKeys.venuesDetailsDataQueryKey, venueId];

  const {
    data: venueDetails = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Venue>({
    queryKey,
    queryFn: () => fetchVenueDetails(venueId),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });

  const formattedAddress = useMemo(() => {
    if (!venueDetails?.address) return '';

    const { street, houseNumber, city, stateOrProvince, postalCode, country } =
      venueDetails.address;
    const parts = [];

    if (street) parts.push(street + (houseNumber ? ' ' + houseNumber : ''));
    if (city) parts.push(city);
    if (stateOrProvince) parts.push(stateOrProvince);
    if (postalCode) parts.push(postalCode);
    if (country) parts.push(country);

    return parts.join(', ');
  }, [venueDetails?.address]);

  return {
    venueDetails,
    isLoading,
    error,
    refetch,
    formattedAddress,
  };
}

export default useVenueDetails;
