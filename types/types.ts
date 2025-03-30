import { useForm } from 'react-hook-form';

export interface Venue {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  activities: string[];
  address: {
    street: string;
    houseNumber: string;
    city: string;
    stateOrProvince: string;
    country: string;
    postalCode: string;
    district: string;
    landmark: string;
    addressLine2: string;
  };
  contacts: string[];
  covers: any[];
  directions: any[];
  importantInfo: string;
  location: {
    coordinates: number[];
    type: string;
  };
  openingHours: string[];
  timezone: string;
  websiteUrl: string;
  plans?: Plan[];
}

export interface VenuesData {
  data: Venue[] | undefined;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
}
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Region extends Coordinate {
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface GroupedVenues {
  [country: string]: {
    latitude: number;
    longitude: number;
    count: number;
  };
}

export type Cluster = {
  id: string;
  count: number;
  latitude: number;
  longitude: number;
  venues: Venue[];
};

export interface ClusterMarkerProps {
  cluster: Cluster;
  onPress?: (venue: Venue) => void;
  isActive?: boolean;
}

export interface FieldType {
  name: string;
  label: string;
  placeholder: string;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  icon: string;
}

interface LoginModalData {
  type: 'login';
  visible: boolean;
  title: 'Login';
  form: ReturnType<typeof useForm<{ email: string; password: string }>>;
  fields: FieldType[];
  loading: boolean;
  onClose: () => void;
}

interface SignupModalData {
  type: 'signup';
  visible: boolean;
  title: 'Sign Up';
  form: ReturnType<
    typeof useForm<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      confirmPassword: string;
    }>
  >;
  fields: FieldType[];
  loading: boolean;
  onClose: () => void;
}

export interface PaymentMethod {
  token?: string;
  id?: string;
  type?: string;
  customerId?: string;
  details?: {
    cardType?: string;
    cardholderName?: string;
    expirationMonth?: string;
    expirationYear?: string;
    imageUrl?: string;
    last4?: string;
  };
  createdAt?: string;
  updated?: string;
  userId?: string;
}

export interface PlanVenue {
  id: string;
  name: string;
}

export interface Plan {
  id?: string;
  planId?: string;
  name?: string;
  description?: string;
  price?: number;
  countryCode?: string;
  currencyIsoCode?: string;
  limit?: number;
  interval?: 'month' | 'year';
  features?: string[];
  venues?: PlanVenue[];
  isActive?: boolean;
  createdAt?: string;
}

export interface Subscription {
  id?: string;
  planId?: string;
  userId?: string;
  plan?: Plan;
  status?: string;
  billingPeriodStartDate?: string;
  billingPeriodEndDate?: string;
  nextBillingDate?: string;
  paymentMethod?: {
    details: any;
    paymentMethodId: string;
    type: string;
  };
  createdAt?: string;
}

export type AuthModalData = LoginModalData | SignupModalData;

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  isVerified?: boolean;
}
