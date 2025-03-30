import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { StyleSheet } from 'react-native';

export const useDetailsScreenStyles = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    errorText: {
      color: colors.errorText,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      fontWeight: '500',
    },
    fixedBackButton: {
      position: 'absolute',
      left: 16,
      zIndex: 1001,
      backgroundColor: colors.background + 'CC',
      borderRadius: 24,
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    backButtonText: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
    },
    stickyHeader: {
      position: 'absolute',
      top: 0,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.background + 'F2',
      paddingVertical: 16,
      zIndex: 1000,
      height: 100,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    stickyBackButton: {
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + 'CC'
          : colors.background + 'CC',
      borderRadius: 24,
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    stickyHeaderTitleContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    stickyHeaderText: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    carouselContainer: {
      height: 300,
      width: '100%',
    },
    carouselImage: {
      width: '100%',
      height: '100%',
    },
    carouselCounterContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + 'CC'
          : colors.background + 'CC',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    carouselCounter: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    section: {
      padding: 20,
      backgroundColor: colors.background + '80',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    mapSection: {
      padding: 20,
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + '80'
          : colors.background + '80',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      height: 200,
    },
    mapMarker: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    sectionName: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 16,
    },
    venueDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    readMore: {
      color: colors.accentPrimary,
      marginTop: 12,
      fontSize: 16,
      fontWeight: '600',
    },
    infoItem: {
      fontSize: 16,
      color: colors.textSecondary,
      marginVertical: 6,
      flexWrap: 'wrap',
      flex: 1,
    },
    infoItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    infoIcon: {
      marginRight: 12,
    },
    map: {
      width: '100%',
      height: 450,
      borderRadius: 16,
      marginTop: 12,
    },
    mapMarkerContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    scheduleButtonContainer: {
      paddingHorizontal: 20,
      marginVertical: 25,
      marginBottom: 30,
    },
    scheduleButton: {
      backgroundColor: colors.accentPrimary,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      shadowColor: colors.accentPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    scheduleButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    planCard: {
      backgroundColor:
        colorScheme === 'dark'
          ? colors.secondary + '4D'
          : colors.background + '4D',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    planHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    planTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[colorScheme].textPrimary,
      marginLeft: 8,
    },
    planVisits: {
      fontSize: 15,
      color: Colors[colorScheme].textSecondary,
      marginTop: 8,
    },
    planPriceLabel: {
      fontSize: 16,
      color: Colors[colorScheme].accentPrimary,
      marginTop: 8,
      fontWeight: '600',
    },
  });

  return { styles };
};
