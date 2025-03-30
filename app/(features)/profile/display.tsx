import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/providers/ThemeContext';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

export default function DisplayScreen() {
  const { styles, colors } = useProfileTabStyles();
  const { theme, setThemeType } = useTheme();
  const { t } = useTranslation();

  const themeOptions = [
    {
      id: 'system' as const,
      label: t('profile.system'),
      description: t('profile.followSystemTheme'),
      icon: 'theme-light-dark' as const,
    },
    {
      id: 'light' as const,
      label: t('profile.light'),
      description: t('profile.alwaysLightTheme'),
      icon: 'white-balance-sunny' as const,
    },
    {
      id: 'dark' as const,
      label: t('profile.dark'),
      description: t('profile.alwaysDarkTheme'),
      icon: 'moon-waning-crescent' as const,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.textPrimary}
          />
          <ThemedText style={styles.backButtonText}>
            {t('profile.display')}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.screenTitle}>
          {t('profile.displaySettings')}
        </ThemedText>

        <View style={{ gap: 16, marginTop: 24 }}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.detailItem,
                {
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => setThemeType(option.id)}
              activeOpacity={1}
            >
              <View style={styles.detailItemLeft}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color={colors.textPrimary}
                />
                <View>
                  <ThemedText style={styles.detailLabel}>
                    {option.label}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {option.description}
                  </ThemedText>
                </View>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <MaterialCommunityIcons
                  name={
                    theme === option.id ? 'radiobox-marked' : 'radiobox-blank'
                  }
                  size={24}
                  color={
                    theme === option.id
                      ? colors.accentPrimary
                      : colors.textSecondary
                  }
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
