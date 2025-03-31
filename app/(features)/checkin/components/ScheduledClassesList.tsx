import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { ClassListEmptyState } from './ClassListEmptyState';
import { ClassListSkeleton } from './ClassListSkeleton';

interface Class {
  id: string;
  name: string;
  instructorInfo: string;
  duration: number;
  scheduled: boolean;
  date: string | null;
  scheduledSpots: number;
  totalSpots: number;
  covers: any[];
  venue: any;
  categories: string[];
}

interface ScheduledClassesListProps {
  classes: Class[];
  isLoading?: boolean;
}

export const ScheduledClassesList: React.FC<ScheduledClassesListProps> = ({
  classes,
  isLoading = false,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const navigateToClassDetails = (classItem: Class) => {
    router.push({
      pathname: '/classes/details/[id]',
      params: { id: classItem.id, date: classItem.date || undefined }
    });
  };

  const renderClassItem = ({ item }: { item: Class }) => {
    const coverImage = item.covers && item.covers.length > 0
      ? item.covers[0]?.url
      : `https://picsum.photos/400/200?random=${item.id}`;
      
    let formattedDate = '';
    let formattedTime = '';
    
    if (item.date) {
      try {
        const date = parseISO(item.date);
        formattedDate = format(date, 'EEE, MMM d');
        formattedTime = format(date, 'HH:mm');
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }

    const isNoShow = Math.random() < 0.3; 

    return (
      <Pressable
        style={[
          styles.classCard,
          { backgroundColor: colors.background }
        ]}
        onPress={() => navigateToClassDetails(item)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverImage }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.className}>{item.name}</ThemedText>
          
          {formattedDate && formattedTime && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} style={styles.icon} />
              <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                {formattedDate} - {formattedTime}
              </ThemedText>
            </View>
          )}
          
          {item.venue && item.venue.name && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} style={styles.icon} />
              <ThemedText style={[styles.infoText, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.venue.name}
              </ThemedText>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} style={styles.icon} />
            <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
              {item.instructorInfo}
            </ThemedText>
          </View>
          
          {isNoShow && (
            <View style={styles.noShowContainer}>
              <View style={[styles.noShowIndicator, { backgroundColor: '#FF6B6B' }]} />
              <ThemedText style={[styles.noShowText, { color: '#FF6B6B' }]}>
                {t('checkin.noShow')}
              </ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.arrowContainer}>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return <ClassListSkeleton count={4} />;
  }

  if (classes.length === 0) {
    return <ClassListEmptyState type="scheduled" />;
  }

  return (
    <FlatList
      data={classes}
      renderItem={renderClassItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
  },
  classCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 90,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  noShowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  noShowIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  noShowText: {
    fontSize: 13,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
}); 