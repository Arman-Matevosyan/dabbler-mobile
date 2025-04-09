import { SearchWithCategories } from '@/components/shared';
import MapComponent from '@/components/venues/MapComponent';
import { Cluster, Venue } from '@/components/venues/types';
import { VenueBottomSheet } from '@/components/venues/VenueBottomSheet';
import { useVenueSearch } from '@/hooks/content';
import useFetchUserLocation from '@/hooks/useFetchUserLocation';
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

const ARMENIA_REGION = {
  latitude: 40.179,
  longitude: 44.499,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
  radius: 100000,
};

export default function VenueTabScreen() {
  const { t } = useTranslation();
  const { userLocation, fetchUserLocation } = useFetchUserLocation();
  const isFocused = useIsFocused();
  const lastUpdate = useRef<number>(0);
  const regionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialized = useRef<boolean>(false);

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

  useEffect(() => {
    if (!initialized.current && isFocused) {
      initialized.current = true;
      updateLocation({
        locationLat: ARMENIA_REGION.latitude,
        locationLng: ARMENIA_REGION.longitude,
        radius: ARMENIA_REGION.radius,
      });
      fetchUserLocation();
    }
  }, [isFocused, updateLocation, fetchUserLocation]);

  const { data, isLoading, refetch } = useVenueSearch(searchParams, isFocused);

  const handleMapReady = useCallback(() => {
    if (locationLat && locationLng && radius) {
      refetch();
    }
  }, [locationLat, locationLng, radius, refetch]);

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
        initialRegion={{
          latitude: locationLat || ARMENIA_REGION.latitude,
          longitude: locationLng || ARMENIA_REGION.longitude,
          latitudeDelta: ARMENIA_REGION.latitudeDelta,
          longitudeDelta: ARMENIA_REGION.longitudeDelta,
        }}
        showUserLocation
        userLocation={userLocation}
        onMapReady={handleMapReady}
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
