import { MARKER_COLORS } from '@/constants/VenueColors';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Cluster } from './MapComponent';

interface ClusterMarkerProps {
  cluster: Cluster;
  colorScheme: 'light' | 'dark';
  onPress: () => void;
}

const ClusterMarkerComponent: React.FC<ClusterMarkerProps> = memo(
  ({ cluster, colorScheme, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const [tracksViewChanges, setTracksViewChanges] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setTracksViewChanges(false);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      setTracksViewChanges(true);
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTracksViewChanges(false);
      });
    }, []);

    const handlePress = () => {
      setTracksViewChanges(true);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTracksViewChanges(false);
      });

      onPress();
    };

    const clusterStyles = useMemo(
      () => ({
        marker: {
          backgroundColor: MARKER_COLORS.CLUSTER_BACKGROUND,
          borderColor: MARKER_COLORS.CLUSTER_BORDER,
        },
        text: { color: MARKER_COLORS.CLUSTER_TEXT },
      }),
      []
    );

    const coordinate = useMemo(
      () => ({
        latitude: cluster.center.latitude,
        longitude: cluster.center.longitude,
      }),
      [cluster.center.latitude, cluster.center.longitude]
    );

    return (
      <Marker
        coordinate={coordinate}
        zIndex={9999}
        onPress={handlePress}
        tracksViewChanges={tracksViewChanges}
      >
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View style={[styles.marker, clusterStyles.marker]}>
            <Text style={[styles.text, clusterStyles.text]}>
              {cluster.count}
            </Text>
          </View>
        </Animated.View>
      </Marker>
    );
  },
  (prev, next) =>
    prev.cluster.id === next.cluster.id &&
    prev.cluster.count === next.cluster.count &&
    prev.colorScheme === next.colorScheme &&
    prev.cluster.center.latitude === next.cluster.center.latitude &&
    prev.cluster.center.longitude === next.cluster.center.longitude
);

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClusterMarkerComponent;
