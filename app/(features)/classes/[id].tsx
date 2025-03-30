import {
    ClassCard,
    DateSelector,
    EmptyState,
    SkeletonCard,
} from '@/components/classes';
import { Colors } from '@/constants/Colors';
import { useVenueClasses } from '@/hooks/classes/useVenueClasses';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { addDays } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function VenueClassesPage() {
  const { id } = useLocalSearchParams();
  const venueId = typeof id === 'string' ? id : '';
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<Date[]>([]);
  
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
      velocity: 6
    }).start();
  }, []);

  const closeScreen = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0]
  });

  useEffect(() => {
    const generateDateRange = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i <= 6; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }

      setDateRange(dates);
    };

    generateDateRange();
  }, []);

  const { freeClasses, scheduledClasses, isLoading, error } = useVenueClasses({
    venueId,
    fromDate: selectedDate,
    toDate: addDays(selectedDate, 1),
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View 
        style={[
          styles.content, 
          { 
            backgroundColor: colors.background,
            transform: [{ translateY }]
          }
        ]}
      >
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={closeScreen}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {t('classes.availableClasses')}
            </Text>
          </View>
          
          <View style={styles.shareButton} />
        </View>

        <DateSelector
          dates={dateRange}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : error ? (
            <EmptyState
              title={t('classes.unableToLoadClasses')}
              message={error instanceof Error ? error.message : t('common.error')}
            />
          ) : (!scheduledClasses?.length && !freeClasses.length) ? (
            <EmptyState
              title={t('classes.noClassesAvailable')}
              message={t('classes.noClassesScheduled')}
            />
          ) : (
            <>
              {freeClasses.map((classItem) => (
                <ClassCard
                  key={`${classItem.id}-${classItem.date}`}
                  classItem={classItem}
                  isFreeClass
                />
              ))}
              {scheduledClasses?.map((classItem) => (
                <ClassCard
                  key={`${classItem.id}-${classItem.date}`}
                  classItem={classItem}
                />
              ))}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
