import { AuthAPI } from '@/services/api/auth';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';

/**
 * Hook to handle forgot password form state and submission
 */
export const useForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const forgotPasswordMutation = useMutation({
    mutationFn: AuthAPI.forgotPassword,
    onSuccess: () => {
      form.reset();
    },
  });
  
  const handleSubmit = form.handleSubmit(async (data) => {
    Keyboard.dismiss();
    await forgotPasswordMutation.mutateAsync(data.email);
  });
  
  return {
    form,
    isLoading: forgotPasswordMutation.isPending,
    isSuccess: forgotPasswordMutation.isSuccess,
    error: forgotPasswordMutation.error,
    handleSubmit,
  };
};

export default useForgotPasswordForm; 