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
    map: {
      flex: 1,
    },
    customMarker: {
      width: 30,
      height: 30,
      backgroundColor: colors.accentPrimary,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeMarker: {
      borderColor: colors.accentSecondary,
      borderWidth: 2,
    },
    markerText: {
      color: colors.textPrimary,
    },
    innerCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.accentPrimary,
      borderWidth: 3,
      borderColor: colors.textPrimary,
    },
    venueItem: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + '80'  // 50% opacity
          : colors.background + '80',
      overflow: 'hidden',
    },
    venueItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    venueImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
    },
    venueDetails: {
      flex: 1,
      marginRight: 8,
    },
    venueName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    venueDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    chevronIcon: {
      marginLeft: 8,
    },
    venueCountButton: {
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: [{ translateX: -50 }],
      backgroundColor: colors.accentPrimary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    venueCountIcon: {
      marginRight: 8,
    },
    venueCountText: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: 16,
    },
    fullScreenModal: {
      margin: 0,
      justifyContent: 'flex-end',
    },
    fullScreenContent: {
      flex: 1,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + '80'  // 50% opacity
          : colors.background + '80',
    },
    listContent: {
      paddingBottom: 20,
    },
    activeVenueDetails: {
      position: 'absolute',
      bottom: 80,
      left: '5%',
      right: '5%',
      height: 'auto',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + 'E6'  // 90% opacity
          : colors.background + 'E6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
    },
    activeVenueImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    activeVenueText: {
      flex: 1,
      paddingRight: 10,
    },
    activeVenueName: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    activeVenueDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      flexShrink: 1,
    },
    clusterWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    clusterContainer: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
    },
  });

  return { styles, scheme: colorScheme };
};
