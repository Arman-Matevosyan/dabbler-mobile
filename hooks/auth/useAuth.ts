import { axiosClient } from '@/api';
import { AuthQueryKeys, UserQueryKeys } from '@/constants/QueryKeys';
import { AuthAPI, AuthResponse, SocialAuthResult, extractTokenFromUrl } from '@/services/api/auth';
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
      await authUtils.setTokens(data.accessToken, data.refreshToken);

      queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
        isAuthenticated: true,
      });
      verifyEmailMutation.mutate();
      invalidateAuthDependentQueries();
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
      await authUtils.setTokens(data.accessToken, data.refreshToken);

      queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
        isAuthenticated: true,
      });
      verifyEmailMutation.mutate();
      invalidateAuthDependentQueries();
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      return await AuthAPI.logout();
    },
    onSuccess: async () => {
      await authUtils.clearTokens();

      queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
        isAuthenticated: false,
      });

      queryClient.clear();

      router.replace('/(tabs)/profile/unauthenticated');
    },
  });

  // Legacy social login method 
  const handleSocialLogin = useCallback(
    async (
      type: 'google' | 'facebook',
      token?: string
    ): Promise<AuthResponse | SocialAuthResult> => {
      setSocialLoading(type);
      try {
        if (token) {
          const response = await AuthAPI.refreshToken(token);
          await authUtils.setTokens(
            response.accessToken,
            response.refreshToken
          );

          queryClient.setQueryData([AuthQueryKeys.AUTH_STATE], {
            isAuthenticated: true,
          });

          invalidateAuthDependentQueries();

          return response;
        } else {
          return {
            authUrl:
              type === 'google'
                ? AuthAPI.googleLogin()
                : AuthAPI.facebookLogin(),
            callbackUrl: 'dabbler://auth',
          };
        }
      } catch (error) {
        console.error('Social login error:', error);
        throw error;
      } finally {
        setSocialLoading(null);
      }
    },
    []
  );

  // New WebBrowser-based social login
  const startSocialLogin = useCallback(async (
    type: 'google' | 'facebook'
  ): Promise<boolean> => {
    setSocialLoading(type);
    
    try {
      // Get auth URL
      const authUrl = type === 'google' 
        ? AuthAPI.googleLogin() 
        : AuthAPI.facebookLogin();
      
      // Open browser for auth
      const browserResult = await WebBrowser.openAuthSessionAsync(
        authUrl,
        'dabbler://auth',
        { preferEphemeralSession: true }
      );

      if (browserResult.type !== 'success' || !browserResult.url) {
        setSocialLoading(null);
        return false;
      }

      // Extract token from URL
      const tokenData = extractTokenFromUrl(browserResult.url);
      if (!tokenData?.token) {
        setSocialLoading(null);
        return false;
      }

      // Exchange token
      const result = await AuthAPI.exchangeToken(
        tokenData.token, 
        tokenData.type
      );
      
      if (result.success) {
        // Set authorization header
        if (result.accessToken) {
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${result.accessToken}`;
        }
        
        // Navigate to profile
        router.replace('/(tabs)/profile/authenticated');
        setSocialLoading(null);
        return true;
      }

      setSocialLoading(null);
      return false;
    } catch (error) {
      console.error('Social login error:', error);
      setSocialLoading(null);
      return false;
    }
  }, []);

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
    handleSocialLogin, // Legacy method
    startSocialLogin, // New WebBrowser-based method
    error:
      userQuery.error ||
      loginMutation.error ||
      signupMutation.error ||
      logoutMutation.error,
  };
}

export default useAuth;
