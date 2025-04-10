import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { Colors } from '@/constants/Colors';
import { useTooltip } from '@/contexts/TooltipContext';
import { useVenuesBottomSheet } from '@/hooks/content';
import { useFavorites } from '@/hooks/favorites/useFavorites';
import { useUser } from '@/hooks/user';
import { useTheme } from '@/providers/ThemeContext';
import { IVenue } from '@/types/class.types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ExtendedVenue extends IVenue {
  categories?: Array<{ name: string }>;
  covers?: Array<{ url: string }>;
  address?: {
    city?: string;
    district?: string;
  };
}

interface VenueBottomSheetProps {
  onVenuePress?: (venue: ExtendedVenue) => void;
  totalVenues: number;
  searchParams?: any;
  isLoading: boolean;
}

interface BottomSheetContentProps {
  searchParams: any;
  onVenuePress: (venue: ExtendedVenue) => void;
  colors: any;
  goToIndex: (index: number) => void;
}

const VenueSkeletonItem = React.memo(() => {
  return <SkeletonCard type="venue" />;
});

interface RatingStarsProps {
  rating: number;
  reviewCount: number;
}

const RatingStars = React.memo(({ rating, reviewCount }: RatingStarsProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      <View style={styles.ratingContainer}>
        {[...Array(filledStars)].map((_, i) => (
          <Ionicons
            key={`star-filled-${i}`}
            name="star"
            size={16}
            color={colors.activePinColor}
          />
        ))}
        {hasHalfStar && (
          <Ionicons name="star-half" size={16} color={colors.activePinColor} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Ionicons
            key={`star-empty-${i}`}
            name="star-outline"
            size={16}
            color={colors.activePinColor}
          />
        ))}
        <Text style={[styles.ratingValue, { color: colors.textPrimary }]}>
          {rating.toFixed(1)}
        </Text>
      </View>
      <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
        ({reviewCount} {t('venues.reviews')})
      </Text>
    </>
  );
});

interface FavoriteButtonProps {
  venue: ExtendedVenue;
}

const FavoriteButton = React.memo(({ venue }: FavoriteButtonProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { favorites, toggleFavorite } = useFavorites();
  const { showTooltip } = useTooltip();
  const { isAuthenticated } = useUser();
  const { t } = useTranslation();

  const isFavorite = useMemo(
    () => favorites?.some((fav) => fav.id === venue.id),
    [favorites, venue.id]
  );

  const handlePress = () => {
    if (!isAuthenticated) {
      showTooltip(t('venues.signInToSaveFavorites'));
      return;
    }
    toggleFavorite(venue.id);
  };

  return (
    <TouchableOpacity
      style={[styles.favoriteButton]}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={isFavorite ? '#FF3B30' : 'white'}
      />
    </TouchableOpacity>
  );
});

const venueRatings = new Map<string, { rating: number; reviews: number }>();

const getVenueRating = (venueId: string) => {
  if (!venueRatings.has(venueId)) {
    venueRatings.set(venueId, {
      rating: 3.5 + Math.random() * 1.5,
      reviews: Math.floor(Math.random() * 60),
    });
  }
  return venueRatings.get(venueId)!;
};

