import { changeLanguage, getCurrentLanguage } from '@/app/i18n';
import { ThemedText } from '@/components/ui/ThemedText';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';


export default function LanguageScreen() {
  const { styles, colors } = useProfileTabStyles();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { t, i18n } = useTranslation();

  const languages = [
    {
      id: 'en',
      label: 'English',
      description: 'English',
      icon: 'translate' as const,
    },
    {
      id: 'ru',
      label: 'Русский',
      description: 'Russian',
      icon: 'translate' as const,
    },
    {
      id: 'hy',
      label: 'Հայերեն',
      description: 'Armenian',
      icon: 'translate' as const,
    },
  ];

  useEffect(() => {
    loadSelectedLanguage();
  }, []);

  const loadSelectedLanguage = async () => {
    try {
      const savedLanguage = await getCurrentLanguage();
      setSelectedLanguage(savedLanguage);
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const handleLanguageChange = async (languageId: string) => {
    try {
      await changeLanguage(languageId);
      setSelectedLanguage(languageId);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

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
            {t('common.language')}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.screenTitle}>
          {t('profile.languageSettings')}
        </ThemedText>

        <View style={{ gap: 16, marginTop: 24 }}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.detailItem,
                {
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleLanguageChange(language.id)}
              activeOpacity={1}
            >
              <View style={styles.detailItemLeft}>
                <MaterialCommunityIcons
                  name={language.icon}
                  size={24}
                  color={colors.textPrimary}
                />
                <View>
                  <ThemedText style={styles.detailLabel}>
                    {language.label}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {language.description}
                  </ThemedText>
                </View>
              </View>
              <View style={{ justifyContent: 'center' }}>
                <MaterialCommunityIcons
                  name={
                    selectedLanguage === language.id
                      ? 'radiobox-marked'
                      : 'radiobox-blank'
                  }
                  size={24}
                  color={
                    selectedLanguage === language.id
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
