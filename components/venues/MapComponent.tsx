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
import type { Cluster, MapComponentProps, Venue } from './types';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Function to handle clusters with single venues
const processMapData = (venues: Venue[] = [], clusters: Cluster[] = []) => {
  // Convert clusters with count=1 to venues
  const processedVenues = [...venues];
  const processedClusters = clusters.filter(cluster => {
    if (cluster.count === 1 && cluster.venue) {
      // Add the venue from this cluster to venues list
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
    
    // Ensure initialRegion has proper defaults for delta values
    const defaultRegion: Region = {
      latitude: initialRegion?.latitude ?? 0,
      longitude: initialRegion?.longitude ?? 0,
      latitudeDelta: initialRegion?.latitudeDelta ?? 0.02,
      longitudeDelta: initialRegion?.longitudeDelta ?? 0.02,
    };
    
    const currentRegion = useRef(defaultRegion);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const isRegionChanging = useRef(false);
    
    // Keep reference to previous venues and clusters to prevent flickering
    const prevVenues = useRef<Venue[]>([]);
    const prevClusters = useRef<Cluster[]>([]);

    // Setup custom layout animation for markers
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

    // Handle map ready event
    const handleMapReady = useCallback(() => {
      // Call the onMapReady prop if provided
      if (onMapReady) {
        onMapReady();
      }
    }, [onMapReady]);

    // Use stable IDs for venue keys
    const getVenueKey = useCallback(
      (venue: Venue) => `venue-${venue.id}`,
      []
    );
    
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

    // Use stable IDs for cluster keys
    const getClusterKey = useCallback(
      (cluster: Cluster) => `cluster-${cluster.id}-${cluster.count}`,
      []
    );

    // Process map data to handle single-venue clusters
    const { venues: processedVenues, clusters: processedClusters } = useMemo(
      () => processMapData(venues, clusters),
      [venues, clusters]
    );

    // Update references for previous data to ensure smooth transitions
    useEffect(() => {
      // Only update refs if we have valid data and aren't currently changing the region
      if (processedVenues.length > 0 || processedClusters.length > 0) {
        setTimeout(() => {
          prevVenues.current = processedVenues;
          prevClusters.current = processedClusters;
          // Apply layout animation when markers update
          configureMarkerAnimation();
        }, 0);
      }
    }, [processedVenues, processedClusters, configureMarkerAnimation]);

    // Filter out invalid coordinates
    const { validVenues, validClusters } = useMemo(
      () => {
        // If we're in the middle of a region change and have no new data,
        // use the previous data to avoid flicker
        const venuesToUse = processedVenues.length === 0 && isRegionChanging.current
          ? prevVenues.current
          : processedVenues;
          
        const clustersToUse = processedClusters.length === 0 && isRegionChanging.current
          ? prevClusters.current
          : processedClusters;
          
        return {
          validVenues: venuesToUse.filter(
            (v) =>
              v?.location?.coordinates &&
              Array.isArray(v.location.coordinates) && 
              v.location.coordinates.length >= 2 &&
              typeof v.location.coordinates[1] === 'number' &&
              typeof v.location.coordinates[0] === 'number'
          ),
          validClusters: clustersToUse.filter(
            (c) =>
              c?.center?.latitude !== undefined &&
              c?.center?.longitude !== undefined &&
              typeof c.center.latitude === 'number' &&
              typeof c.center.longitude === 'number'
          ),
        };
      },
      [processedVenues, processedClusters]
    );

    // Add debug logging
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Raw venues count: ${venues.length}`);
        console.log(`Raw clusters count: ${clusters.length}`);
        console.log(`Valid venues count: ${validVenues.length}`);
        console.log(`Valid clusters count: ${validClusters.length}`);
        
        if (venues.length > 0 && validVenues.length === 0) {
          console.warn('No valid venues after filtering. Sample venue:', venues[0]);
        }
      }
    }, [venues, clusters, validVenues, validClusters]);

    const handleRegionChangeStart = useCallback(() => {
      isRegionChanging.current = true;
    }, []);

    const handleRegionChange = useCallback(
      (region: Region) => {
        currentRegion.current = region;
        const radius = calculateRadius(region);
        isRegionChanging.current = false;
        onRegionChange(region, radius);
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

    const handleClusterPress = useCallback((cluster: Cluster) => {
      // Provide immediate visual feedback
      configureMarkerAnimation();
      
      // Zoom in to the cluster region
      if (mapRef.current) {
        const region: Region = {
          latitude: cluster.center.latitude,
          longitude: cluster.center.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(region, 300);
      }
    }, [configureMarkerAnimation]);
    
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={colorScheme === 'dark' ? darkMapStyle : lightMapStyle}
          provider={PROVIDER_GOOGLE}
          initialRegion={defaultRegion}
          onRegionChangeComplete={handleRegionChange}
          onRegionChange={handleRegionChangeStart}
          onPress={() => setSelectedVenue(null)}
          showsUserLocation={showUserLocation}
          moveOnMarkerPress={false}
          onMapReady={handleMapReady}
        >
          {validClusters.map((cluster) => (
            <ClusterMarker
              key={getClusterKey(cluster)}
              cluster={cluster}
              onPress={() => handleClusterPress(cluster)}
              colorScheme={colorScheme}
            />
          ))}
          {validVenues.map((venue) => (
            <VenueMarker
              key={getVenueKey(venue)}
              venue={venue}
              isSelected={selectedVenue?.id === venue.id}
              onPress={handleVenuePress}
              colorScheme={colorScheme}
            />
          ))}
        </MapView>

        {selectedVenue?.id && (
          <VenueDetailsPanel
            selectedVenue={selectedVenue}
            isLoading={false}
            slideAnim={slideAnim}
            opacityAnim={opacityAnim}
            onClose={() => setSelectedVenue(null)}
          />
        )}
      </View>
    );
  }
);

const calculateRadius = (region: Region) => {
  const circumference = 40075;
  const oneDegreeInMeters = (circumference * 1000) / 360;
  return (
    Math.max(
      region.latitudeDelta * oneDegreeInMeters,
      region.longitudeDelta * oneDegreeInMeters
    ) / 2
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
