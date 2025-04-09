import { useAuth } from '@/hooks/auth/useAuth';
import { LoginFormData, loginSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

export const useLoginForm = () => {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    login({ email: data.loginEmail, password: data.loginPassword });
    form.reset();
  });

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
