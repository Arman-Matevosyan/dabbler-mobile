import Skeleton from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useMyschedules } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import GirlDoingYoga from '../svg/GirlYoga';
import { ThemedText } from '../ui/ThemedText';

interface ScheduleItem {
  id: string;
  date: string;
  name: string;
  duration: number;
  venue?: {
    name: string;
  };
  covers: string[];
  instructorInfo: string;
  categories: string[];
  level?: string;
  scheduled: boolean;
  scheduledSpots: number;
  totalSpots: number;
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
                  <Skeleton
                    width={100}
                    height={14}
                    style={{ marginBottom: 8 }}
                  />
                  <Skeleton width={120} height={14} />
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
            const monthDay = format(scheduleDate, 'MMM d');
            const startTime = format(scheduleDate, 'HH:mm');
            const endTime = format(
              new Date(scheduleDate.getTime() + schedule.duration * 60 * 1000),
              'HH:mm'
            );

            return (
              <View key={index} style={styles.scheduleItem}>
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

                  <Text style={styles.venue}>{schedule.venue?.name || ''}</Text>

                  {schedule.instructorInfo && (
                    <View style={styles.instructorContainer}>
                      <MaterialCommunityIcons
                        name="account"
                        size={16}
                        color="#CCCCCC"
                      />
                      <Text style={styles.instructor}>
                        {schedule.instructorInfo}
                      </Text>
                    </View>
                  )}

                  {schedule.categories && schedule.categories.length > 0 && (
                    <View style={styles.categoryContainer}>
                      <MaterialCommunityIcons
                        name="tag"
                        size={16}
                        color="#CCCCCC"
                      />
                      <Text style={styles.category}>
                        {schedule.categories.join(' ')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
  // Empty state styling - like image 1
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  blobContainer: {
    width: 160,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
    overflow: 'hidden',
  },
  dumbbellsContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  dumbbell1: {
    position: 'absolute',
    top: '25%',
    left: '35%',
    transform: [{ rotate: '-30deg' }],
  },
  dumbbell2: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    transform: [{ rotate: '0deg' }],
  },
  dumbbell3: {
    position: 'absolute',
    top: '65%',
    left: '35%',
    transform: [{ rotate: '30deg' }],
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
  venue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
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
  },
  category: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
});
