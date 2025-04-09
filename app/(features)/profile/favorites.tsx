import Skeleton from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/hooks/favorites/useFavorites';
import { useTheme } from '@/providers/ThemeContext';
import { IVenue } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const VenueSkeletonItem = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  return (
    <View style={[styles.skeletonItem, { backgroundColor: colors.secondary }]}>
      <Skeleton style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <Skeleton style={{ height: 20, width: '50%', marginBottom: 8 }} />
        <Skeleton style={{ height: 16, width: '40%', marginBottom: 8 }} />
        <Skeleton style={{ height: 16, width: '80%', marginBottom: 4 }} />
        <Skeleton style={{ height: 16, width: '70%' }} />
      </View>
    </View>
  );
};

const VenueCard = ({ item }: { item: IVenue }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  const imageUrl = item.covers?.[0]?.url || 'https://i.imgur.com/z9hbLVX.jpg';

  const location = item.address
    ? `${item.address.city || ''} - ${item.address.district || ''}`
    : '';

  const categoriesText = (item as any).categories 
    ? Array.isArray((item as any).categories) 
      ? (item as any).categories.join(', ') 
      : ''
    : '';

  const handlePress = () => {
    router.push({
      pathname: '/venues/[id]',
      params: { id: item.id },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.venueCard, { backgroundColor: colors.secondary }]}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.venueImage}
        resizeMode="cover"
      />

      <View style={styles.venueDetails}>
        <Text style={[styles.venueName, { color: colors.textPrimary }]}>
          {item.name}
        </Text>

        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {location}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          <Ionicons
            name="pricetag-outline"
            size={14}
            color={colors.textSecondary}
            style={styles.tagIcon}
          />
          <Text
            style={[styles.tagsText, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {categoriesText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function FavoritesScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const { favorites, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredFavorites = searchQuery
    ? favorites.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.address?.city
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          venue.address?.district
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : favorites;

  const renderSkeletons = () => {
    return (
      <Animated.View entering={FadeIn}>
        {[1, 2, 3, 4, 5].map((key) => (
          <VenueSkeletonItem key={key} />
        ))}
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
          No favorite venues found
        </Text>
        <Text
          style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}
        >
          Add venues to your favorites to see them here
        </Text>
      </View>
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderItem = useCallback(
    ({ item }: { item: IVenue }) => <VenueCard item={item} />,
    [colorScheme]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Favorites
        </Text>
      </View>

      <View
        style={[styles.searchContainer, { backgroundColor: colors.secondary }]}
      >
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.textPrimary }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 25,
    padding: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  venueCard: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  venueImage: {
    width: '100%',
    height: 180,
  },
  venueDetails: {
    padding: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tagIcon: {
    marginTop: 2,
    marginRight: 4,
  },
  tagsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  skeletonItem: {
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 8,
  },
  skeletonImage: {
    width: '100%',
    height: 180,
  },
  skeletonContent: {
    padding: 16,
  },
});
