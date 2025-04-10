import { router } from 'expo-router';

export const NavigationHandler = {
  navigateAfterLogin: (redirectPath?: string) => {
    if (redirectPath) {
      router.replace({
        pathname: redirectPath as any,
      });
    } else {
      router.replace({
        pathname: '/(tabs)/profile/authenticated',
        params: { fromAuth: 'true' },
      });
    }
  },

  navigateToLogin: (message?: string) => {
    const params: Record<string, string> = {};
    if (message) {
      params.message = message;
    }

    router.replace({
      pathname: '/(auth)/login',
      params,
    });
  },
};
