import { useAuth } from '@/providers/AuthProvider';
import { LoginFormData, loginSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

/**
 * Hook to handle login form state and submission
 */
export const useLoginForm = () => {
  const { login, isLoading } = useAuth();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    await login(data.loginEmail, data.loginPassword);
    form.reset();
  });
  
  return {
    form,
    isLoading,
    handleSubmit,
  };
}; 