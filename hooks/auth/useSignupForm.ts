import { useAuth } from '@/hooks/auth/useAuth';
import { SignupFormData, signupSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

export const useSignupForm = () => {
  const { signup, isLoading } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    signup({
      email: data.signupEmail,
      password: data.signupPassword,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    form.reset();
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
