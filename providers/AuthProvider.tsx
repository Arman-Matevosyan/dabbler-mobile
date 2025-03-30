import { QueryKeys } from '@/constants/QueryKeys';
import { queryClient } from '@/lib/queryClient';
import { useSocialAuth } from '@/services/auth/socialAuth';
import { initializeAuth, useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import React, { useCallback } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  React.useEffect(() => {
    initializeAuth();
  }, []);

  return <>{children}</>;
};

// Re-export the social auth hook for convenience
export { useSocialAuth };

export const useAuth = () => {
  const authState = useAuthStore();
  const { startSocialLogin } = useSocialAuth();
  
  // Handle login success with query invalidation
  const handleLoginSuccess = useCallback(() => {
    // Invalidate relevant queries to refetch fresh data
    queryClient.invalidateQueries({ queryKey: [QueryKeys.userQueryKey] });
    queryClient.invalidateQueries({ queryKey: [QueryKeys.favoritesQueryKey] });
    queryClient.invalidateQueries({ queryKey: [QueryKeys.userSessionQueryKey] });
    
    // Navigate to authenticated section
    router.replace('/(tabs)/profile/authenticated');
  }, []);

  // Enhanced login that also manages query cache
  const enhancedLogin = useCallback(async (email: string, password: string) => {
    try {
      await authState.login(email, password);
      handleLoginSuccess();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [authState.login, handleLoginSuccess]);

  // Enhanced logout that also clears query cache
  const enhancedLogout = useCallback(async () => {
    try {
      await authState.logout();

      // Remove all user-dependent queries from cache
      queryClient.removeQueries({ queryKey: [QueryKeys.userQueryKey] });
      queryClient.removeQueries({ queryKey: [QueryKeys.userSessionQueryKey] });
      queryClient.removeQueries({ queryKey: [QueryKeys.favoritesQueryKey] });
      queryClient.removeQueries({
        queryKey: [QueryKeys.subscriptionsQueryKey],
      });
      queryClient.removeQueries({
        queryKey: [QueryKeys.paymentMethodsQueryKey],
      });
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
  };
};

export default AuthProvider;
