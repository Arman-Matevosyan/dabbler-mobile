import {
  BookingConfirmationPanel,
  BookingStatusBottomSheet,
  CancellationConfirmationPanel,
} from '@/components/classes';
import GenericImageCarousel from '@/components/shared/GenericImageCarousel';
import { Colors } from '@/constants/Colors';
import { darkMapStyle } from '@/constants/MapColors';
import { ClassQueryKeys } from '@/constants/QueryKeys';
import { useMyschedules, useTooltip, useUser } from '@/hooks';
import { useDetailedClassDetails } from '@/hooks/content';
import { queryClient } from '@/lib/queryClient';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as Calendar from 'expo-calendar';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

interface ScheduledClass {
  id: string;
  scheduled: boolean;
}

export default function ClassDetailsScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const date = typeof params.date === 'string' ? params.date : undefined;
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];
  const { t } = useTranslation();
  const { showError, showSuccess } = useTooltip();
  const { isAuthenticated } = useUser();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {
    classData,
    isLoading: classLoading,
    error,
    refetch,
  } = useDetailedClassDetails({ id, date });
  const [isBookingPanelVisible, setIsBookingPanelVisible] = useState(false);
  const [isCancellationPanelVisible, setIsCancellationPanelVisible] =
    useState(false);
  const [showSuccessBottomSheet, setShowSuccessBottomSheet] = useState(false);
  const [showCancelBottomSheet, setShowCancelBottomSheet] = useState(false);
  const { data: schedulesData, refetch: refetchSchedules } = useMyschedules();
  console.log(schedulesData, classData);
  const isClassBooked = useMemo(() => {
    if (!schedulesData || !classData) return false;

    return schedulesData.some((schedule) => schedule.classId === classData.id);
  }, [schedulesData, classData]);

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

  useEffect(() => {
    refetchSchedules();
  }, [refetchSchedules]);

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

  const handleCancelBooking = () => {
    if (!isAuthenticated) {
      showError(t('classes.authentication'), t('classes.loginToCancel'));
      return;
    }
    setIsCancellationPanelVisible(true);
  };

  const handleCancellationSuccess = () => {
    setIsCancellationPanelVisible(false);

    if (schedulesData && classData) {
      const newSchedulesData = schedulesData.map((schedule) => {
        if (schedule.classId === classData.id) {
          return { ...schedule, status: 'cancelled' };
        }
        return schedule;
      });

      queryClient.setQueryData([ClassQueryKeys.schedules], newSchedulesData);
    }

    setShowCancelBottomSheet(true);

    Promise.all([refetchSchedules(), refetch()]).catch((error) => {
      console.error('Error refetching data after cancellation:', error);
    });
  };

  const handleBookingSuccess = () => {
    setIsBookingPanelVisible(false);

    if (schedulesData && classData) {
      const existingSchedule = schedulesData.find(
        (schedule) => schedule.classId === classData.id
      );

      let newSchedulesData = [...schedulesData];

      if (!existingSchedule) {
        newSchedulesData.push({
          id: crypto.randomUUID(),
          classId: classData.id,
          className: classData.name,
          venueId: classData.venue?.id || '',
          venueName: classData.venue?.name || '',
          startDate: classData.date || '',
          duration: classData.duration || 0,
          status: 'active',
        });
      } else {
        newSchedulesData = newSchedulesData.map((schedule) => {
          if (schedule.classId === classData.id) {
            return { ...schedule, status: 'active' };
          }
          return schedule;
        });
      }

      queryClient.setQueryData([ClassQueryKeys.schedules], newSchedulesData);
    }

    setShowSuccessBottomSheet(true);

    Promise.all([refetchSchedules(), refetch()]).catch((error) => {
      console.error('Error refetching data after booking:', error);
    });
  };

  const handleAddToCalendar = async () => {
    if (!classData || !classData.date) {
      showError(
        t('common.error'),
        t('classes.noDateForCalendar', 'Class date information is missing')
      );
      return;
    }

    try {
      const classStartDate = new Date(classData.date);
      if (isNaN(classStartDate.getTime())) {
        showError(
          t('common.error'),
          t('classes.invalidDate', 'Invalid class date format')
        );
        return;
      }

      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        showError(
          t('common.permissionDenied'),
          t(
            'classes.calendarPermissionDenied',
            'Calendar permission is required to add this class to your calendar'
          )
        );
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      let defaultCalendar;

      if (Platform.OS === 'ios') {
        defaultCalendar = calendars.find(
          (cal: any) =>
            cal.allowsModifications && cal.source?.name === 'Default'
        );

        if (!defaultCalendar) {
          defaultCalendar = calendars.find(
            (cal: any) =>
              cal.allowsModifications && cal.source?.name === 'iCloud'
          );
        }
      } else {
        defaultCalendar = calendars.find(
          (cal: any) =>
            cal.allowsModifications &&
            cal.accessLevel === Calendar.CalendarAccessLevel.OWNER &&
            cal.source?.type === 'com.google'
        );
      }

      if (!defaultCalendar) {
        defaultCalendar = calendars.find((cal: any) => cal.allowsModifications);
      }

      if (!defaultCalendar && calendars.length > 0) {
        defaultCalendar = calendars[0];
      }

      if (!defaultCalendar) {
        showError(
          t('common.error'),
          t(
            'classes.noCalendarAvailable',
            'No calendar found on your device. Please make sure you have a calendar app installed.'
          )
        );
        return;
      }

      const classEndDate = new Date(
        classStartDate.getTime() + (classData.duration || 60) * 60000
      );

      const eventDetails: any = {
        title: classData.name || 'Class Booking',
        startDate: classStartDate,
        endDate: classEndDate,
        location: classData.venue?.name || '',
        notes:
          classData.description ||
          t('classes.bookingConfirmed', 'Booking confirmed'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      if (Platform.OS === 'ios') {
        eventDetails.alarms = [
          { relativeOffset: -60 }, // 1 hour before
        ];
      } else {
        eventDetails.alarms = [
          { relativeOffset: -60 }, // 1 hour before
        ];
      }

      const eventId = await Calendar.createEventAsync(
        defaultCalendar.id,
        eventDetails
      );

      if (eventId) {
        setShowSuccessBottomSheet(false);

        showSuccess(
          t(
            'classes.calendarEventCreated',
            'Class has been added to your calendar'
          )
        );
      } else {
        throw new Error('Failed to create event: no event ID returned');
      }
    } catch (error: any) {
      console.error('Error adding event to calendar:', error);

      // Check if error is permission related
      if (
        error?.message &&
        typeof error.message === 'string' &&
        error.message.includes('permission')
      ) {
        showError(
          t('common.error'),
          t(
            'classes.calendarPermissionDenied',
            'Calendar permission is required to add this class to your calendar'
          )
        );
      } else {
        showError(
          t('common.error'),
          t(
            'classes.calendarAddError',
            'Could not add to calendar: ' + (error?.message || 'unknown error')
          )
        );
      }
    }
  };

  if (classLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeScreen}
            activeOpacity={1}
          >
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={closeScreen}
            activeOpacity={1}
          >
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
            activeOpacity={1}
          >
            <Text style={styles.tryAgainButtonText}>{t('classes.goBack')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Format date and time if available
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

  // Calculate cancellation deadline - only if we have a valid date
  let cancelDateStr = '';
  if (classData.date) {
    const cancelMinutes = 240; // Default to 4 hours
    const classDate = new Date(classData.date);
    if (!isNaN(classDate.getTime())) {
      const cancelDate = new Date(classDate.getTime() - cancelMinutes * 60000);
      cancelDateStr = format(cancelDate, 'EEE, d MMM HH:mm');
    }
  }

  const availableSpots = classData.scheduledSpots ?? 0;
  const totalSpots = classData.totalSpots || 0;

  let spotDisplay;
  if (classData.isFree) {
    spotDisplay = t('classes.free');
  } else {
    const remainingSpots = totalSpots - availableSpots;
    spotDisplay = `${remainingSpots} / ${totalSpots} ${t('classes.spotsLeft')}`;
  }

  // render the map
  const renderMap = () => {
    if (!classData.location) {
      return (
        <View style={styles.noMapContainer}>
          <Ionicons name="map-outline" size={60} color={colors.textSecondary} />
          <Text style={[styles.noMapText, { color: colors.textSecondary }]}>
            {t('classes.mapNotAvailable')}
          </Text>
        </View>
      );
    }

    const lat = classData.location.coordinates[1];
    const lng = classData.location.coordinates[0];

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: lat,
            longitude: lng,
          }}
          title={classData.venue?.name || ''}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={40}
            color={colors.tint}
          />
        </Marker>
      </MapView>
    );
  };

  const goToVenue = () => {
    if (classData.venue && classData.venue.id) {
      router.push({
        pathname: '/venues/[id]',
        params: { id: classData.venue.id },
      });
    }
  };

  const coverImageUrl =
    classData.venue && classData.venue.id
      ? `https://picsum.photos/400/200?random=${classData.venue.id}`
      : 'https://picsum.photos/400/200';

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
          activeOpacity={1}
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

          {/* Show booking confirmation UI if booked but not when showing bottom sheets */}
          {isClassBooked &&
            !showSuccessBottomSheet &&
            !showCancelBottomSheet && (
              <View style={styles.bookingConfirmedContainer}>
                <View style={styles.bookingConfirmedHeader}>
                  <Text style={styles.bookingConfirmedTitle}>
                    {t('classes.bookingConfirmed', 'Booking confirmed')}
                  </Text>
                </View>
                <View style={styles.bookingConfirmedContent}>
                  <Text style={styles.bookingConfirmedMessage}>
                    {t(
                      'classes.bookingConfirmedMessage',
                      "See you soon! Please check the venue or class details to ensure you're fully prepared for the session."
                    )}
                  </Text>
                  <TouchableOpacity
                    style={styles.addToCalendarButton}
                    onPress={handleAddToCalendar}
                    activeOpacity={1}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.addToCalendarText}>
                      {t('classes.addToCalendar', 'Add to Calendar')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          {/* Show cancellation info when booked but not when showing bottom sheets */}
          {isClassBooked &&
            !showSuccessBottomSheet &&
            !showCancelBottomSheet &&
            cancelDateStr && (
              <View style={styles.cancellationInfoContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#3B82F6"
                />
                <Text style={styles.cancellationInfoText}>
                  {t(
                    'classes.cancelBefore',
                    'Cancel before {{date}} to avoid fees',
                    { date: cancelDateStr }
                  )}
                </Text>
              </View>
            )}

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
              <TouchableOpacity activeOpacity={1}>
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
                activeOpacity={1}
                style={styles.sectionAction}
                onPress={goToVenue}
              >
                <Text style={styles.viewMoreText}>{t('venues.viewMore')}</Text>
              </TouchableOpacity>
            </View>

            {classData.venue && (
              <TouchableOpacity
                style={styles.venueCard}
                onPress={goToVenue}
                activeOpacity={1}
              >
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
          </View>

          {classData.importantInfo && (
            <View style={styles.sectionContainer}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                {t('classes.importantInfo', 'Important Info')}
              </Text>
              <Text
                style={[
                  styles.descriptionText,
                  { color: colors.textSecondary },
                ]}
              >
                {classData.importantInfo}
              </Text>
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
        {!isClassBooked ? (
          <>
            <Text style={[styles.spotsText, { color: colors.textPrimary }]}>
              {spotDisplay}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.bookButton,
                {
                  backgroundColor:
                    availableSpots !== totalSpots
                      ? colors.tint
                      : colors.secondary,
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
          </>
        ) : (
          <View style={styles.bookedActionsContainer}>
            <Text
              style={[styles.bookedStatusText, { color: colors.textPrimary }]}
            >
              {t('schedule.booked')}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.cancelButton, { backgroundColor: '#FF3B30' }]}
              onPress={handleCancelBooking}
            >
              <Text style={styles.bookButtonText}>
                {t('classes.cancelBooking', 'Cancel Booking')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {classData && (
        <>
          <BookingStatusBottomSheet
            visible={showSuccessBottomSheet}
            onClose={() => {
              setShowSuccessBottomSheet(false);
              // Refresh data again when closing the sheet
              refetchSchedules();
              refetch();
            }}
            type="success"
            colors={{
              background: colors.background,
              textPrimary: colors.textPrimary,
              textSecondary: colors.textSecondary,
              successColor: '#4CAF50',
              buttonColor: colors.tint,
              backdropColor: 'rgba(0,0,0,0.7)',
            }}
            classData={{
              name: classData.name,
              date: classData.date || undefined,
              venue: {
                name: classData.venue?.name || undefined,
              },
            }}
            onAddToCalendar={handleAddToCalendar}
          />

          <BookingStatusBottomSheet
            visible={showCancelBottomSheet}
            onClose={() => {
              setShowCancelBottomSheet(false);
              // Refresh data again when closing the sheet
              refetchSchedules();
              refetch();
            }}
            type="cancelled"
            colors={{
              background: colors.background,
              textPrimary: colors.textPrimary,
              textSecondary: colors.textSecondary,
              successColor: '#4CAF50',
              errorColor: '#FF3B30',
              buttonColor: colors.tint,
              backdropColor: 'rgba(0,0,0,0.7)',
            }}
            classData={{
              name: classData.name,
              date: classData.date || undefined,
              venue: {
                name: classData.venue?.name || undefined,
              },
            }}
          />
        </>
      )}

      {isBookingPanelVisible && classData && (
        <BookingConfirmationPanel
          visible={isBookingPanelVisible}
          onClose={() => setIsBookingPanelVisible(false)}
          classData={classData}
          classDetail={classData}
          colors={colors}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {isCancellationPanelVisible && classData && (
        <CancellationConfirmationPanel
          visible={isCancellationPanelVisible}
          onClose={() => setIsCancellationPanelVisible(false)}
          classData={classData}
          classDetail={classData}
          colors={{ ...colors, errorColor: '#FF3B30' }}
          onCancellationSuccess={handleCancellationSuccess}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  tryAgainButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 24,
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
  sectionAction: {},
  viewMoreText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMoreText: {
    marginTop: 8,
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  venueCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  venueImage: {
    width: 100,
    height: 100,
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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  noMapContainer: {
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMapText: {
    marginTop: 12,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  spotsText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bookButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  // Booking confirmed styling
  bookingConfirmedContainer: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  bookingConfirmedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222429',
    padding: 16,
  },
  bookingConfirmedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bookingConfirmedContent: {
    padding: 16,
    backgroundColor: '#2A2C32',
  },
  bookingConfirmedMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  addToCalendarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancellationInfoContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  cancellationInfoText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 8,
    flex: 1,
  },
  // Booked actions styling
  bookedActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookedStatusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
