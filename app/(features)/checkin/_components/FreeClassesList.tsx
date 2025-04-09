import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import ClassListEmptyState from './ClassListEmptyState';
import ClassListSkeleton from './ClassListSkeleton';

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

interface FreeClassesListProps {
  classes: Class[];
  isLoading?: boolean;
}

const FreeClassesList: React.FC<FreeClassesListProps> = ({
  classes,
  isLoading = false,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const navigateToClassDetails = (classItem: Class) => {
    router.push({
      pathname: '/classes/details/[id]',
      params: { id: classItem.id },
    });
  };

  const renderClassItem = ({ item }: { item: Class }) => {
    const coverImage =
      item.covers && item.covers.length > 0
        ? item.covers[0]?.url
        : `https://picsum.photos/400/200?random=${item.id}`;

    return (
      <Pressable
        style={[styles.classCard, { backgroundColor: colors.background }]}
        onPress={() => navigateToClassDetails(item)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverImage }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.className}>{item.name}</ThemedText>

          <View style={styles.infoRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <ThemedText
              style={[styles.infoText, { color: colors.textSecondary }]}
            >
              {item.duration} {t('classes.minutes')}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={16}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <ThemedText
              style={[styles.infoText, { color: colors.textSecondary }]}
            >
              {item.instructorInfo}
            </ThemedText>
          </View>

          {item.venue && item.venue.name && (
            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.icon}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.venue.name}
              </ThemedText>
            </View>
          )}

          <View style={styles.tagsContainer}>
            {item.categories &&
              item.categories.slice(0, 2).map((category, index) => (
                <View
                  key={index}
                  style={[
                    styles.tagPill,
                    {
                      backgroundColor:
                        colorScheme === 'dark' ? '#333' : '#f0f0f0',
                    },
                  ]}
                >
                  <ThemedText
                    style={[styles.tagText, { color: colors.textSecondary }]}
                  >
                    {typeof category === 'string' ? category : 'Category'}
                  </ThemedText>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return <ClassListSkeleton count={4} />;
  }

  if (classes.length === 0) {
    return <ClassListEmptyState type="free" />;
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
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
});

export default FreeClassesList;
