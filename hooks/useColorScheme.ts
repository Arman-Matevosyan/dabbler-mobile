import { useTheme } from '@/providers/ThemeContext';

export const useColorScheme = () => {
  const { colorScheme } = useTheme();
  return colorScheme;
};
