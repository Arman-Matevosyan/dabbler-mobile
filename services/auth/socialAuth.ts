import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

/**
 * Hook for handling social authentication flow
 */
export const useSocialAuth = () => {
  const handleSocialLogin = useAuthStore((state) => state.handleSocialLogin);
  const setSocialLoading = useAuthStore((state) => state.setSocialLoading);

  const startSocialLogin = async (type: 'google' | 'facebook') => {
    try {
      // Set loading state
      setSocialLoading(type);
      
      const result = await handleSocialLogin(type);
      if (result && 'authUrl' in result) {
        // Open browser for authentication
        const browserResult = await WebBrowser.openAuthSessionAsync(
          result.authUrl,
          result.callbackUrl,
          { preferEphemeralSession: true }
        );

        // Check if we have a successful redirect with token data
        if (browserResult.type === 'success' && browserResult.url) {
          // Parse the returned URL for token and type
          const params = Linking.parse(browserResult.url).queryParams as { refresh?: string; type?: string };
          const refreshToken = params?.refresh;
          const loginType = params?.type;
          
          if (refreshToken && loginType) {
            // Exchange the refresh token for real tokens
            const authResponse = await handleSocialLogin(
              loginType as 'google' | 'facebook', 
              refreshToken
            );
            
            // If we have a successful response with tokens
            if (authResponse && 'accessToken' in authResponse) {
              // Update axios default headers with the new token
              axiosClient.defaults.headers.common['Authorization'] = `Bearer ${authResponse.accessToken}`;
              
              // Invalidate user-dependent queries to refresh data
              queryClient.invalidateQueries({ queryKey: [QueryKeys.userQueryKey] });
              queryClient.invalidateQueries({ queryKey: [QueryKeys.favoritesQueryKey] });
              
              // Navigate to the authenticated section
              router.replace('/(tabs)/profile/authenticated');
              return true;
            }
          }
        }
      }
      // Clear loading state on completion or failure
      setSocialLoading(null);
      return false;
    } catch (error) {
      console.error('Social login error:', error);
      // Clear loading state on error
      setSocialLoading(null);
      return false;
    }
  };

  return { startSocialLogin };
};

/**
 * Handle deep linking for social authentication
 * @param url The URL to process
 */
export const processSocialAuthDeepLink = async (url: string) => {
  try {
    const parsed = Linking.parse(url);
    
    const refreshToken = parsed.queryParams?.refresh?.toString();
    const loginType = parsed.queryParams?.type?.toString() as 'google' | 'facebook' | undefined;
    
    if (refreshToken && loginType) {
      console.log('Deep link detected for social auth, will be handled by AuthProvider');
      return { refreshToken, loginType };
    }
    
    return null;
  } catch (error) {
    console.error('Social auth deep link processing failed:', error);
    return null;
  }
}; 