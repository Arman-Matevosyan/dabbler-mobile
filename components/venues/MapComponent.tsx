import { darkMapStyle, lightMapStyle } from '@/constants/MapColors';
import { useTheme } from '@/providers/ThemeContext';
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    Dimensions,
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import ClusterMarker from './ClusterMarker';
import VenueDetailsPanel from './VenueDetailsPanel';
import VenueMarker from './VenueMarker';

export interface Venue {
  id: string;
  name: string;
  description?: string;
  location: {
    coordinates: number[];
    type: string;
  };
  address: {
    addressLine2?: string;
    city?: string;
    country?: string;
    district?: string;
    houseNumber?: string;
    landmark?: string;
    postalCode?: string;
    stateOrProvince?: string;
    street?: string;
  };
  covers: Array<{ url: string; name?: string }>;
  categories?: string[] | Array<{ name: string }>;
}

export interface Cluster {
  id?: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
  venue?: Venue | null;
}

interface MapComponentProps {
  onRegionChange: (region: Region, radius: number) => void;
  venues?: Venue[];
  clusters?: Cluster[];
  initialRegion?: Partial<Region>;
  showUserLocation?: boolean;
  onMapReady?: () => void;
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const processMapData = (venues: Venue[] = [], clusters: Cluster[] = []) => {
  const processedVenues = [...venues];
  const processedClusters = clusters.filter((cluster) => {
    if (cluster.count === 1 && cluster.venue) {
      processedVenues.push(cluster.venue);
      return false;
    }
    return true;
  });

  return {
    venues: processedVenues,
    clusters: processedClusters,
  };
};

const VenueMarkerMemo = memo(
  ({
    venue,
    isSelected,
    onPress,
    colorScheme,
  }: {
    venue: Venue;
    isSelected: boolean;
    onPress: (venue: Venue) => void;
    colorScheme: 'light' | 'dark';
  }) => (
    <VenueMarker
      key={venue.id}
      venue={venue}
      isSelected={isSelected}
      onPress={onPress}
      colorScheme={colorScheme}
    />
  ),
  (prev, next) =>
    prev.venue.id === next.venue.id &&
    prev.isSelected === next.isSelected &&
    prev.colorScheme === next.colorScheme
);

const ClusterMarkerMemo = memo(
  ({
    cluster,
    onPress,
    colorScheme,
  }: {
    cluster: Cluster;
    onPress: () => void;
    colorScheme: 'light' | 'dark';
  }) => (
    <ClusterMarker
      key={cluster.id}
      cluster={cluster}
      onPress={onPress}
      colorScheme={colorScheme}
    />
  ),
  (prev, next) =>
    prev.cluster.id === next.cluster.id &&
    prev.cluster.count === next.cluster.count &&
    prev.colorScheme === next.colorScheme
);

const MapComponent: React.FC<MapComponentProps> = memo(
  ({
    onRegionChange,
    venues = [],
    clusters = [],
    initialRegion,
    showUserLocation = true,
    onMapReady,
  }) => {
    const { colorScheme } = useTheme();
    const mapRef = useRef<MapView>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const isRegionChanging = useRef(false);
    const regionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const defaultRegion: Region = useMemo(
      () => ({
        latitude: initialRegion?.latitude ?? 0,
        longitude: initialRegion?.longitude ?? 0,
        latitudeDelta: initialRegion?.latitudeDelta ?? 0.02,
        longitudeDelta: initialRegion?.longitudeDelta ?? 0.02,
      }),
      [initialRegion]
    );

    const currentRegion = useRef(defaultRegion);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const prevVenues = useRef<Venue[]>([]);
    const prevClusters = useRef<Cluster[]>([]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (regionChangeTimeoutRef.current) {
          clearTimeout(regionChangeTimeoutRef.current);
        }
      };
    }, []);

