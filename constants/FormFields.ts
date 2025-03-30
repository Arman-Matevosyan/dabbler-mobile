import { FieldType } from '@/types/types';

export const loginFields: FieldType[] = [
  {
    name: 'loginEmail',
    placeholder: 'Email',
    autoCapitalize: 'none',
    keyboardType: 'email-address',
  },
  { name: 'loginPassword', placeholder: 'Password', secureTextEntry: true },
];

export const signupFields: FieldType[] = [
  {
    name: 'firstName',
    placeholder: 'First Name',
    autoCapitalize: 'words',
  },
  {
    name: 'lastName',
    placeholder: 'Last Name',
    autoCapitalize: 'words',
  },
  {
    name: 'signupEmail',
    placeholder: 'Email',
    autoCapitalize: 'none',
    keyboardType: 'email-address',
  },
  { name: 'signupPassword', placeholder: 'Password', secureTextEntry: true },
  {
    name: 'confirmPassword',
    placeholder: 'Confirm Password',
    secureTextEntry: true,
  },
];
