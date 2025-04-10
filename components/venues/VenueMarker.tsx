import { Colors } from '@/constants/Colors';
import { MARKER_COLORS, VENUE_COLORS } from '@/constants/VenueColors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Venue } from './MapComponent';

interface VenueMarkerProps {
  venue: Venue;
  isSelected: boolean;
  onPress: (venue: Venue) => void;
  colorScheme: 'light' | 'dark';
}

const VenueMarkerComponent: React.FC<VenueMarkerProps> = memo(
  ({ venue, isSelected, onPress, colorScheme }) => {
    const colors = Colors[colorScheme];
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);
    const [tracksViewChanges, setTracksViewChanges] = useState(false);

    // Initial animation when marker appears
    useEffect(() => {
      setTracksViewChanges(true);
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
      
      const trackingTimeout = setTimeout(() => {
        setTracksViewChanges(false);
      }, 1000);
      
      return () => clearTimeout(trackingTimeout);
    }, [venue.id]);

    // Animation when marker is selected/deselected
    useEffect(() => {
      setTracksViewChanges(true);
      
      if (isSelected) {
        scale.value = withSequence(
          withTiming(1.2, { duration: 150 }),
          withSpring(1.1, {
            damping: 10,
            stiffness: 100,
          })
        );
      } else {
        scale.value = withSpring(1, {
          damping: 12,
          stiffness: 100,
        });
      }
      
      const trackingTimeout = setTimeout(() => {
        setTracksViewChanges(false);
      }, 500);
      
      return () => clearTimeout(trackingTimeout);
    }, [isSelected]);

    const getVenueTypeColor = (venue: Venue) => {
      // This function would determine the venue type more accurately
      // in a real implementation. For now, we'll use a simple approach.
      // In a real app, the venue would have a type property.
      const type = venue.name.toLowerCase();

      if (type.includes('gym')) return VENUE_COLORS.GYM;
      if (type.includes('pool')) return VENUE_COLORS.POOL;
      if (type.includes('restaurant') || type.includes('cafe'))
        return VENUE_COLORS.RESTAURANT;
      if (type.includes('store') || type.includes('shop'))
        return VENUE_COLORS.STORE;

      return VENUE_COLORS.DEFAULT;
    };

    const markerColor = useMemo(
      () => (isSelected ? colors.activePinColor : getVenueTypeColor(venue)),
      [isSelected, venue, colors.activePinColor]
    );

    const hasValidCoordinates = useMemo(
      () =>
        Array.isArray(venue.location?.coordinates) &&
        venue.location.coordinates.length >= 2 &&
        typeof venue.location.coordinates[1] === 'number' &&
        typeof venue.location.coordinates[0] === 'number',
      [venue.location?.coordinates]
    );

    if (!hasValidCoordinates) {
      console.warn(`Invalid coordinates for venue ${venue.id}`);
      return null;
    }

    const handlePress = () => {
      setTracksViewChanges(true);
      scale.value = withSequence(
        withTiming(1.3, { duration: 100 }),
        withDelay(
          50,
          withSpring(isSelected ? 1.1 : 1, {
            damping: 10,
            stiffness: 100,
          })
        )
      );
      
      const trackingTimeout = setTimeout(() => {
        setTracksViewChanges(false);
      }, 500);
      
      onPress(venue);
    };

    const coordinate = useMemo(
      () => ({
        latitude: venue.location.coordinates[1],
        longitude: venue.location.coordinates[0],
      }),
      [venue.location.coordinates]
    );
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    return (
      <Marker
        coordinate={coordinate}
        onPress={handlePress}
        zIndex={isSelected ? 10000 : 9999}
        anchor={{ x: 0.5, y: 1 }}
        tracksViewChanges={tracksViewChanges}
      >
        <Animated.View style={animatedStyle}>
          <MaterialCommunityIcons
            name="map-marker"
            size={36}
            color={markerColor}
            style={[
              styles.icon,
              {
                shadowColor: MARKER_COLORS.MARKER_STROKE,
                textShadowColor: MARKER_COLORS.MARKER_STROKE,
                textShadowRadius: 2,
              },
            ]}
          />
        </Animated.View>
      </Marker>
    );
  },
  (prev, next) =>
    prev.venue.id === next.venue.id &&
    prev.isSelected === next.isSelected &&
    prev.colorScheme === next.colorScheme &&
    Array.isArray(prev.venue.location?.coordinates) &&
    Array.isArray(next.venue.location?.coordinates) &&
    prev.venue.location.coordinates[1] === next.venue.location.coordinates[1] &&
    prev.venue.location.coordinates[0] === next.venue.location.coordinates[0]
);

const styles = StyleSheet.create({
  icon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default VenueMarkerComponent;
