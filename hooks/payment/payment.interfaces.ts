export interface IPaymentGatewayToken {
  token: string;
  merchantId: string;
}

export interface IPaymentGatewayTokenResponse {
  response: IPaymentGatewayToken[];
  metadata: {
    next_page?: string;
  };
}

export interface IPaymentMethodDetails {
  cardType: string;
  cardholderName: string;
  expirationMonth: string;
  expirationYear: string;
  imageUrl: string;
  last4: string;
}

export interface IPaymentMethod {
  id: string;
  token: string;
  type: string;
  details: IPaymentMethodDetails;
}

export interface IPaymentMethodsResponse {
  response: IPaymentMethod[];
  metadata: {
    next_page?: string;
  };
}

export interface IPlan {
  id: string;
  name: string;
  isActive: boolean;
  limit: number;
  description: string;
  countryCode: string;
  venues: string[];
  currencyIsoCode: string;
  price: number;
  trialPeriod: boolean;
  trialDuration: number;
  trialDurationUnit: string;
  planId: string;
}

export interface IPlansResponse {
  response: IPlan[];
  metadata: {
    next_page?: string;
  };
}

export interface ISubscriptionPlan {
  planId: string;
  name: string;
  description: string;
  price: number;
  limit?: number;
  countryCode?: string;
  venues?: string[];
  currencyIsoCode?: string;
}

export interface ISubscriptionPaymentMethod {
  paymentMethodId: string;
  type: string;
  details: Record<string, any>;
}

export interface ISubscription {
  userId: string;
  status: string;
  billingDayOfMonth: number;
  billingPeriodStartDate: string;
  billingPeriodEndDate: string;
  nextBillingDate: string;
  plan: ISubscriptionPlan;
  paymentMethod?: ISubscriptionPaymentMethod;
}

export interface ISubscriptionsResponse {
  response: ISubscription;
  metadata: {
    next_page?: string;
  };
}

export interface ISubscriptionCreateRequest {
  planId: string;
  paymentMethodId: string;
}

export interface ISubscriptionCreateResponse {
  id: string;
  userId: string;
  status: string;
  planId: string;
  paymentMethodId: string;
}

export interface ISubscriptionCreateResponseWrapper {
  response: ISubscriptionCreateResponse[];
  metadata: {
    next_page?: string;
  };
}

export interface ISubscriptionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface IAdminSubscription {
  id: string;
  status: string;
  billingDayOfMonth: number;
  billingPeriodStartDate: string;
  billingPeriodEndDate: string;
  nextBillingDate: string;
  user: ISubscriptionUser;
  plan: {
    id: string;
    name: string;
    price: number;
    currencyIsoCode: string;
  };
}

export interface IAdminSubscriptionsResponse {
  response: IAdminSubscription[];
  metadata: {
    next_page?: string;
  };
}
