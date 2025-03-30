import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClassCardProps {
  classItem: {
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
  };
  isHighlighted?: boolean;
  isFreeClass?: boolean;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  isHighlighted = false,
  isFreeClass = false,
}) => {
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];
  const { t } = useTranslation();

  const spotsLeft = classItem.totalSpots - classItem.scheduledSpots;
  const coverUrl =
    classItem.covers?.[0]?.url ||
    'https://images.unsplash.com/photo-1518611012118-696072aa579a';

  const getFormattedDateTime = () => {
    if (!classItem.date) {
      return `${classItem.duration / 60} ${t('classes.hours')}`;
    }
    const startDate = new Date(classItem.date);
    const endDate = new Date(startDate.getTime() + classItem.duration * 60000);
    const startTime = format(startDate, 'HH:mm');
    const endTime = format(endDate, 'HH:mm');
    const hours = classItem.duration / 60;

    return `${startTime} - ${endTime} • ${hours} ${t('classes.hours')}`;
  };

  const renderScheduledClass = () => (
    <View style={[styles.classCard, { backgroundColor: colors.background }]}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.classImage}
        resizeMode="cover"
      />
      <View style={styles.classContent}>
        <View style={styles.classDetails}>
          <Text style={[styles.classTitle, { color: colors.textPrimary }]}>
            {classItem.name}
          </Text>
          <Text style={[styles.classTime, { color: colors.textSecondary }]}>
            {getFormattedDateTime()}
          </Text>

          <View style={styles.classDetailsContainer}>
            <View style={styles.classDetail}>
              <FontAwesome5 name="bolt" size={14} color={colors.orange} />
              <Text
                style={[
                  styles.classDetailText,
                  { color: colors.textSecondary },
                ]}
              >
                {classItem.venue.name}
              </Text>
            </View>

            <View style={styles.classDetail}>
              <FontAwesome5
                name="user"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.classDetailText,
                  { color: colors.textSecondary },
                ]}
              >
                {classItem.instructorInfo}
              </Text>
            </View>

            <View style={styles.classDetail}>
              <FontAwesome5 name="tag" size={14} color={colors.textSecondary} />
              <Text
                style={[
                  styles.classDetailText,
                  { color: colors.textSecondary },
                ]}
              >
                {classItem.categories[0]}
              </Text>
            </View>

            <Text style={[styles.spotsText, { color: colors.textSecondary }]}>
              {spotsLeft}/{classItem.totalSpots} {t('classes.spotsLeft')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderUnscheduledClass = () => (
    <View
      style={[styles.unscheduledCard, { backgroundColor: colors.background }]}
    >
      <Image
        source={{ uri: coverUrl }}
        style={styles.classImage}
        resizeMode="cover"
      />
      <View style={styles.unscheduledContent}>
        <Text style={[styles.unscheduledTitle, { color: colors.textPrimary }]}>
          {classItem.name}
        </Text>
        <Text style={[styles.unscheduledTime, { color: colors.textSecondary }]}>
          {getFormattedDateTime()}
        </Text>
        <Text
          style={[styles.unscheduledVenue, { color: colors.textSecondary }]}
        >
          {classItem.venue.name}
        </Text>
        <View style={styles.unscheduledTag}>
          <FontAwesome5 name="tag" size={12} color={colors.textSecondary} />
          <Text
            style={[styles.unscheduledTagText, { color: colors.textSecondary }]}
          >
            {classItem.categories[0]}
          </Text>
        </View>
        {isFreeClass && (
          <View style={[styles.freeTag, { backgroundColor: colors.tint }]}>
            <Text style={styles.freeTagText}>{t('classes.free')}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: '/(features)/classes/details/[id]',
          params: {
            id: classItem.id,
            date: classItem.date,
          },
        })
      }
    >
      {classItem.scheduled ? renderScheduledClass() : renderUnscheduledClass()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  classCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
    marginBottom: 20,
    paddingTop: 20,
  },
  classImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  classContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  classDetails: {
    flex: 1,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  classTime: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  classDetailsContainer: {
    gap: 8,
  },
  classDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  classDetailText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  spotsText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: -0.2,
  },
  unscheduledCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
    marginBottom: 20,
    paddingTop: 20,
    marginTop: 'auto',
  },
  unscheduledContent: {
    flex: 1,
    marginLeft: 16,
  },
  unscheduledTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  unscheduledTime: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  unscheduledVenue: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  unscheduledTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  unscheduledTagText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  freeTag: {
    padding: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  freeTagText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
