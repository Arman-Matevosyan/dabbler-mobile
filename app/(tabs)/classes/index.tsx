import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import {
    ClassCard,
    DateSelector,
    SkeletonCard,
    TimeRangeSlider,
} from '@/components/classes';
import { SearchWithCategories } from '@/components/shared';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useDiscoverClassSearch } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import {
    useClassSearchFilters,
    useLocationParams,
    useSearchStore,
} from '@/store/useSearchStore';

interface ClassItem {
  id: string;
  name: string;
  covers: Array<{ url: string }>;
  date?: string;
  duration: number;
  venue: { name: string };
  instructorInfo: string;
  categories: string[];
  scheduled: boolean;
  scheduledSpots: number;
  totalSpots: number;
}

export default function ClassesScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const { query, category, setQuery, setCategory } = useClassSearchFilters();
  const { locationLat, locationLng, radius } = useLocationParams();

  const updateClassParams = useSearchStore((state) => state.updateClassParams);
  const resetClassDates = useSearchStore((state) => state.resetClassDates);

  const dateRange = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      return date;
    });
  }, []);

  const [timeRange, setTimeRange] = useState({ start: '05:00', end: '23:00' });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const from_date = useMemo(() => {
    const [startH, startM] = timeRange.start.split(':').map(Number);
    const fromDate = new Date(selectedDate);
    fromDate.setHours(startH, startM, 0, 0);
    return fromDate;
  }, [selectedDate, timeRange.start]);

  const to_date = useMemo(() => {
    const [endH, endM] = timeRange.end.split(':').map(Number);
    const toDate = new Date(selectedDate);
    toDate.setHours(endH, endM, 59, 999);
    return toDate;
  }, [selectedDate, timeRange.end]);

  const classParams = useMemo(
    () => ({
      latitude: locationLat,
      longitude: locationLng,
      distance: radius,
      query,
      category: category || [],
      from_date: from_date.toISOString(),
      to_date: to_date.toISOString(),
    }),
    [locationLat, locationLng, radius, query, category, from_date, to_date]
  );

  const { data, isLoading, error, refetch } =
    useDiscoverClassSearch(classParams);

  const classes = useMemo(() => {
    if (!data?.response) return [];

    return data.response.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      covers: classItem.covers || [],
      date: classItem.date,
      duration: classItem.duration,
      venue: { name: classItem.venue?.name || '' },
      instructorInfo: classItem.instructorInfo || '',
      categories: classItem.categories || [],
      scheduled: classItem.scheduled || false,
      scheduledSpots: classItem.scheduledSpots || 0,
      totalSpots: classItem.totalSpots || 0,
    }));
  }, [data]);

  useEffect(() => {
    if (from_date > to_date) {
      setTimeRange((prev) => ({
        ...prev,
        end: '23:59',
      }));
    }
  }, [from_date, to_date]);

  useEffect(() => {
    updateClassParams({
      from_date,
      to_date,
    });
  }, [from_date, to_date, updateClassParams]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetClassDates();
        setTimeRange({ start: '05:00', end: '23:00' });
      };
    }, [resetClassDates])
  );

  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        if (locationLat === undefined || locationLng === undefined) {
          useSearchStore.getState().updateSharedLocation({
            locationLat: locationLat || 37.7749,
            locationLng: locationLng || -122.4194,
            radius: radius || 10000,
          });
        }
      }
    }, [isFocused, locationLat, locationLng, radius])
  );

  const renderItem = useCallback(
    ({ item }: { item: ClassItem }) => <ClassCard classItem={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: ClassItem) => `${item.id}-${item.date}`,
    []
  );

  const ListEmptyComponent = useMemo(() => {
    if (!classes.length && !isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {t('classes.noClassesFound')}
          </ThemedText>
        </View>
      );
    }
    return null;
  }, [classes.length, isLoading, t]);

  if (isLoading && !classes.length) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.searchWrapper}>
          <SearchWithCategories
            searchValue={query}
            onSearchChange={setQuery}
            selectedCategories={category}
            onCategoryToggle={setCategory}
            placeholder={t('classes.searchClasses')}
            isLoading={isLoading}
          />
        </View>

        <TimeRangeSlider
          timeRange={timeRange}
          onTimeChange={(newRange) => setTimeRange(newRange)}
          colors={colors}
        />

        <DateSelector
          dates={dateRange}
          selectedDate={selectedDate}
          onDateSelect={(date) => setSelectedDate(date)}
        />

        <View style={styles.listContent}>
          <SkeletonCard count={5} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchWrapper}>
        <SearchWithCategories
          searchValue={query}
          onSearchChange={setQuery}
          selectedCategories={category}
          onCategoryToggle={setCategory}
          placeholder={t('classes.searchClasses')}
          isLoading={isLoading}
        />
      </View>

      <TimeRangeSlider
        timeRange={timeRange}
        onTimeChange={(newRange) => setTimeRange(newRange)}
        colors={colors}
      />

      <DateSelector
        dates={dateRange}
        selectedDate={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
      />

      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={8}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    backgroundColor: 'transparent',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
