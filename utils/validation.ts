import { z } from 'zod';

export const loginSchema = z.object({
  loginEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  loginPassword: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    signupEmail: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    signupPassword: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter'),
  })
  .refine((data) => data.signupPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
