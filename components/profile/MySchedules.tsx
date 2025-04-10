import Skeleton from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useMyschedules } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GirlDoingYoga from '../svg/GirlYoga';
import { ThemedText } from '../ui/ThemedText';

interface ScheduleItem {
  id: string;
  date: string;
  name: string;
  duration: number;
  venue?: {
    name: string;
    address?: {
      street?: string;
      city?: string;
    };
  };
  covers: any[];
  instructorInfo: string;
  instructorName?: string; // Added for compatibility
  categories: string[];
  level?: string;
  scheduled: boolean;
  scheduledSpots: number;
  totalSpots: number;
  location?: {
    type: string;
    coordinates: number[];
  };
  cancellationPeriodInMinutes?: number;
}

export const MySchedules = () => {
  const { data, isLoading, refetch } = useMyschedules();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Skeleton width={120} height={24} style={styles.skeletonHeader} />
          </View>

          <View style={styles.divider} />

          <View style={styles.schedulesContainer}>
            {[1, 2].map((_, index) => (
              <View key={index} style={styles.scheduleItem}>
                <View style={styles.imageContainer}>
                  <Skeleton width={80} height={80} borderRadius={6} />
                </View>

                <View style={styles.classDetails}>
                  <Skeleton
                    width={150}
                    height={18}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton
                    width={180}
                    height={14}
                    style={{ marginBottom: 8 }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        marginRight: 6,
                        backgroundColor: '#CCCCCC',
                        opacity: 0.5,
                      }}
                    />
                    <Skeleton width={120} height={14} />

                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: '#CCCCCC',
                        opacity: 0.5,
                        marginLeft: 'auto',
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        marginRight: 6,
                        backgroundColor: '#CCCCCC',
                        opacity: 0.5,
                      }}
                    />
                    <Skeleton width={100} height={14} />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  const schedules = data as ScheduleItem[] | undefined;
  const hasSchedules = schedules && schedules.length > 0;

  if (!hasSchedules) {
    return (
      <View style={styles.emptyStateContainer}>
        <GirlDoingYoga width={200} height={200} />

        <Text style={styles.noClassesTitle}>
          {t('schedule.noUpcomingClasses')}
        </Text>

        <Text style={styles.noClassesMessage}>
          {t('schedule.emptyStateMessage')}
        </Text>
      </View>
    );
  }

  const navigateToClassDetails = (schedule: ScheduleItem) => {
    router.push({
      pathname: '/classes/details/[id]',
      params: { id: schedule.id, date: schedule.date },
    });
  };

  const openGoogleMaps = (schedule: ScheduleItem) => {
    // Check if location coordinates are available
    if (
      schedule.location?.coordinates &&
      schedule.location.coordinates.length === 2
    ) {
      const [longitude, latitude] = schedule.location.coordinates;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        console.error('Error opening Google Maps:', err)
      );
    }
    // If no coordinates but venue name is available, search by venue name
    else if (schedule.venue?.name) {
      const venueQuery = encodeURIComponent(schedule.venue.name);
      const url = `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;
      Linking.openURL(url).catch((err) =>
        console.error('Error opening Google Maps:', err)
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerText}>
            {t('schedule.mySchedules')}
          </ThemedText>
        </View>

        <View style={styles.divider} />

        <View style={styles.schedulesContainer}>
          {schedules.map((schedule, index) => {
            const scheduleDate = new Date(schedule.date);
            const day = format(scheduleDate, 'EEE');
            const monthDay = format(scheduleDate, 'dd MMM');
            const startTime = format(scheduleDate, 'HH:mm');
            const endTime = format(
              new Date(scheduleDate.getTime() + schedule.duration * 60 * 1000),
              'HH:mm'
            );

            // Calculate cancellation deadline
            const cancelMinutes =
              schedule.cancellationPeriodInMinutes || 24 * 60; // Default 24 hours
            const cancelDate = new Date(
              scheduleDate.getTime() - cancelMinutes * 60000
            );
            const cancelDateStr = format(cancelDate, 'EEE, d MMM HH:mm');

            const hasLocationCoordinates = Boolean(
              schedule.location?.coordinates?.length === 2
            );

            return (
              <TouchableOpacity
                key={index}
                style={styles.scheduleItem}
                onPress={() => navigateToClassDetails(schedule)}
                activeOpacity={1}
              >
                <View style={styles.imageContainer}>
                  {schedule.covers && schedule.covers.length > 0 ? (
                    <Image
                      source={{ uri: schedule.covers[0]?.url }}
                      style={styles.classImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.fallbackImage,
                        { backgroundColor: colors.blue },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="dumbbell"
                        size={30}
                        color="#FFF"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.classDetails}>
                  <Text style={styles.className}>
                    {schedule.name || t('schedule.class')}{' '}
                    {schedule.level ? `- ${schedule.level}` : ''}
                  </Text>

                  <Text style={styles.dateTime}>
                    {`${day}, ${monthDay} - ${startTime}-${endTime}`}
                  </Text>

                  <View style={styles.venueContainer}>
                    <Text style={styles.venue}>
                      {schedule.venue?.name || ''}
                    </Text>

                    {/* Map button - always show it */}
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(schedule);
                      }}
                    >
                      <Ionicons
                        name="map-outline"
                        size={20}
                        color={colors.tint}
                      />
                    </TouchableOpacity>
                  </View>

                  {schedule.instructorInfo && (
                    <View style={styles.instructorContainer}>
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color="#CCCCCC"
                      />
                      <Text style={styles.instructor}>
                        {schedule.instructorInfo ||
                          schedule.instructorName ||
                          t('classes.instructor')}
                      </Text>
                    </View>
                  )}

                  {schedule.categories && schedule.categories.length > 0 && (
                    <View style={styles.categoryContainer}>
                      <MaterialCommunityIcons
                        name="tag-outline"
                        size={16}
                        color="#CCCCCC"
                      />
                      <Text style={styles.category}>
                        {schedule.categories.join(' ')}
                      </Text>
                    </View>
                  )}

                  {/* Booked status */}
                  <View style={styles.statusContainer}>
                    <View style={styles.bookedStatusDot} />
                    <Text style={styles.bookedStatusText}>
                      {t('schedule.booked')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeletonHeader: {
    marginVertical: 10,
  },
  loader: {
    marginVertical: 20,
  },
  header: {
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  schedulesContainer: {
    marginTop: 16,
  },
  // Empty state styling
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  noClassesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noClassesMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  classImage: {
    width: '100%',
    height: '100%',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  venue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    flex: 1,
  },
  mapButton: {
    padding: 4,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  // Booked status styling
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookedStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50', // Green color for booked status
    marginRight: 6,
  },
  bookedStatusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4CAF50',
  },
});
