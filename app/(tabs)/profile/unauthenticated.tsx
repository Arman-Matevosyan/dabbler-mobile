import { ThemedText } from '@/components/ui/ThemedText';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

export default function UnauthenticatedProfile() {
  const statusBarHeight = useStatusBarHeight();
  const { styles, colors } = useProfileTabStyles();
  const { t } = useTranslation();

  const handleLogin = () => {
    router.navigate({
      pathname: '/(auth)/login',
    });
  };

  const handleSignup = () => {
    router.navigate({
      pathname: '/(auth)/signup',
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: statusBarHeight,
          backgroundColor: colors.background,
        },
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.authContainer}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.cardBackground,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <MaterialCommunityIcons
                name="account"
                size={60}
                color={colors.textSecondary}
              />
            </View>

            <ThemedText
              type="title"
              style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}
            >
              {t('profile.welcomeToDabbler')}
            </ThemedText>

            <ThemedText
              style={{
                textAlign: 'center',
                marginTop: 8,
                marginBottom: 32,
                color: colors.textSecondary,
                fontSize: 16,
                maxWidth: '80%',
              }}
            >
              {t('profile.signInToAccess')}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.settingsItem,
              {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleLogin}
            activeOpacity={1}
          >
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsItemIconContainer}>
                <MaterialCommunityIcons
                  name="login"
                  size={20}
                  color={colors.textPrimary}
                />
              </View>
              <View style={styles.settingsItemTextContainer}>
                <ThemedText style={styles.settingsItemText}>
                  {t('auth.login')}
                </ThemedText>
                <ThemedText style={styles.settingsItemDescription}>
                  {t('auth.signInAccount')}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingsItem,
              {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleSignup}
            activeOpacity={1}
          >
            <View style={styles.settingsItemLeft}>
              <View style={styles.settingsItemIconContainer}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color={colors.textPrimary}
                />
              </View>
              <View style={styles.settingsItemTextContainer}>
                <ThemedText style={styles.settingsItemText}>
                  {t('auth.signUp')}
                </ThemedText>
                <ThemedText style={styles.settingsItemDescription}>
                  {t('auth.createAccount')}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
