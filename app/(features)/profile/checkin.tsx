import GirlDoingYoga from '@/components/svg/GirlYoga';
import Skeleton from '@/components/ui/Skeleton';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useCheckIn } from '@/hooks/checkin/useCheckIn';
import { useTheme } from '@/providers/ThemeContext';
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { router } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FlatList,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <Pressable
      style={styles.backButton}
      onPress={onPress}
      android_ripple={{ color: 'transparent' }}
    >
      <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
    </Pressable>
  );
};

const HeaderTabs = ({
  activeTab,
  onChangeTab,
}: {
  activeTab: 'history' | 'limits';
  onChangeTab: (tab: 'history' | 'limits') => void;
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View style={styles.headerTabsContainer}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={styles.tabTextContainer}
          onPress={() => onChangeTab('history')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'history' ? colors.tint : colors.textSecondary,
              },
            ]}
          >
            {t('checkin.history')}
          </ThemedText>
          {activeTab === 'history' && (
            <View
              style={[styles.tabIndicator, { backgroundColor: colors.tint }]}
            />
          )}
        </Pressable>

        <Pressable
          style={styles.tabTextContainer}
          onPress={() => onChangeTab('limits')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'limits' ? colors.tint : colors.textSecondary,
              },
            ]}
          >
            {t('checkin.limits')}
          </ThemedText>
          {activeTab === 'limits' && (
            <View
              style={[styles.tabIndicator, { backgroundColor: colors.tint }]}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const CheckinSkeleton = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[styles.contentContainer, { backgroundColor: colors.background }]}
    >
      <View style={styles.monthHeader}>
        <Skeleton width={120} height={24} style={styles.skeletonHeader} />
      </View>

      {[1, 2, 3].map((_, index) => (
        <View
          key={index}
          style={[styles.classCard, { backgroundColor: colors.background }]}
        >
          <View style={styles.imageContainer}>
            <Skeleton width={80} height={80} borderRadius={6} />
          </View>

          <View style={styles.detailsContainer}>
            <Skeleton width={150} height={18} style={{ marginBottom: 8 }} />
            <Skeleton width={180} height={14} style={{ marginBottom: 8 }} />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={100} height={14} />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={120} height={14} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.textSecondary,
                  opacity: 0.3,
                  marginRight: 6,
                }}
              />
              <Skeleton width={150} height={14} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.emptyStateContainer}>
      <GirlDoingYoga width={200} height={200} />

      <ThemedText style={styles.noCheckinsTitle}>
        {t('checkin.noCheckins')}
      </ThemedText>

      <ThemedText style={styles.noCheckinsMessage}>
        {t('checkin.emptyStateMessage')}
      </ThemedText>
    </View>
  );
};

