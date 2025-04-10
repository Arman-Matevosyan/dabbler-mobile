import { AuthQueryKeys } from '@/constants/QueryKeys';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

/**
 * Hook for accessing authentication functionality
 * This hook is a facade for the authentication store that adds React Query integration
 * and navigation capabilities.
 */
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get auth state from store
  const {
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    isRefreshing,
    error,

    // Social login state
    socialLoginLoading,
    socialLoginError,

    // Auth operations
    login,
    signup,
    logout,
    forgotPassword,
    startSocialLogin,
  } = useAuthStore();

  // Get user data
  const { user } = useUserStore();

  // Auth state query
  const authQuery = useQuery({
    queryKey: [AuthQueryKeys.AUTH_STATE],
    queryFn: () => ({ isAuthenticated }),
    initialData: { isAuthenticated },
  });

  // Navigation helpers
  const navigateAfterLogin = useCallback(() => {
    router.replace('/(tabs)' as any);
  }, [router]);

  const navigateToLogin = useCallback(() => {
    router.replace('/login' as any);
  }, [router]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await login(email, password);
      if (!result) throw new Error(error || 'Login failed');
      return result;
    },
    onSuccess: () => {
      navigateAfterLogin();
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const result = await signup(email, password, firstName, lastName);
      if (!result) throw new Error(error || 'Signup failed');
      return result;
    },
    onSuccess: () => {
      navigateAfterLogin();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigateToLogin();
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const result = await forgotPassword(email);
      if (!result) throw new Error(error || 'Failed to request password reset');
      return result;
    },
  });

  // Social login mutation
  const socialLoginMutation = useMutation({
    mutationFn: async ({
      provider,
      redirectUrl,
    }: {
      provider: 'google' | 'facebook';
      redirectUrl: string;
    }) => {
      const result = await startSocialLogin(provider, redirectUrl);
      if (!result.success) {
        throw new Error(socialLoginError || `Failed to login with ${provider}`);
      }
      return result;
    },
    onSuccess: () => {
      navigateAfterLogin();
    },
  });

  return {
    // State
    isLoading:
      isLoading ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
    isAuthenticated: authQuery.data?.isAuthenticated || false,
    error,
    user,
    accessToken,
    refreshToken,

    // Social login
    socialLoginLoading: socialLoginLoading || socialLoginMutation.isPending,
    socialLoginError,

    // Actions
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    socialLogin: socialLoginMutation.mutate,
  };
};
