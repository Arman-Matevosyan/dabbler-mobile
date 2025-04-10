import { axiosClient } from '@/api';
import { AuthQueryKeys, UserQueryKeys } from '@/constants/QueryKeys';
import {
  AuthAPI,
  AuthResponse,
  extractTokenFromUrl,
} from '@/services/api/auth';
import { UserAPI } from '@/services/api/user';
import {
  invalidateAuthDependentQueries,
  queryClient,
} from '@/services/query/queryClient';
import { IUserProfile } from '@/types/user';
import * as authUtils from '@/utils/authUtils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';

export { authUtils };

export function useAuth() {
  const [socialLoading, setSocialLoading] = useState<
    'google' | 'facebook' | null
  >(null);
  const [socialLoginError, setSocialLoginError] = useState<string | null>(null);

  const authStateQuery = useQuery({
    queryKey: [AuthQueryKeys.AUTH_STATE],
    queryFn: async () => {
      const isAuthenticated = await authUtils.checkAuthenticated();
      return { isAuthenticated };
    },
    staleTime: Infinity,
  });

  const isAuthenticated = authStateQuery.data?.isAuthenticated || false;

  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthenticated = await authUtils.checkAuthenticated();
      if (isAuthenticated) {
        queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
          isAuthenticated: true,
        });
      }
    };

    initializeAuth();
  }, []);

  const userQuery = useQuery<IUserProfile | null>({
    queryKey: [UserQueryKeys.userData],
    queryFn: async () => {
      try {
        const response = await UserAPI.getCurrentUser();
        if (!response) {
          console.error('User API returned empty response');
          return null;
        }
        return response;
      } catch (error) {
        const refreshed = await authUtils.refreshTokens();
        if (refreshed) {
          try {
            const userData = await UserAPI.getCurrentUser();
            if (!userData) {
              console.error(
                'User API returned empty response after token refresh'
              );
              return null;
            }
            return userData;
          } catch (secondError) {
            console.error(
              'Error fetching user after token refresh:',
              secondError
            );
            return null;
          }
        }

        queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
          isAuthenticated: false,
        });
        return null;
      }
    },
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) => {
      return await AuthAPI.login(email, password);
    },
    onSuccess: async (data) => {
      try {
        await authUtils.setTokens(data.accessToken, data.refreshToken);

        queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
          isAuthenticated: true,
        });
        verifyEmailMutation.mutate();
        invalidateAuthDependentQueries();
      } finally {
        router.replace({
          pathname: '/(tabs)/profile/authenticated',
          params: { fromAuth: 'true' },
        });
      }
    },
  });

  const signupMutation = useMutation<
    AuthResponse,
    Error,
    { email: string; password: string; firstName: string; lastName: string }
  >({
    mutationFn: async ({ email, password, firstName, lastName }) => {
      return await AuthAPI.signup(email, password, firstName, lastName);
    },
    onSuccess: async (data) => {
      try {
        await authUtils.setTokens(data.accessToken, data.refreshToken);

        queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
          isAuthenticated: true,
        });
        verifyEmailMutation.mutate();
        invalidateAuthDependentQueries();
      } finally {
        router.replace({
          pathname: '/(tabs)/profile/authenticated',
          params: { fromAuth: 'true' },
        });
      }
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await AuthAPI.logout();
    },
    onSuccess: async () => {
      await authUtils.clearTokens();

      queryClient.clear();
      queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
        isAuthenticated: false,
      });
    },
  });

  const startSocialLogin = useCallback(
    async (type: 'google' | 'facebook'): Promise<boolean> => {
      setSocialLoading(type);
      setSocialLoginError(null);

      try {
        const authUrl =
          type === 'google' ? AuthAPI.googleLogin() : AuthAPI.facebookLogin();

        const browserResult = await WebBrowser.openAuthSessionAsync(
          authUrl,
          'dabbler://auth',
          { preferEphemeralSession: true }
        );

        // Handle cancellation
        if (browserResult.type === 'cancel') {
          setSocialLoading(null);
          return false;
        }

        if (browserResult.type !== 'success' || !browserResult.url) {
          setSocialLoading(null);
          setSocialLoginError(`${type} login failed. Please try again.`);
          return false;
        }

        const tokenData = extractTokenFromUrl(browserResult.url);
        if (!tokenData?.token) {
          setSocialLoading(null);
          setSocialLoginError(`Unable to extract token from ${type} response.`);
          return false;
        }

        const result = await AuthAPI.exchangeToken(
          tokenData.token,
          tokenData.type
        );

        if (result.success) {
          if (result.accessToken) {
            await authUtils.setTokens(
              result.accessToken,
              result.refreshToken || tokenData.token
            );

            queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
              isAuthenticated: true,
            });

            invalidateAuthDependentQueries();

            axiosClient.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${result.accessToken}`;
          }

          router.replace({
            pathname: '/(tabs)/profile/authenticated',
            params: { fromAuth: 'true' },
          });
          setSocialLoading(null);
          return true;
        }

        setSocialLoading(null);
        setSocialLoginError(
          `Unable to complete ${type} login. Please try again.`
        );
        return false;
      } catch (error) {
        console.error('Social login error:', error);
        setSocialLoading(null);
        setSocialLoginError(
          `${type} login encountered an error. Please try again.`
        );
        return false;
      }
    },
    []
  );

  const verifyEmailMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await UserAPI.verifyEmail();
    },
  });

  return {
    user: userQuery.data,
    isLoading:
      userQuery.isLoading ||
      authStateQuery.isLoading ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
    isAuthenticated,
    socialLoading,
    socialLoginError,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutate,
    verifyEmailAsync: verifyEmailMutation.mutateAsync,
    refreshTokens: authUtils.refreshTokens,
    setTokens: authUtils.setTokens,
    startSocialLogin,
    error:
      userQuery.error ||
      loginMutation.error ||
      signupMutation.error ||
      logoutMutation.error,
  };
}

export default useAuth;
