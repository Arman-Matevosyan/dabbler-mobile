import { SearchWithCategories } from '@/components/shared';
import MapComponent from '@/components/venues/MapComponent';
import { Cluster, Venue } from '@/components/venues/types';
import { VenueBottomSheet } from '@/components/venues/VenueBottomSheet';
import useFetchUserLocation from '@/hooks/useFetchUserLocation';
import { useVenueSearch } from '@/hooks/venues/useVenueSearch';
import {
  useLocationParams,
  useSearchStore,
  useVenueSearchFilters,
} from '@/store/useSearchStore';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Region } from 'react-native-maps';
import { useShallow } from 'zustand/react/shallow';

export default function VenueTabScreen() {
  const { t } = useTranslation();
  const { userLocation, fetchUserLocation } = useFetchUserLocation();
  const isFocused = useIsFocused();
  const lastUpdate = useRef<number>(0);
  const regionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [pendingRegion, setPendingRegion] = useState<{
    region: Region;
    radius: number;
  } | null>(null);

  const venueParams = useSearchStore(useShallow((state) => state.venueParams));

  const { locationLat, locationLng, radius, updateLocation } =
    useLocationParams();

  const { query, category, setQuery, setCategory } = useVenueSearchFilters();

  const searchParams = useMemo(
    () => ({
      locationLat,
      locationLng,
      radius,
      limit: venueParams.limit,
      offset: venueParams.offset,
      query,
      category,
    }),
    [
      locationLat,
      locationLng,
      radius,
      venueParams.limit,
      venueParams.offset,
      query,
      category,
    ]
  );

  const { data, isLoading } = useVenueSearch(searchParams, isFocused);

  useEffect(() => {
    return () => {
      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && pendingRegion && Date.now() - lastUpdate.current > 1000) {
      updateLocation({
        locationLat: pendingRegion.region.latitude,
        locationLng: pendingRegion.region.longitude,
        radius: Math.round(pendingRegion.radius),
      });
      lastUpdate.current = Date.now();
      setPendingRegion(null);
    }
  }, [isLoading, pendingRegion, updateLocation]);

  const {
    venues = [],
    clusters = [],
    totalVenues = 0,
  } = useMemo(() => {
    if (!data) return { venues: [], clusters: [], totalVenues: 0 };

    const mappedVenues: Venue[] = (data.venues || []).map((apiVenue) => ({
      id: apiVenue.id,
      name: apiVenue.name,
      description: '',
      location: {
        coordinates: [apiVenue.location.longitude, apiVenue.location.latitude],
        type: 'Point',
      },
      address: {
        addressLine2: '',
        city: '',
        country: '',
        district: '',
        houseNumber: '',
        landmark: '',
        postalCode: '',
        stateOrProvince: '',
        street: '',
      },
      covers: apiVenue.covers || [],
    }));

    const mappedClusters: Cluster[] = (data.clusters || []).map(
      (apiCluster) => ({
        id: apiCluster.id,
        count: apiCluster.count,
        center: apiCluster.center,
        venue: null,
      })
    );

    return {
      venues: mappedVenues,
      clusters: mappedClusters,
      totalVenues: data.total || 0,
    };
  }, [data]);

  useEffect(() => {
    if (isFocused) {
      fetchUserLocation();
    }
  }, [fetchUserLocation, isFocused]);

  const handleRegionChange = useCallback(
    (region: Region, radius: number) => {
      setPendingRegion({ region, radius });

      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }

      regionChangeTimeoutRef.current = setTimeout(() => {
        if (Date.now() - lastUpdate.current < 1500) return;

        updateLocation({
          locationLat: region.latitude,
          locationLng: region.longitude,
          radius: Math.round(radius),
        });

        lastUpdate.current = Date.now();
        setPendingRegion(null);
      }, 300);
    },
    [updateLocation]
  );

  return (
    <View style={styles.container}>
      <SearchWithCategories
        searchValue={query}
        onSearchChange={setQuery}
        selectedCategories={category}
        onCategoryToggle={setCategory}
        isLoading={isLoading}
        placeholder={t('venues.searchVenues')}
        containerStyle={styles.searchContainer}
      />

      <MapComponent
        onRegionChange={handleRegionChange}
        venues={venues}
        clusters={clusters}
        initialRegion={userLocation}
        showUserLocation
        userLocation={userLocation}
      />

      <VenueBottomSheet
        totalVenues={totalVenues}
        searchParams={searchParams}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
