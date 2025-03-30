import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { StyleSheet } from 'react-native';

export const useProfileTabStyles = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const styles = StyleSheet.create({
    avatarContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    avatarIcon: {
      color: colors.textSecondary,
      width: 120,
      height: 120,
    },
    changeIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 8,
      backgroundColor: colors.text + 'B3', // 70% opacity
      borderRadius: 20,
      padding: 8,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 8,
      backgroundColor: colors.text + 'B3', // 70% opacity
      borderRadius: 20,
      padding: 8,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.text + '4D', // 30% opacity
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    toggleText: {
      textAlign: 'center',
      color: colors.accentPrimary,
      marginVertical: 16,
      fontSize: 16,
      fontWeight: '500',
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: 24,
    },
    userContainer: {
      alignItems: 'center',
      padding: 20,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    authContainer: {
      width: '100%',
      paddingHorizontal: 24,
      marginTop: 40,
    },
    button: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginVertical: 8,
      elevation: 2,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    buttonIcon: {
      marginRight: 12,
    },
    loginButton: {
      backgroundColor: colors.accentPrimary,
    },
    signupButton: {
      backgroundColor: colors.accentSecondary,
    },
    logoutButton: {
      marginTop: 32,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: colors.errorText,
    },
    logoutButtonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '500',
    },
    socialAuthContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    socialButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    facebookButton: {
      backgroundColor: colors.accentPrimary,
    },
    googleButton: {
      backgroundColor: colors.accentSecondary,
    },
    buttonText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    socialButtonText: {
      color: colors.primary,
      marginLeft: 12,
      fontWeight: '500',
    },
    termsText: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 24,
      lineHeight: 18,
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    profileSections: {
      marginTop: 24,
    },
    verificationText: {
      color: colors.warningText,
      marginLeft: 8,
      fontSize: 14,
    },
    verificationBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warningBackground,
      padding: 12,
      borderRadius: 8,
      marginVertical: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.text + '80', // 50% opacity
    },
    loaderColor: {
      color: colors.accentPrimary,
    },
    modalContent: {
      width: '85%',
      backgroundColor: colors.modalBackground,
      borderRadius: 16,
      padding: 24,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 24,
      color: colors.textPrimary,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.textPrimary,
      backgroundColor:
        colorScheme === 'dark' ? colors.secondary : colors.primary,
    },
    inputError: {
      borderColor: colors.errorText,
    },
    errorText: {
      color: colors.errorText,
      fontSize: 14,
      marginBottom: 8,
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
    },
    disabledButton: {
      opacity: 0.6,
    },
    closeButton: {
      marginTop: 16,
      alignItems: 'center',
    },
    closeButtonText: {
      color: colors.errorText,
      fontWeight: '600',
      fontSize: 16,
    },
    warningIcon: {
      color: colors.warningText,
    },
    avatarButton: {
      position: 'relative',
      alignSelf: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 8,
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
    },
    settingsButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 32,
    },
    actionButton: {
      alignItems: 'center',
      gap: 8,
    },
    actionButtonText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    avatarWrapper: {
      position: 'relative',
      alignSelf: 'center',
    },
    languageContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 24,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    languageItemLeft: {
      flex: 1,
    },
    languageName: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    radioContainer: {
      padding: 4,
      marginLeft: 8,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 24,
      padding: 4,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: colors.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    settingsItemText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    settingsSection: {
      marginBottom: 24,
    },
    settingsSectionTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    settingsSectionContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 8,
      overflow: 'hidden',
    },
    settingsItemContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingsItemContainerLast: {
      borderBottomWidth: 0,
    },
    settingsItemIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsItemTextContainer: {
      flex: 1,
    },
    settingsItemDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    settingsItemChevron: {
      color: colors.textSecondary,
      opacity: 0.5,
      marginLeft: 8,
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 8,
    },
    screenDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
    },
    detailsContainer: {
      backgroundColor: colors.cardBackground,
      borderRadius: 8,
      overflow: 'hidden',
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    detailItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    paymentMethodImage: {
      width: 40,
      height: 25,
      resizeMode: 'contain',
    },
    paymentMethodDetails: {
      flex: 1,
    },
    paymentMethodLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    paymentMethodValue: {
      fontSize: 16,
      color: colors.textPrimary,
    },
  });

  return { styles, colors };
};
