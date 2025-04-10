import { useAuth } from '@/hooks/auth/useAuth';
import { LoginFormData, loginSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

export const useLoginForm = () => {
  const { loginAsync, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    try {
      await loginAsync({
        email: data.loginEmail,
        password: data.loginPassword,
      });
      form.reset();
      router.replace({
        pathname: '/(tabs)/profile/authenticated',
        params: { fromAuth: 'true' },
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
