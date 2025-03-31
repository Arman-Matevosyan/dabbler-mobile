import { getBaseURL } from '@/constants/constants';
import {
    processSocialAuthDeepLink,
    useSocialAuth,
} from '@/services/auth/socialAuth';
import {
    invalidateAuthDependentQueries,
    queryClient,
} from '@/services/query/queryClient';
import { initializeAuth, useAuthStore } from '@/store/authStore';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const handleSocialLogin = useAuthStore((state) => state.handleSocialLogin);
  const setTokens = useAuthStore((state) => state.setTokens);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (url.includes('dabler') || url.includes('dabbler')) {
        const result = await processSocialAuthDeepLink(url);

        if (result?.refreshToken) {
          try {
            if (result.loginType && result.loginType !== 'unknown') {
              await handleSocialLogin(
                result.loginType as 'google' | 'facebook',
                result.refreshToken
              );
            } else {
              const response = await fetch(`${getBaseURL()}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: result.refreshToken }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                  await setTokens(
                    data.accessToken,
                    data.refreshToken || result.refreshToken
                  );
                  await fetchUser();
                }
              }
            }

            invalidateAuthDependentQueries();

            router.replace('/(tabs)/profile/authenticated');
          } catch (error) {
            console.error('Error handling deep link auth:', error);
          }
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleSocialLogin, setTokens, fetchUser]);

  return <>{children}</>;
};

export { useSocialAuth };

export const useAuth = () => {
  const authState = useAuthStore();
  const { startSocialLogin } = useSocialAuth();

  const handleLoginSuccess = useCallback(() => {
    invalidateAuthDependentQueries();

    router.replace('/(tabs)/profile/authenticated');
  }, []);

  const enhancedLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await authState.login(email, password);
        handleLoginSuccess();
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    [authState.login, handleLoginSuccess]
  );
  const enhancedSingup = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      try {
        await authState.signup(email, password, firstName, lastName);
        handleLoginSuccess();
        return true;
      } catch (error) {
        console.error('Signup error:', error);
        return false;
      }
    },
    [authState.signup, handleLoginSuccess]
  );
  const enhancedLogout = useCallback(async () => {
    try {
      await authState.logout();

      queryClient.clear();

      router.replace('/(tabs)/profile/unauthenticated');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [authState.logout]);

  return {
    ...authState,
    handleSocialLogin: startSocialLogin,
    login: enhancedLogin,
    logout: enhancedLogout,
    signup: enhancedSingup,
  };
};

export default AuthProvider;
