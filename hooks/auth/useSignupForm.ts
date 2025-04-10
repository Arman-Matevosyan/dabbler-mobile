import { useAuth } from '@/hooks/auth/useAuth';
import { SignupFormData, signupSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

export const useSignupForm = () => {
  const { signup, isLoading } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    try {
      await signup({
        email: data.signupEmail,
        password: data.signupPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      form.reset();
      router.replace({
        pathname: '/(tabs)/profile/authenticated',
        params: { fromAuth: 'true' },
      });
    } catch (error) {
      console.error('Signup error:', error);
    }
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
