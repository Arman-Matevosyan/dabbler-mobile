import Skeleton from '@/components/ui/Skeleton';
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
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ExtendedVenue extends IVenue {
  categories?: Array<{ name: string }>;
  covers?: Array<{ url: string }>;
  address?: {
    city?: string;
    district?: string;
  };
  isInPlan?: boolean;
  isFavorite?: boolean;
  description?: string;
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
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.skeletonContainer,
        { borderRadius: 16, overflow: 'hidden' },
      ]}
    >
      <View style={{ flexDirection: 'row', height: 130 }}>
        <View style={styles.leftContainer}>
          <Skeleton
            style={[
              styles.skeletonImage,
              {
                backgroundColor: colors.border,
                width: 110,
                height: '100%',
                borderRadius: 0,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.skeletonContent,
            { flex: 1, justifyContent: 'center' },
          ]}
        >
          <Skeleton
            style={[styles.skeletonTitle, { backgroundColor: colors.border }]}
          />
          <Skeleton
            style={[
              styles.skeletonSubtitle,
              { backgroundColor: colors.border },
            ]}
          />
          <Skeleton
            style={[
              styles.skeletonSubtitle,
              { backgroundColor: colors.border, width: '80%' },
            ]}
          />
        </View>
      </View>
      <View
        style={[
          styles.separator,
          { backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 16 },
        ]}
      />
    </View>
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
        size={20}
        color={isFavorite ? '#FF3B30' : 'white'}
      />
    </TouchableOpacity>
  );
});

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

    const [imageError, setImageError] = useState(false);

    const hasImage =
      item.covers && item.covers.length > 0 && item.covers[0]?.url;
    const imageUrl = hasImage ? item.covers?.[0].url : undefined;

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

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress(item);
      }
    }, [item, onPress]);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <>
        <TouchableOpacity
          style={[
            styles.venueCard,
            {
              backgroundColor: colors.background,
              borderBottomWidth: 0,
              borderWidth: 0,
              borderColor: 'transparent',
            },
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.leftContainer}>
            {hasImage && !imageError ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.venueImage}
                resizeMode="cover"
                onError={handleImageError}
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  { backgroundColor: colors.border },
                ]}
              >
                <Ionicons
                  name="image-outline"
                  size={40}
                  color={colors.textSecondary}
                />
              </View>
            )}

            <View style={styles.favoriteButtonContainer}>
              <FavoriteButton venue={item} />
            </View>
          </View>

          <View style={styles.venueDetails}>
            <Text style={[styles.venueName, { color: colors.textPrimary }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.venueLocation, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {locationText}
            </Text>
            {item.description && (
              <Text
                style={[
                  styles.venueDescription,
                  { color: colors.textSecondary },
                ]}
                numberOfLines={2}
              >
                {item.description.length > 100
                  ? `${item.description.substring(0, 100)}...`
                  : item.description}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              marginVertical: 16,
            },
          ]}
        />
      </>
    );
  }
);

export const VenueBottomSheet = React.memo(
  ({
    onVenuePress,
    totalVenues,
    searchParams,
    isLoading: externalIsLoading,
  }: VenueBottomSheetProps) => {
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme || 'dark'];
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['7%', '92%'], []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isExpanded = currentIndex > 0;
    const { t } = useTranslation();
    
    // Track the data loading state to prevent accidental sheet position changes
    const [isDataLoading, setIsDataLoading] = useState(false);
    const isFocused = useIsFocused();
    
    // Prevent sheet position changes during data loading
    const handleSheetChange = useCallback((index: number) => {
      if (!isDataLoading) {
        setCurrentIndex(index);
      }
    }, [isDataLoading]);
    
    // Expose a method to update the data loading state
    const updateLoadingState = useCallback((loading: boolean) => {
      setIsDataLoading(loading);
    }, []);

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (isExpanded) {
            bottomSheetRef.current?.snapToIndex(0);
            return true;
          }
          return false;
        };

        const subscription = BackHandler.addEventListener(
          'hardwareBackPress',
          onBackPress
        );

        return () => subscription.remove();
      }, [isExpanded])
    );

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
                backgroundColor: colors.background,
                borderBottomColor: colors.divider,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1.5,
                elevation: 2,
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
            <View style={styles.headerContent}>
              {externalIsLoading ? (
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
      [totalVenues, colors, externalIsLoading, t]
    );

    const isExpandedRef = useRef(isExpanded);
    useEffect(() => {
      isExpandedRef.current = isExpanded;
    }, [isExpanded]);

    const renderContent = useMemo(
      () => () => (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <BottomSheetContent
            searchParams={memoizedSearchParams}
            onVenuePress={handleVenuePress}
            colors={colors}
            goToIndex={(index: number) =>
              bottomSheetRef.current?.snapToIndex(index)
            }
            isExpanded={isExpanded}
            updateLoadingState={updateLoadingState}
          />
        </View>
      ),
      [colors, handleVenuePress, memoizedSearchParams, isExpanded, updateLoadingState]
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
        handleIndicatorStyle={{ display: 'none' }}
        handleStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        onChange={handleSheetChange}
        enablePanDownToClose={false}
        enableOverDrag={false}
        index={0}
        topInset={40}
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
    isExpanded,
    updateLoadingState,
  }: BottomSheetContentProps & { 
    isExpanded: boolean;
    updateLoadingState: (loading: boolean) => void;
  }) => {
    const isFocused = useIsFocused();
    const { data, isLoading } = useVenuesBottomSheet(searchParams, isFocused);
    const { t } = useTranslation();
    
    // Notify parent component about loading state changes
    useEffect(() => {
      updateLoadingState(isLoading);
    }, [isLoading, updateLoadingState]);
    
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
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <VenueSkeletonItem key={key} />
          ))}
        </Animated.View>
      ),
      []
    );

    if (!isExpanded) {
      // Render minimal content when collapsed
      return (
        <View style={{ flex: 1 }}>
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { backgroundColor: colors.background, height: 10 },
            ]}
          >
            <View style={{ height: 1 }} />
          </BottomSheetScrollView>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {isLoading ? (
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { backgroundColor: colors.background, paddingTop: 24 },
            ]}
          >
            <View style={{ height: 16 }} />
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
            contentContainerStyle={{ paddingTop: 24, backgroundColor: colors.background }}
            ListHeaderComponent={<View style={{ height: 16 }} />}
            ListFooterComponent={<View style={{ height: 80 }} />}
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
      </View>
    );
  }
);

const styles = StyleSheet.create({
  skeletonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonImage: {
    width: 110,
    height: '100%',
    marginBottom: 0,
  },
  skeletonContent: {
    padding: 12,
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
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonButton: {
    height: 32,
    borderRadius: 8,
    marginTop: 8,
    width: '30%',
  },
  venueCard: {
    borderRadius: 16,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    height: 130,
  },
  venueImage: {
    width: 110,
    height: '100%',
    borderRadius: 0,
    marginRight: 0,
  },
  venueDetails: {
    padding: 12,
    justifyContent: 'center',
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  venueDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  venueLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  planBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10,
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
    paddingBottom: 24,
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
  placeholderImage: {
    width: 110,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    marginRight: 0,
  },
  leftContainer: {
    position: 'relative',
    width: 110,
    height: '100%',
    overflow: 'hidden',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
});
