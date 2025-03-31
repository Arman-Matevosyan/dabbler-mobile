import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { signupFields } from '@/constants/FormFields';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
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
  secureTextEntry?: boolean;
}

const FloatingLabelInput = ({
  label,
  isFocused,
  hasValue,
  error,
  secureTextEntry,
  ...props
}: FloatingLabelInputProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [showPassword, setShowPassword] = useState(false);

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
      top: -12,
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
    passwordToggle: {
      padding: 4,
      marginTop: 2,
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
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={inputStyles.passwordToggle}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={colors.accentPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={inputStyles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={14}
            color={colors.errorText}
          />
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

export default function SignupScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const statusBarHeight = useStatusBarHeight();
  const { form: signupForm, handleSubmit, isLoading } = useSignupForm();
  const [showPassword, setShowPassword] = useState(false);
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
    },
    formContainer: {
      gap: 12,
    },
    button: {
      height: 38,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    buttonText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    toggleText: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 12,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    divider: {
      flex: 1,
      height: 1,
    },
    dividerText: {
      marginHorizontal: 10,
      fontSize: 12,
      color: colors.textSecondary,
    },
    termsText: {
      fontSize: 10,
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 14,
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
                {t('auth.createAccount')}
              </ThemedText>
              <ThemedText style={styles.subtitleText}>
                {t('auth.joinCommunity')}
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
              {signupFields.map((field) => (
                <Controller
                  key={field.name}
                  control={signupForm.control}
                  name={field.name as never}
                  render={({
                    field: { onChange, value, onBlur },
                    fieldState: { error },
                  }) => (
                    <FloatingLabelInput
                      label={
                        field.name === 'signupEmail'
                          ? t('auth.email')
                          : field.name === 'signupPassword'
                          ? t('auth.password')
                          : field.name === 'confirmPassword'
                          ? t('auth.confirmPassword')
                          : field.name === 'firstName'
                          ? t('auth.firstName')
                          : t('auth.lastName')
                      }
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField(field.name)}
                      isFocused={focusedField === field.name}
                      hasValue={!!value}
                      error={error?.message}
                      autoCapitalize={field.autoCapitalize || 'none'}
                      keyboardType={field.keyboardType}
                      secureTextEntry={field.secureTextEntry && !showPassword}
                      autoCorrect={false}
                    />
                  )}
                />
              ))}

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.accentPrimary },
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <ThemedText style={styles.buttonText}>
                    {t('auth.createAccount')}
                  </ThemedText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  router.push('/(auth)/login');
                }}
              >
                <ThemedText
                  style={[styles.toggleText, { color: colors.accentPrimary }]}
                >
                  {t('auth.hasAccount')} {t('auth.signIn')}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  router.push('/(auth)/forgot-password');
                }}
                style={{ alignItems: 'center', marginTop: 4 }}
              >
                <ThemedText
                  style={{ fontSize: 12, color: colors.accentPrimary }}
                >
                  {t('auth.forgotPassword')}
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.dividerContainer}>
                <View
                  style={[styles.divider, { backgroundColor: colors.divider }]}
                />
                <ThemedText style={styles.dividerText}>
                  {t('auth.or')}
                </ThemedText>
                <View
                  style={[styles.divider, { backgroundColor: colors.divider }]}
                />
              </View>

              <SocialLoginButtons />

              <ThemedText
                style={[styles.termsText, { color: colors.textSecondary }]}
              >
                {t('auth.termsSignUp')}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