// History tab content
const HistoryContent = ({ checkIn }: { checkIn: any[] }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const handleClassPress = (classId: string, date?: string) => {
    router.push({
      pathname: '/classes/details/[id]',
      params: { id: classId, date },
    });
  };

  // Check if data is empty
  if (!checkIn || checkIn.length === 0) {
    return <EmptyState />;
  }

  const renderClassItem = ({ item }: { item: any }) => {
    const coverImage =
      item.covers && item.covers.length > 0 && item.covers[0]?.url
        ? item.covers[0].url
        : `https://picsum.photos/400/200?random=${item.id}`;

    let dateTimeStr = '';

    if (item.date) {
      try {
        const scheduleDate = parseISO(item.date);
        const day = format(scheduleDate, 'EEE');
        const monthDay = format(scheduleDate, 'dd MMM');
        const startTime = format(scheduleDate, 'HH:mm');
        const endTime = format(
          new Date(scheduleDate.getTime() + (item.duration || 60) * 60 * 1000),
          'HH:mm'
        );

        dateTimeStr = `${day}, ${monthDay} - ${startTime}-${endTime}`;
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }

    return (
      <Pressable
        style={[styles.classCard, { backgroundColor: colors.background }]}
        onPress={() => handleClassPress(item.id, item.date || undefined)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: coverImage }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <ThemedText style={styles.className}>{item.name}</ThemedText>

          {dateTimeStr && (
            <ThemedText
              style={[styles.dateText, { color: colors.textSecondary }]}
            >
              {dateTimeStr}
            </ThemedText>
          )}

          <View style={styles.infoRow}>
            <ThemedText
              style={[styles.venueText, { color: colors.textSecondary }]}
            >
              {item.venue?.name || ''} -
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="person-outline"
              size={14}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <ThemedText
              style={[styles.instructorText, { color: colors.textSecondary }]}
            >
              {item.instructorInfo || item.instructorName || ''}
            </ThemedText>
          </View>

          <View style={styles.categoryContainer}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={14}
              color={colors.textSecondary}
              style={styles.icon}
            />
            {item.categories &&
              item.categories.map((category: string, index: number) => (
                <ThemedText
                  key={index}
                  style={[styles.categoryText, { color: colors.textSecondary }]}
                >
                  {index !== 0 && ' • '}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </ThemedText>
              ))}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View
      style={[styles.contentContainer, { backgroundColor: colors.background }]}
    >
      <View style={styles.monthHeader}>
        <ThemedText style={styles.monthTitle}>March, 2025</ThemedText>
      </View>

      <FlatList
        data={checkIn}
        renderItem={renderClassItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Limits tab content
const LimitsContent = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const username = 'Vahan!';

  return (
    <View
      style={[styles.contentContainer, { backgroundColor: colors.background }]}
    >
      <ThemedText style={styles.welcomeTitle}>Hi {username}</ThemedText>

      <ThemedText
        style={[styles.welcomeDescription, { color: colors.textSecondary }]}
      >
        {t('checkin.trackLimits')}
      </ThemedText>

      <View style={styles.limitSection}>
        <View style={styles.limitHeader}>
          <Ionicons
            name="time-outline"
            size={20}
            color={colors.textSecondary}
          />
          <ThemedText style={styles.limitHeaderText}>
            {t('checkin.resetDates')}
          </ThemedText>
        </View>

        <ThemedText style={[styles.limitText, { color: colors.textSecondary }]}>
          {t('checkin.totalCheckinsReset', { date: 'Sun, 6 Apr.' })}
        </ThemedText>

        <ThemedText
          style={[
            styles.limitText,
            { color: colors.textSecondary, marginTop: 16 },
          ]}
        >
          {t('checkin.allVenueLimits')}
        </ThemedText>
      </View>

      <ThemedText style={styles.monthSection}>March</ThemedText>

      <View
        style={[
          styles.venueCard,
          { backgroundColor: colorScheme === 'dark' ? '#222429' : '#F7F7F7' },
        ]}
      >
        <ThemedText style={styles.venueCardTitle}>
          {t('checkin.venueCheckins')}
        </ThemedText>
        <ThemedText
          style={[styles.visitCount, { color: colors.textSecondary }]}
        >
          3 {t('checkin.visitsInMarch')}
        </ThemedText>

        <View style={styles.venueItem}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1547919307-1ecb10702e6f',
            }}
            style={styles.venueImage}
          />
          <ThemedText style={styles.venueName}>Chimosa</ThemedText>

          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { backgroundColor: colors.tint }]}
            />
            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#E0E0E0',
                },
              ]}
            />
          </View>

          <View style={styles.limitNumbers}>
            <ThemedText style={{ color: colors.tint }}>3</ThemedText>
            <ThemedText style={{ color: colors.textSecondary }}>4</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ProfileCheckinScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'history' | 'limits'>('history');
  const { checkInData, isLoading } = useCheckIn();

  useLayoutEffect(() => {
    StatusBar.setBarStyle(
      colorScheme === 'dark' ? 'light-content' : 'dark-content'
    );
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [colorScheme]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <HeaderBackButton onPress={handleGoBack} />
        <ThemedText style={styles.headerTitle}>
          {t('checkin.checkins')}
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      <HeaderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <View style={styles.content}>
        {isLoading ? (
          <CheckinSkeleton />
        ) : activeTab === 'history' ? (
          <HistoryContent checkIn={checkInData || []} />
        ) : (
          <LimitsContent />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  headerTabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 48,
  },
  tabTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 60,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  monthHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 24,
  },
  classCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
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
    marginBottom: 2,
  },
  dateText: {
    fontSize: 13,
  },
  venueText: {
    fontSize: 13,
  },
  icon: {
    marginRight: 4,
  },
  instructorText: {
    fontSize: 13,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryText: {
    fontSize: 13,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  limitSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  limitText: {
    fontSize: 14,
    lineHeight: 20,
  },
  monthSection: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  venueCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
  },
  venueCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  visitCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  venueImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
  venueName: {
    fontSize: 15,
    fontWeight: '500',
    width: 80,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    marginHorizontal: 8,
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    height: 4,
    width: '75%',
    borderRadius: 2,
  },
  progressBackground: {
    position: 'absolute',
    height: 4,
    width: '100%',
    borderRadius: 2,
  },
  limitNumbers: {
    flexDirection: 'row',
    width: 24,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonHeader: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noCheckinsTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  noCheckinsMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
