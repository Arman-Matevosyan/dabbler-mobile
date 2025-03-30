import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { StyleSheet } from 'react-native';

export const useVenuesThemedStyles = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // ... rest of the styles ...
  });

  return { styles, colors };
};
