import { useAuth } from '@/providers/AuthProvider';
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
    await signup(
      data.signupEmail,
      data.signupPassword,
      data.firstName,
      data.lastName
    );
    form.reset();
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
