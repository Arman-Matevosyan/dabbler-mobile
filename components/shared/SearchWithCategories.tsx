import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { CategoryList } from './CategoryList';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface SearchWithCategoriesProps {
  searchValue?: string;
  selectedCategories?: string[];
  onCategoryToggle: (category: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  debounceDelay?: number;
  containerStyle?: any;
  onSearchChange: (query: string) => void;
}

export const SearchWithCategories = ({
  searchValue = '',
  selectedCategories = [],
  onCategoryToggle,
  placeholder = 'Search...',
  onSearchChange,
  isLoading = false,
  containerStyle,
}: SearchWithCategoriesProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleConfirmCategories = (confirmedCategories: string[]) => {
    onCategoryToggle(confirmedCategories);
  };

  const backgroundStyle = {
    backgroundColor: colors.background,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.innerContainer, backgroundStyle]}>
        <Animated.View
          style={[
            styles.searchContainer,
            getContainerStyles(colors, isFocused),
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: colorScheme === 'dark' ? '#fff' : colors.textPrimary },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={searchValue}
            onChangeText={onSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={styles.searchActions}>
            {isLoading && (
              <ActivityIndicator size="small" color={colors.accentPrimary} />
            )}
          </View>
        </Animated.View>

        <View style={styles.categoriesWrapper}>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.categoriesButton,
                { backgroundColor: colors.accentPrimary },
              ]}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={[styles.categoriesButtonText, { color: '#fff' }]}>
                {t('venues.categories')}
              </Text>
              <MaterialCommunityIcons
                name="chevron-up"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            {selectedCategories.length > 0 && (
              <Text
                style={[styles.selectedCount, { color: colors.textSecondary }]}
              >
                {selectedCategories.length} {t('venues.selected')}
              </Text>
            )}
          </View>
        </View>
      </View>

      <CategoryList
        isVisible={isModalVisible}
        onDismiss={() => setIsModalVisible(false)}
        selectedCategories={selectedCategories}
        onConfirm={handleConfirmCategories}
      />
    </View>
  );
};

const getContainerStyles = (
  colors: (typeof Colors)[keyof typeof Colors],
  isFocused: boolean
) => ({
  backgroundColor: colors.secondary,
  borderColor: isFocused ? colors.accentPrimary : 'transparent',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  innerContainer: {
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
    opacity: 0.9,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    fontWeight: '400',
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoriesWrapper: {
    height: 44,
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  categoriesButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  selectedCount: {
    fontSize: 14,
  },
});
