import { BookingConfirmationPanel } from '@/components/classes';
import GenericImageCarousel from '@/components/shared/GenericImageCarousel';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapColors';
import { useTooltip, useUserProfile } from '@/hooks';
import { useClassDetails } from '@/hooks/classes/useClassDetails';
import { useTheme } from '@/providers/ThemeContext';
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function ClassDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const date = typeof params.date === 'string' ? params.date : undefined;
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];
  const { t } = useTranslation();
  const { showError } = useTooltip();
  const { isAuthenticated } = useUserProfile();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {
    classData,
    isLoading: classLoading,
    error,
  } = useClassDetails({ id, date });
  const [isBookingPanelVisible, setIsBookingPanelVisible] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.timing(scrollY, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  const closeScreen = () => {
    Animated.timing(scrollY, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const handleBookClass = () => {
    if (!isAuthenticated) {
      showError(t('classes.authentication'), t('classes.loginToBook'));
      return;
    }
    setIsBookingPanelVisible(true);
  };

  if (classLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.backButton} onPress={closeScreen}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('classes.classDetails')}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('classes.loadingClassDetails')}
          </Text>
        </View>
      </View>
    );
  }

  if (error || !classData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.backButton} onPress={closeScreen}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('classes.classDetails')}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#E53E3E" />
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
            {t('classes.unableToLoadClass')}
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {error instanceof Error ? error.message : t('common.error')}
          </Text>
          <TouchableOpacity
            style={[styles.tryAgainButton, { backgroundColor: colors.tint }]}
            onPress={closeScreen}
          >
            <Text style={styles.tryAgainButtonText}>{t('classes.goBack')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  let formattedDate = '';
  let formattedTimeRange = '';

  if (classData.date) {
    const classDate = new Date(classData.date);
    formattedDate = format(classDate, 'EEE, dd MMM');

    const startTime = format(classDate, 'HH:mm');
    let endTime = '';

    if (classData.duration) {
      const endDateTime = new Date(
        classDate.getTime() + classData.duration * 60000
      );
      endTime = format(endDateTime, 'HH:mm');
      formattedTimeRange = `${startTime} - ${endTime}`;
    } else {
      formattedTimeRange = startTime;
    }
  }

  const availableSpots = classData.scheduledSpots ?? 0;
  const totalSpots = classData.totalSpots || 0;
  const spotDisplay = `${availableSpots}/${totalSpots} ${t(
    'classes.spotsLeft'
  )}`;
  const coverImageUrl =
    classData.covers && classData.covers.length > 0
      ? classData.covers[0].url || classData.covers[0].uri
      : 'https://images.unsplash.com/photo-1518611012118-696072aa579a';
  const goToVenue = () => {
    if (classData.venue && classData.venue.id) {
      router.push(`/venues/${classData.venue.id}`);
    }
  };

  const openWebsite = () => {
    if (classData.venue && classData.venue.websiteUrl) {
      Linking.openURL(classData.venue.websiteUrl);
    }
  };

  const renderMap = () => {
    const latitude = classData?.location?.coordinates[1];
    const longitude = classData?.location?.coordinates[0];
    if (!longitude || !latitude) {
      return (
        <View
          style={[styles.mapContainer, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.noMapText, { color: colors.textSecondary }]}>
            {t('classes.mapNotAvailable')}
          </Text>
        </View>
      );
    }

    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={classData.venue?.name || ''}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={38}
            color={colors.pinColor}
          />
        </Marker>
      </MapView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={closeScreen}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, { color: colors.textPrimary }]}>
          {classData.name}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.galleryContainer}>
          <GenericImageCarousel
            images={classData.covers || []}
            height={300}
            showBackButton={true}
            onBackPress={closeScreen}
          />
        </View>

        <View style={styles.infoContainer}>
          {classData.date && (
            <View style={styles.dateTimeContainer}>
              <Ionicons
                name="calendar-outline"
                size={22}
                color={colors.textPrimary}
                style={styles.infoIcon}
              />
              <Text style={[styles.dateText, { color: colors.textPrimary }]}>
                {formattedDate}
              </Text>
              <Ionicons
                name="time-outline"
                size={22}
                color={colors.textPrimary}
                style={[styles.infoIcon, { marginLeft: 16 }]}
              />
              <Text style={[styles.timeText, { color: colors.textPrimary }]}>
                {formattedTimeRange}
              </Text>
            </View>
          )}

          <Text style={[styles.className, { color: colors.textPrimary }]}>
            {classData.name}
          </Text>

          <View style={styles.instructorContainer}>
            <Ionicons name="person" size={18} color={colors.textPrimary} />
            <Text
              style={[styles.instructorText, { color: colors.textPrimary }]}
            >
              {classData.instructorName || t('classes.instructor')}
            </Text>
          </View>

          {classData.description && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  {t('classes.aboutClass')}
                </Text>
              </View>
              <Text
                style={[
                  styles.descriptionText,
                  { color: colors.textSecondary },
                ]}
              >
                {classData.description}
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMoreText}>{t('venues.showMore')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                {t('venues.details')}
              </Text>
              <TouchableOpacity
                style={styles.sectionAction}
                onPress={goToVenue}
              >
                <Text style={styles.viewMoreText}>{t('venues.viewMore')}</Text>
              </TouchableOpacity>
            </View>

            {classData.venue && (
              <TouchableOpacity style={styles.venueCard} onPress={goToVenue}>
                {classData.venue.id && (
                  <Image
                    source={{ uri: coverImageUrl }}
                    style={styles.venueImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.venueDetails}>
                  <Text
                    style={[styles.venueName, { color: colors.textPrimary }]}
                  >
                    {classData.venue.name}
                  </Text>
                  {classData.venue.address && (
                    <>
                      <Text
                        style={[
                          styles.venueAddress,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {classData.venue.address.street || ''}{' '}
                        {classData.venue.address.postalCode || ''}
                      </Text>
                      <Text
                        style={[
                          styles.venueCity,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {classData.venue.address.city || ''} -{' '}
                        {classData.venue.address.country || ''}
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {classData.venue && classData.venue.openingHours && (
              <View style={styles.metadataItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.tint}
                  style={styles.metadataIcon}
                />
                <Text
                  style={[styles.metadataText, { color: colors.textPrimary }]}
                >
                  {t('venues.openingHours')}: Die Öffnungszeiten hängen von de...
                </Text>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={colors.tint}
                  style={{ marginLeft: 8 }}
                />
              </View>
            )}

            <View style={styles.ratingsContainer}>
              <View style={styles.starsContainer}>
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={colors.textSecondary}
                />
                <Ionicons
                  name="star-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <Text
                style={[styles.ratingsText, { color: colors.textSecondary }]}
              >
                {t('venues.noRatingsYet')}
              </Text>
            </View>

            {classData.venue && classData.venue.websiteUrl && (
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={openWebsite}
              >
                <Entypo name="globe" size={20} color={colors.tint} />
                <Text style={styles.websiteText}>{t('venues.website')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {classData.importantInfo && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[styles.sectionTitle, { color: colors.textPrimary }]}
                >
                  {t('venues.importantInfo')}
                </Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {classData.importantInfo}
              </Text>

              {classData.date && (
                <View style={styles.cancellationContainer}>
                  <Text
                    style={[
                      styles.cancellationLabel,
                      { color: colors.textPrimary },
                    ]}
                  >
                    {t('classes.cancellationPeriod')}
                  </Text>
                  <Text
                    style={[
                      styles.cancellationValue,
                      { color: colors.textPrimary },
                    ]}
                  >
                    11 {t('classes.hours')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {!classData.isFree && (
            <View style={styles.sectionContainer}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                {t('classes.visitLimits')}
              </Text>

              <View style={styles.visitsCard}>
                <View style={styles.visitsHeader}>
                  <Text
                    style={[styles.visitsTitle, { color: colors.textPrimary }]}
                  >
                    {t('classes.totalVisits')}
                  </Text>
                  <View style={styles.visitPeriodBadge}>
                    <Text style={styles.visitPeriodText}>{t('classes.perMonth')}</Text>
                  </View>
                </View>

                <Text
                  style={[styles.visitsCount, { color: colors.textPrimary }]}
                >
                  {spotDisplay}
                </Text>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '0%' }]} />
                  </View>
                  <View style={styles.progressLabels}>
                    <Text
                      style={[
                        styles.progressLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {availableSpots}
                    </Text>
                    <Text
                      style={[
                        styles.progressLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {totalSpots}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('classes.location')}
            </Text>

            <TouchableOpacity style={styles.mapContainer} activeOpacity={1}>
              {renderMap()}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>

      <View
        style={[
          styles.footerContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.spotsText, { color: colors.textPrimary }]}>
          {spotDisplay}
        </Text>
        <TouchableOpacity
          style={[
            styles.bookButton,
            {
              backgroundColor:
                availableSpots !== totalSpots ? colors.tint : colors.secondary,
            },
          ]}
          onPress={handleBookClass}
          disabled={availableSpots === totalSpots}
        >
          <Text style={styles.bookButtonText}>
            {availableSpots !== totalSpots
              ? t('classes.bookClass')
              : t('schedule.booked')}
          </Text>
        </TouchableOpacity>
      </View>

      {isBookingPanelVisible && (
        <BookingConfirmationPanel
          visible={isBookingPanelVisible}
          onClose={() => setIsBookingPanelVisible(false)}
          classData={classData}
          classDetail={classData}
          colors={colors}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 100,
    borderBottomWidth: 1,
  },
  fixedHeaderButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  galleryContainer: {
    position: 'relative',
  },
  coverImage: {
    width: width,
    height: width * 0.6,
  },
  galleryIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  galleryIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  instructorText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionContainer: {
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    padding: 4,
  },
  viewMoreText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  readMoreText: {
    color: '#3B82F6',
    fontSize: 14,
    marginTop: 4,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  venueImage: {
    width: 80,
    height: 80,
  },
  venueDetails: {
    flex: 1,
    padding: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  venueCity: {
    fontSize: 14,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metadataIcon: {
    marginRight: 10,
    width: 24,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 14,
    flex: 1,
  },
  ratingsContainer: {
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingsText: {
    fontSize: 14,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteText: {
    color: '#3B82F6',
    fontSize: 14,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  cancellationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancellationLabel: {
    fontSize: 15,
  },
  cancellationValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  visitsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  visitsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitPeriodBadge: {
    backgroundColor: 'rgba(72, 187, 120, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  visitPeriodText: {
    color: '#48BB78',
    fontSize: 12,
  },
  visitsCount: {
    fontSize: 15,
    marginBottom: 12,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  noMapText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  spotsText: {
    fontSize: 16,
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  tryAgainButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  tryAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