    const configureMarkerAnimation = useCallback(() => {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });
    }, []);

    const handleMapReady = useCallback(() => {
      if (onMapReady) {
        onMapReady();
      }
    }, [onMapReady]);

    const getVenueKey = useCallback((venue: Venue) => `venue-${venue.id}`, []);

    useEffect(() => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: selectedVenue ? 1 : 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: selectedVenue ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, [selectedVenue, slideAnim, opacityAnim]);

    const getClusterKey = useCallback(
      (cluster: Cluster) => `cluster-${cluster.id}-${cluster.count}`,
      []
    );

    const { venues: processedVenues, clusters: processedClusters } = useMemo(
      () => processMapData(venues, clusters),
      [venues, clusters]
    );

    useEffect(() => {
      if (processedVenues.length > 0 || processedClusters.length > 0) {
        prevVenues.current = processedVenues;
        prevClusters.current = processedClusters;
      }
    }, [processedVenues, processedClusters]);

    // Calculate cluster radius based on zoom level - smaller radius at higher zoom levels
    const calculateDynamicClusterRadius = (region: Region) => {
      const { longitudeDelta } = region;
      // Base radius calculation
      const baseRadius = calculateRadius(region);
      
      // Adjust radius based on zoom level (longitudeDelta)
      // As we zoom in (longitudeDelta gets smaller), we want a smaller cluster radius
      if (longitudeDelta < 0.01) {
        // Very zoomed in - use smaller clusters
        return baseRadius * 0.5;  
      } else if (longitudeDelta < 0.05) {
        // Medium zoom level
        return baseRadius * 0.7;
      } else {
        // Zoomed out - use normal radius
        return baseRadius;
      }
    };

    // Enhanced region change handlers with dynamic clustering
    const handleRegionChangeStart = useCallback(() => {
      if (isRegionChanging.current) return;
      isRegionChanging.current = true;
      
      // Cancel any pending region change timeout
      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }
    }, []);

    const handleRegionChangeComplete = useCallback(
      (region: Region) => {
        currentRegion.current = region;
        
        // Apply a slight delay to prevent too many API calls when panning/zooming
        if (regionChangeTimeoutRef.current) {
          clearTimeout(regionChangeTimeoutRef.current);
        }
        
        // Calculate the dynamic cluster radius based on zoom level
        const dynamicRadius = calculateDynamicClusterRadius(region);
        
        regionChangeTimeoutRef.current = setTimeout(() => {
          if (onRegionChange) {
            onRegionChange(region, dynamicRadius);
          }
          isRegionChanging.current = false;
        }, 150);
      },
      [onRegionChange]
    );

    const handleVenuePress = useCallback(
      (venue: Venue) => {
        if (selectedVenue?.id === venue.id) return;
        // Provide immediate feedback on press
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedVenue(venue);
      },
      [selectedVenue]
    );

    const handleClusterPress = useCallback(
      (cluster: Cluster) => {
        configureMarkerAnimation();

        if (mapRef.current) {
          const region: Region = {
            latitude: cluster.center.latitude,
            longitude: cluster.center.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          mapRef.current.animateToRegion(region, 300);
        }
      },
      [configureMarkerAnimation]
    );

    // Prevent marker overlap by adjusting visible venues at high zoom levels
    const deduplicateMarkers = useCallback((venues: Venue[]) => {
      if (!venues || venues.length <= 1) return venues;
      
      // At high zoom levels, we don't need to deduplicate
      if (currentRegion.current.longitudeDelta < 0.005) return venues;
      
      const gridSize = 0.0005; // Grid cell size in degrees (adjust based on your needs)
      const occupiedCells = new Map<string, Venue>();
      
      // Sort venues by some priority (e.g., popularity, or just alphabetically)
      // In a real app, you'd have a better priority metric
      const sortedVenues = [...venues].sort((a, b) => a.name.localeCompare(b.name));
      
      return sortedVenues.filter(venue => {
        if (!venue.location?.coordinates) return false;
        
        // Calculate grid cell for this venue
        const latCell = Math.floor(venue.location.coordinates[1] / gridSize);
        const lngCell = Math.floor(venue.location.coordinates[0] / gridSize);
        const cellKey = `${latCell},${lngCell}`;
        
        // If cell is unoccupied, mark it and include this venue
        if (!occupiedCells.has(cellKey)) {
          occupiedCells.set(cellKey, venue);
          return true;
        }
        
        // Cell is occupied, skip this venue
        return false;
      });
    }, []);
    
    // Apply marker deduplication to venues
    const validVenues = useMemo(() => {
      const filtered = processedVenues.filter(
        venue => venue?.location?.coordinates?.length === 2
      );
      return deduplicateMarkers(filtered);
    }, [processedVenues, deduplicateMarkers]);
    
    // Filter valid clusters
    const validClusters = useMemo(() => {
      return processedClusters.filter(
        (c) =>
          c?.center?.latitude !== undefined &&
          c?.center?.longitude !== undefined &&
          typeof c.center.latitude === 'number' &&
          typeof c.center.longitude === 'number'
      );
    }, [processedClusters]);

    const venueMarkers = useMemo(
      () =>
        validVenues.map((venue) => (
          <VenueMarkerMemo
            key={getVenueKey(venue)}
            venue={venue}
            isSelected={selectedVenue?.id === venue.id}
            onPress={handleVenuePress}
            colorScheme={colorScheme}
          />
        )),
      [validVenues, selectedVenue, colorScheme, handleVenuePress, getVenueKey]
    );

    const clusterMarkers = useMemo(
      () =>
        validClusters.map((cluster) => (
          <ClusterMarkerMemo
            key={getClusterKey(cluster)}
            cluster={cluster}
            onPress={() => handleClusterPress(cluster)}
            colorScheme={colorScheme}
          />
        )),
      [validClusters, colorScheme, handleClusterPress, getClusterKey]
    );

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={colorScheme === 'dark' ? darkMapStyle : lightMapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={defaultRegion}
          onRegionChangeComplete={handleRegionChangeComplete}
          onRegionChange={handleRegionChangeStart}
          onPress={() => setSelectedVenue(null)}
          showsUserLocation={showUserLocation}
          moveOnMarkerPress={false}
          onMapReady={handleMapReady}
        >
          {clusterMarkers}
          {venueMarkers}
        </MapView>

        {selectedVenue && (
          <Animated.View
            style={[
              styles.detailsPanelContainer,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0],
                    }),
                  },
                ],
                opacity: opacityAnim,
              },
            ]}
          >
            <VenueDetailsPanel
              selectedVenue={selectedVenue}
              isLoading={false}
              onClose={() => setSelectedVenue(null)}
              slideAnim={slideAnim}
              opacityAnim={opacityAnim}
            />
          </Animated.View>
        )}
      </View>
    );
  }
);

const calculateRadius = (region: Region) => {
  const { longitudeDelta } = region;
  // Earth's circumference at the equator is about 40,075 kilometers
  const metersPerDegree = 40075000 / 360;
  return (longitudeDelta * metersPerDegree) / 2;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  detailsPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    width: SCREEN_WIDTH,
  },
});

export default memo(MapComponent);
