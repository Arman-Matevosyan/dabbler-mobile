// components/common/SearchBar.tsx
import { Colors } from '@/constants/Colors';
import { useDebounce } from '@/hooks/useDebounce';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchBarProps {
  value?: string;
  onChange: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  debounceDelay?: number;
}

export const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  isLoading = false,
  debounceDelay = 300,
}: SearchBarProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceDelay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <View style={[styles.container, getContainerStyles(colorScheme, colors)]}>
      <MaterialCommunityIcons
        name="magnify"
        size={24}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={localValue}
        onChangeText={setLocalValue}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <View style={styles.actions}>
        {isLoading && (
          <ActivityIndicator size="small" color={colors.accentPrimary} />
        )}
        {!!localValue && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getContainerStyles = (colorScheme: string, colors: any) => ({
  backgroundColor:
    colorScheme === 'dark' ? colors.secondary : colors.inputBackground,
  borderColor: colorScheme === 'dark' ? 'transparent' : `${colors.border}40`,
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    padding: 4,
  },
});
