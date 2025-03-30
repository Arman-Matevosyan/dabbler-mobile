import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Dimensions, StyleSheet } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const LOGO_SIZE = Math.min(screenWidth * 0.4, 160); // 40% of screen width, max 160px

export const useLoaddingScreenStyles = () => {
  const { colorScheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme].background,
    },
    logoContainer: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      marginBottom: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    loadingContainer: {
      backgroundColor: Colors[colorScheme].cardBackground,
      padding: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: Colors[colorScheme].text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorScheme === 'dark' ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    text: {
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '500',
      color: Colors[colorScheme].text,
    },
  });

  return { styles, scheme: colorScheme };
};
