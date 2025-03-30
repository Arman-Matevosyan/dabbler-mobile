import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Venue } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VenueDetailsPanelProps {
  selectedVenue: Venue | null;
  isLoading: boolean;
  slideAnim: Animated.Value;
  opacityAnim: Animated.Value;
  onClose: () => void;
}

const VenueDetailsPanel: React.FC<VenueDetailsPanelProps> = memo(
  ({ selectedVenue, isLoading, slideAnim, opacityAnim, onClose }) => {
    const router = useRouter();
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme || 'dark'];
    const transformStyles = useMemo(
      () => ({
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
        containerStyle: {
          backgroundColor: colors.cardBackground,
          opacity: opacityAnim,
          width: SCREEN_WIDTH * 0.95,
        },
      }),
      [slideAnim, opacityAnim, colors.cardBackground]
    );

    const navigateToVenueDetails = useCallback(
      (venueId: string) => {
        onClose();
        router.push(`/venues/${venueId}`);
      },
      [onClose, router]
    );

    const venueContent = useMemo(() => {
      if (!selectedVenue) return null;

      return (
        <TouchableOpacity
          style={styles.venueContent}
          activeOpacity={0.7}
          onPress={() => navigateToVenueDetails(selectedVenue.id)}
        >
          <View style={styles.venueDetailsLayout}>
            <View style={styles.venueCoverContainer}>
              {selectedVenue?.covers?.[0] ? (
                <Image
                  source={{ uri: selectedVenue.covers[0]?.url }}
                  style={styles.venueCoverImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
              ) : (
                <View
                  style={[
                    styles.defaultImageContainer,
                    { backgroundColor: colors.skeletonBackground },
                  ]}
                >
                  <MaterialIcons
                    name="fitness-center"
                    size={40}
                    color={colors.textSecondary}
                  />
                </View>
              )}
            </View>

            <View style={styles.venueInfoSection}>
              <Text style={[styles.venueName, { color: colors.textPrimary }]}>
                {selectedVenue.name}
              </Text>
              <Text
                style={[
                  styles.venueCategories,
                  { color: colors.textSecondary },
                ]}
              >
                Fitness, Yoga, Aerial
              </Text>
              <View style={styles.ratingContainer}>
                <Text
                  style={[styles.ratingText, { color: colors.textPrimary }]}
                >
                  4.9
                </Text>
                {[...Array(5)].map((_, i) => (
                  <MaterialCommunityIcons
                    key={`star-${i}`}
                    name="star"
                    size={16}
                    color={colors.ratingStarActive}
                  />
                ))}
                <Text
                  style={[styles.ratingCount, { color: colors.textSecondary }]}
                >
                  (11)
                </Text>
              </View>
              <View
                style={[styles.plusButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.plusButtonText}>Plus</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }, [selectedVenue, colors, navigateToVenueDetails]);

    const skeletonContent = useMemo(
      () => (
        <View style={styles.skeletonContainer}>
          <View style={[styles.skeletonItem, styles.skeletonTitle]} />
          <View style={[styles.skeletonItem, styles.skeletonSubtitle]} />
          <View style={styles.ratingContainer}>
            <View style={[styles.skeletonItem, styles.skeletonRating]} />
          </View>
        </View>
      ),
      []
    );

    if (!selectedVenue) return null;

    return (
      <Animated.View
        style={[
          styles.venueDetailsContainer,
          transformStyles.containerStyle,
          { transform: [{ translateY: transformStyles.translateY }] },
        ]}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {isLoading ? skeletonContent : venueContent}
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.selectedVenue?.navId === nextProps.selectedVenue?.navId &&
      prevProps.slideAnim === nextProps.slideAnim &&
      prevProps.opacityAnim === nextProps.opacityAnim
    );
  }
);

const styles = StyleSheet.create({
  venueDetailsContainer: {
    position: 'absolute',
    bottom: 68,
    left: SCREEN_WIDTH * 0.025,
    padding: 16,
    minHeight: 144,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  venueContent: {
    paddingRight: 30,
  },
  venueDetailsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  venueInfoSection: {
    flex: 1,
    paddingLeft: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueCategories: {
    fontSize: 14,
    marginBottom: 8,
  },
  venueCoverContainer: {
    width: 100,
    height: 100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  venueCoverImage: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingCount: {
    fontSize: 14,
  },
  plusButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  plusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  skeletonContainer: {
    padding: 4,
  },
  skeletonItem: {
    borderRadius: 4,
    marginBottom: 12,
    opacity: 0.7,
  },
  skeletonTitle: {
    width: '70%',
    height: 24,
  },
  skeletonSubtitle: {
    width: '50%',
    height: 16,
  },
  skeletonRating: {
    width: 120,
    height: 20,
  },
  defaultImageContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VenueDetailsPanel;
