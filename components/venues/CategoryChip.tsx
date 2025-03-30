import { Colors } from '@/constants/Colors';
import { Category } from '@/hooks/shared/useCategories';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onToggle: (categoryName: string) => void;
  colorScheme: 'light' | 'dark';
  colors: typeof Colors.light | typeof Colors.dark;
}

export const CategoryChip = ({
  category,
  isSelected,
  onToggle,
  colors,
}: CategoryChipProps) => (
  <TouchableOpacity
    style={[
      styles.chip,
      {
        backgroundColor: isSelected
          ? `${colors.accentPrimary}E6`
          : colors.secondary,
        borderColor: isSelected ? colors.accentPrimary : `${colors.border}40`,
      },
    ]}
    activeOpacity={0.7}
    onPress={() => onToggle(category.name)}
  >
    <Text
      style={[
        styles.text,
        {
          color: isSelected ? colors.background : colors.textPrimary,
          opacity: isSelected ? 1 : 0.9,
        },
      ]}
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
