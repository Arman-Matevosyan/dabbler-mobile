import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/auth/useAuth';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface SocialLoginButtonsProps {
  containerStyle?: object;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  containerStyle,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { handleSocialLogin, socialLoading } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      borderRadius: 18,
      gap: 0,
    },
    facebookButton: {
      backgroundColor: '#1877F2',
    },
    googleButton: {
      backgroundColor: '#DB4437',
    },
    socialButtonText: {
      display: 'none',
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.socialButton, styles.facebookButton]}
        onPress={() => handleSocialLogin('facebook')}
        disabled={socialLoading !== null}
      >
        {socialLoading === 'facebook' ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <MaterialCommunityIcons name="facebook" size={18} color="white" />
            <ThemedText style={styles.socialButtonText}>Facebook</ThemedText>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.socialButton, styles.googleButton]}
        onPress={() => handleSocialLogin('google')}
        disabled={socialLoading !== null}
      >
        {socialLoading === 'google' ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <MaterialCommunityIcons name="google" size={18} color="white" />
            <ThemedText style={styles.socialButtonText}>Google</ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