const VenueCard = React.memo(
  ({
    item,
    onPress,
  }: {
    item: ExtendedVenue;
    onPress?: (venue: ExtendedVenue) => void;
  }) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];
    const { t } = useTranslation();

    const imageUrl = useMemo(() => {
      if (item.covers && item.covers.length > 0 && item.covers[0].url) {
        return item.covers[0].url;
      }
      return 'https://via.placeholder.com/300x200';
    }, [item.covers]);

    const categoryText = useMemo(() => {
      if (!item.categories || item.categories.length === 0)
        return t('venues.fitness');
      return item.categories.map((c) => c.name).join(', ');
    }, [item.categories, t]);

    const locationText = useMemo(() => {
      if (item.address) {
        if (item.address.district && item.address.city) {
          return `${item.address.district}, ${item.address.city}`;
        }
        if (item.address.city) {
          return item.address.city;
        }
      }
      return '';
    }, [item.address]);

    const { rating, reviews } = useMemo(
      () => getVenueRating(item.id),
      [item.id]
    );

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress(item);
      }
    }, [item, onPress]);

    return (
      <>
        <Card
          imageUrl={imageUrl}
          onPress={handlePress}
          style={[styles.venueCard, { 
            backgroundColor: colors.background,
            borderBottomWidth: 0,
            borderWidth: 0,
            borderColor: 'transparent'
          }]}
          contentStyle={{ borderBottomWidth: 0 }}
          badge={<FavoriteButton venue={item} />}
        >
          <View style={styles.venueDetails}>
            <Text style={[styles.venueName, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.venueCategories, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {categoryText}
            </Text>
            <Text
              style={[styles.venueLocation, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {locationText}
            </Text>
            <View style={styles.ratingRow}>
              <RatingStars rating={rating} reviewCount={reviews} />
            </View>
          </View>
        </Card>
        <View style={[styles.separator, { backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 16 }]} />
      </>
    );
  }
);

export const VenueBottomSheet = React.memo(
  ({
    onVenuePress,
    totalVenues,
    searchParams,
    isLoading,
  }: VenueBottomSheetProps) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme || 'dark'];
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['7%', '90%'], []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isExpanded = currentIndex > 0;
    const { t } = useTranslation();

    const memoizedSearchParams = useMemo(
      () => searchParams,
      [JSON.stringify(searchParams)]
    );

    const handleVenuePress = useCallback(
      (venue: ExtendedVenue) => {
        if (onVenuePress) {
          onVenuePress(venue);
        } else {
          router.push({
            pathname: '/venues/[id]',
            params: { id: venue.id },
          });
        }
      },
      [onVenuePress]
    );

    const renderHeader = useMemo(
      () => () =>
        (
          <View
            style={[
              styles.header,
              {
                backgroundColor: 'transparent',
                borderBottomColor: colors.divider,
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <View style={styles.headerContent}>
              {isLoading ? (
                <Skeleton style={styles.headerText} />
              ) : (
                <Text
                  style={[styles.headerText, { color: colors.textPrimary }]}
                >
                  {totalVenues} {t('venues.venues')}
                </Text>
              )}
            </View>
          </View>
        ),
      [totalVenues, colors, isLoading, t]
    );

    const isExpandedRef = useRef(isExpanded);
    useEffect(() => {
      isExpandedRef.current = isExpanded;
    }, [isExpanded]);

    const renderContent = useMemo(
      () => () =>
        (
          <View style={{ flex: 1 }}>
            {isExpanded ? (
              <BottomSheetContent
                searchParams={memoizedSearchParams}
                onVenuePress={handleVenuePress}
                colors={colors}
                goToIndex={(index: number) =>
                  bottomSheetRef.current?.snapToIndex(index)
                }
              />
            ) : (
              <BottomSheetScrollView
                contentContainerStyle={[
                  styles.contentContainer,
                  { backgroundColor: 'transparent', height: 10 },
                ]}
              >
                <View style={{ height: 1 }} />
              </BottomSheetScrollView>
            )}
          </View>
        ),
      [isExpanded, colors, handleVenuePress, memoizedSearchParams]
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={renderHeader}
        backgroundStyle={[
          styles.bottomSheetBackground,
          { backgroundColor: colors.background },
        ]}
        onChange={setCurrentIndex}
        enablePanDownToClose={false}
        enableOverDrag={false}
        index={0}
      >
        {renderContent()}
      </BottomSheet>
    );
  }
);

const BottomSheetContent = React.memo(
  ({
    searchParams,
    onVenuePress,
    colors,
    goToIndex,
  }: BottomSheetContentProps) => {
    const isFocused = useIsFocused();
    const { data, isLoading } = useVenuesBottomSheet(searchParams, isFocused);
    const { t } = useTranslation();

    const renderVenueItem = useCallback(
      ({ item }: { item: ExtendedVenue }) => (
        <VenueCard key={item.id} item={item} onPress={onVenuePress} />
      ),
      [onVenuePress]
    );

    const keyExtractor = useCallback((item: ExtendedVenue) => item.id, []);

    const ListEmptyComponent = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            {t('venues.noVenuesFound')}
          </Text>
        </View>
      ),
      [colors.textSecondary, t]
    );

    const renderSkeletons = useCallback(
      () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {[1, 2, 3].map((key) => (
            <VenueSkeletonItem key={key} />
          ))}
        </Animated.View>
      ),
      []
    );

    return (
      <>
        {isLoading ? (
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { backgroundColor: 'transparent' },
            ]}
          >
            {renderSkeletons()}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetFlatList
            data={(data || []) as ExtendedVenue[]}
            renderItem={renderVenueItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={7}
            initialNumToRender={3}
            updateCellsBatchingPeriod={50}
            ListFooterComponent={<View style={{ height: 60 }} />}
          />
        )}

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[
              styles.mapViewButton,
              { backgroundColor: colors.buttonBackground },
            ]}
            onPress={() => goToIndex(0)}
          >
            <MaterialCommunityIcons
              name="map-outline"
              size={18}
              color="white"
            />
            <Text style={styles.mapViewText}>{t('venues.mapView')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  skeletonContainer: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonImage: {
    width: '100%',
    height: 200,
    marginBottom: 0,
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    height: 20,
    width: '70%',
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonSubtitle: {
    height: 16,
    width: '50%',
    marginBottom: 4,
    borderRadius: 4,
  },
  skeletonButton: {
    height: 32,
    borderRadius: 8,
    marginTop: 8,
    width: '30%',
  },
  venueCard: {
    borderRadius: 12,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  venueImage: {
    width: '100%',
    height: 200,
  },
  venueDetails: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  venueCategories: {
    fontSize: 14,
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 12,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 8,
  },
  mapViewText: {
    color: 'white',
    fontWeight: '500',
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    width: '100%',
  },
});
