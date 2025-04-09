import ActivityChip from '@/components/details/ActivityChip';
import PlanChip from '@/components/details/PlanChip';
import GenericImageCarousel from '@/components/shared/GenericImageCarousel';
import VenueDetailsSkeleton from '@/components/ui/MainTabsSkeletons/VenueDetailsSkeleton';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapColors';
import { useTooltip } from '@/contexts/TooltipContext';
import { useUser } from '@/hooks';
import { useVenueDetails } from '@/hooks/content';
import { useFavorites } from '@/hooks/favorites/useFavorites';
import { useTheme } from '@/providers/ThemeContext';
import { Plan, Venue } from '@/types/enums';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function VenueDetailsScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const {
    venueDetails: venueData,
    isLoading,
    error,
    refetch,
  } = useVenueDetails(id);

  const venueDetails = venueData as Venue;
  const {
    favorites,
    toggleFavorite,
    isLoading: favoritesLoading,
  } = useFavorites();
  const { isAuthenticated } = useUser();
  const { showError } = useTooltip();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImportantInfo, setShowImportantInfo] = useState(false);

  const [isFavoriteState, setIsFavoriteState] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const isCurrentVenueFavorite =
      favorites?.some((fav) => fav.id === id) ?? false;
    setIsFavoriteState(isCurrentVenueFavorite);
  }, [favorites, id]);

  const handleToggleFavorite = useCallback(() => {
    if (favoritesLoading) return;

    if (!isAuthenticated) {
      showError(t('auth.authRequired'), t('auth.loginToAddFavorites'));
      return;
    }

    setIsFavoriteState((prev) => !prev);

    toggleFavorite(id)
      .then(() => {})
      .catch((error) => {
        setIsFavoriteState((prev) => !prev);

        if (error.message && error.message.includes('must be logged in')) {
          showError(t('auth.authRequired'), t('auth.loginToAddFavorites'));
        }
      });
  }, [
    id,
    toggleFavorite,
    isFavoriteState,
    favoritesLoading,
    isAuthenticated,
    showError,
    t,
  ]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription((prev) => !prev);
  }, []);

  const toggleImportantInfo = useCallback(() => {
    setShowImportantInfo((prev) => !prev);
  }, []);

  if (isLoading) {
    return <VenueDetailsSkeleton colors={colors} />;
  }

  if (error || !venueDetails) {
    return (
      <View
        style={[styles.errorContainer, { backgroundColor: colors.primary }]}
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={colors.errorText}
        />
        <Text style={[styles.errorText, { color: colors.errorText }]}>
          {error instanceof Error
            ? error.message
            : t('venues.couldntLoadVenue')}
        </Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: colors.accentPrimary },
          ]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>{t('venues.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = venueDetails.covers || [];

  const locationText = venueDetails.address
    ? `${venueDetails.address.street} ${venueDetails.address.houseNumber}, ${venueDetails.address.city} - ${venueDetails.address.stateOrProvince}`
    : 'N/A';

  const plans = venueDetails.plans || [];

  const maxVisitsPerMonth =
    plans.length > 0
      ? Math.max(...plans.map((plan: Plan) => plan.limit || 0))
      : 0;

  const coordinates = venueDetails.location?.coordinates || [0, 0];
  const latitude = coordinates[1];
  const longitude = coordinates[0];
  const handleNavigateToClasses = () => {
    router.push({
      pathname: '/(features)/classes/[id]',
      params: { id: venueDetails.id },
    });
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.primary,
            opacity: headerOpacity,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, { color: colors.textPrimary }]}>
          {venueDetails.name}
        </Text>
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={handleToggleFavorite}
          disabled={favoritesLoading}
          activeOpacity={1}
        >
          {favoritesLoading ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <Ionicons
              name={isFavoriteState ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavoriteState ? '#FF3B30' : 'white'}
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <GenericImageCarousel
          images={images}
          onFavoritePress={handleToggleFavorite}
          isFavorite={isFavoriteState}
          isLoading={favoritesLoading}
          showFavoriteButton={true}
          showBackButton={true}
          onBackPress={() => router.back()}
        />

        <View style={styles.venueNameContainer}>
          <Text style={[styles.venueName, { color: colors.textPrimary }]}>
            {venueDetails.name}
          </Text>
          <View style={styles.ratingContainer}>
            {/* <StarRating rating={4.7} size={18} /> */}
            {/* <Text style={[styles.ratingsText, { color: colors.textSecondary }]}>
              4.7 (67)
            </Text> */}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.about')}
          </Text>
          <Text
            style={[styles.sectionText, { color: colors.textSecondary }]}
            numberOfLines={showFullDescription ? undefined : 3}
          >
            {venueDetails.description || t('common.noResults')}
          </Text>
          {venueDetails.description?.length > 120 && (
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={[styles.readMore, { color: colors.accentPrimary }]}>
                {showFullDescription
                  ? t('venues.showLess')
                  : t('venues.showMore')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.details')}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="location-outline"
                size={22}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
                {t('classes.location')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {venueDetails.address
                  ? `${venueDetails.address.street} ${venueDetails.address.houseNumber}, ${venueDetails.address.city}`
                  : t('common.noResults')}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
                {t('venues.hours')}
              </Text>
              {venueDetails.openingHours &&
              venueDetails.openingHours.length > 0 ? (
                venueDetails.openingHours.map((hour, index) => (
                  <Text
                    key={`hour-${index}`}
                    style={[styles.infoValue, { color: colors.textSecondary }]}
                  >
                    {hour}
                  </Text>
                ))
              ) : (
                <Text
                  style={[styles.infoValue, { color: colors.textSecondary }]}
                >
                  {t('common.noResults')}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="call-outline"
                size={22}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
                {t('venues.phone')}
              </Text>
              {venueDetails.contacts && venueDetails.contacts.length > 0 ? (
                venueDetails.contacts.map((contact, index) => (
                  <Text
                    key={`contact-${index}`}
                    style={[styles.infoValue, { color: colors.textSecondary }]}
                  >
                    {contact}
                  </Text>
                ))
              ) : (
                <Text
                  style={[styles.infoValue, { color: colors.textSecondary }]}
                >
                  {t('common.noResults')}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Ionicons
                name="globe-outline"
                size={22}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
                {t('venues.website')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                {venueDetails?.websiteUrl || t('common.noResults')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.amenities')}
          </Text>
          <View style={styles.activitiesContainer}>
            {venueDetails?.categories && venueDetails.categories?.length > 0 ? (
              venueDetails.categories.map((activity: string, index: number) => (
                <ActivityChip
                  key={`activity-${index}`}
                  title={activity}
                  style={{ marginRight: 8, marginBottom: 8 }}
                />
              ))
            ) : (
              <Text
                style={[styles.sectionText, { color: colors.textSecondary }]}
              >
                {t('common.noResults')}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.importantInfo')}
          </Text>
          <Text
            style={[styles.sectionText, { color: colors.textSecondary }]}
            numberOfLines={showImportantInfo ? undefined : 3}
          >
            {venueDetails?.importantInfo || t('common.noResults')}
          </Text>
          <TouchableOpacity onPress={toggleImportantInfo}>
            <Text style={[styles.readMore, { color: colors.accentPrimary }]}>
              {showImportantInfo ? t('venues.showLess') : t('venues.showMore')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('venues.availableIn')}
          </Text>
          {plans.length > 0 ? (
            <View style={styles.plansContainer}>
              {plans.map((plan: Plan, index: number) => (
                <PlanChip
                  key={`plan-${index}`}
                  plan={plan}
                  style={{ marginBottom: 12 }}
                />
              ))}
            </View>
          ) : (
            <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
              {t('common.noResults')}
            </Text>
          )}
        </View>

        {plans.length > 0 && (
          <View
            style={[
              styles.sectionContainer,
              styles.visitLimitsContainer,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('venues.maxVisitsPerMonth')}
            </Text>
            <View style={styles.visitsRow}>
              <Text style={[styles.visitsText, { color: colors.textPrimary }]}>
                0 / {maxVisitsPerMonth} {t('schedule.booked')}
              </Text>
              <View style={styles.visitsLimitBadge}>
                <Text style={styles.visitsLimitText}>
                  {t('plans.perMonth')}
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${(0 / maxVisitsPerMonth) * 100}%`,
                    backgroundColor: colors.accentPrimary,
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabelsContainer}>
              <Text
                style={[styles.progressLabel, { color: colors.textSecondary }]}
              >
                0
              </Text>
              <Text
                style={[styles.progressLabel, { color: colors.textSecondary }]}
              >
                {maxVisitsPerMonth}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('classes.location')}
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.00008,
                longitudeDelta: 0.00008,
              }}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={venueDetails.name}
                description={locationText}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={36}
                  color={colors.pinColor}
                  style={styles.markerIcon}
                />
              </Marker>
            </MapView>
          </View>
          <Text style={[styles.addressText, { color: colors.textSecondary }]}>
            {venueDetails.address
              ? `${venueDetails.address.street} ${venueDetails.address.houseNumber}, ${venueDetails.address.city} - ${venueDetails.address.stateOrProvince}`
              : t('common.noResults')}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <View
        style={[
          styles.scheduleButtonContainer,
          { backgroundColor: colors.primary },
        ]}
      >
        <View style={styles.scheduleButtonWrapper}>
          <TouchableOpacity
            onPress={() => handleNavigateToClasses()}
            style={[
              styles.scheduleButton,
              { backgroundColor: colors.accentPrimary },
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.scheduleButtonText}>
              {t('venues.goToClasses')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  venueNameContainer: {
    padding: 16,
    paddingTop: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsText: {
    marginLeft: 8,
    fontSize: 14,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  visitLimitsContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  visitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  visitsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitsLimitBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitsLimitText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
  },
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressText: {
    fontSize: 14,
    marginTop: 8,
  },
  scheduleButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    zIndex: 10,
  },
  scheduleButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scheduleButton: {
    height: 44,
    width: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  fixedHeaderButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  markerIcon: {
    height: 36,
    width: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  plansContainer: {
    width: '100%',
  },
});
