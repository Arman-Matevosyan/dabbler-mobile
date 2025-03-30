import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useForgotPasswordForm } from '@/hooks/auth';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  isFocused: boolean;
  hasValue: boolean;
  error?: string;
}

const FloatingLabelInput = ({
  label,
  isFocused,
  hasValue,
  error,
  ...props
}: FloatingLabelInputProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const inputStyles = StyleSheet.create({
    inputWrapper: {
      marginBottom: 12,
    },
    inputContainer: {
      height: 44,
      borderBottomWidth: 1,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: 'transparent',
    },
    inputFocusedContainer: {
      borderBottomWidth: 1.5,
    },
    labelContainer: {
      position: 'absolute',
      left: 12,
      top: -13,
      paddingHorizontal: 4,
      zIndex: 1,
      backgroundColor: 'transparent',
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      backgroundColor: 'transparent',
      transform: [{ translateY: 0 }],
    },
    inputErrorContainer: {
      borderBottomColor: '#ff453a',
    },
    input: {
      flex: 1,
      fontSize: 14,
      height: '100%',
      paddingTop: 12,
      paddingBottom: 12,
      textAlignVertical: 'center',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 1,
    },
    errorText: {
      fontSize: 10,
    },
  });

  return (
    <View style={inputStyles.inputWrapper}>
      <View
        style={[
          inputStyles.inputContainer,
          error && inputStyles.inputErrorContainer,
          isFocused && inputStyles.inputFocusedContainer,
          {
            borderColor: error
              ? '#ff453a'
              : isFocused
              ? colors.accentPrimary
              : colors.border,
          },
        ]}
      >
        <View
          style={[
            inputStyles.labelContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedText
            style={[
              inputStyles.label,
              {
                color: error
                  ? '#ff453a'
                  : isFocused
                  ? colors.accentPrimary
                  : colors.textSecondary,
                transform: [{ translateY: 0 }],
              },
            ]}
          >
            {label}
          </ThemedText>
        </View>
        <TextInput
          style={[inputStyles.input, { color: colors.textPrimary }]}
          placeholderTextColor="transparent"
          {...props}
        />
      </View>
      {error && (
        <View style={inputStyles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={14} color={colors.errorText} />
          <ThemedText
            style={[inputStyles.errorText, { color: colors.errorText }]}
          >
            {error}
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default function ForgotPasswordScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const statusBarHeight = useStatusBarHeight();
  const { form, handleSubmit, isLoading, isSuccess } = useForgotPasswordForm();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
    },
    headerContainer: {
      marginBottom: 24,
    },
    titleText: {
      fontSize: 22,
      fontWeight: '600',
      marginBottom: 2,
    },
    subtitleText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    formContainer: {
      gap: 12,
    },
    button: {
      height: 38,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    disabledButton: {
      opacity: 0.7,
    },
    buttonText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    successText: {
      fontSize: 14,
      color: '#34C759',
      textAlign: 'center',
      marginTop: 16,
    },
    backToLoginText: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: colors.background, paddingTop: statusBarHeight },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <ThemedText type="title" style={styles.titleText}>
                {t('auth.forgotPassword')}
              </ThemedText>
              <ThemedText style={styles.subtitleText}>
                {t('auth.enterEmailForReset')}
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
              <Controller
                control={form.control}
                name="email"
                render={({
                  field: { onChange, value, onBlur },
                  fieldState: { error },
                }) => (
                  <FloatingLabelInput
                    label={t('auth.email')}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('email')}
                    isFocused={focusedField === 'email'}
                    hasValue={!!value}
                    error={error?.message}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                )}
              />

              {isSuccess && (
                <ThemedText style={styles.successText}>
                  {t('auth.resetInstructions')}
                </ThemedText>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.accentPrimary },
                  (isLoading || isSuccess) && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    {isSuccess ? t('auth.emailSent') : t('auth.resetPassword')}
                  </ThemedText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  router.back();
                }}
              >
                <ThemedText
                  style={[styles.backToLoginText, { color: colors.accentPrimary }]}
                >
                  {t('auth.backToSignIn')}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
} 