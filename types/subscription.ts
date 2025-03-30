export interface PaymentMethodDetails {
  cardType: string;
  cardholderName: string | null;
  expirationMonth: string;
  expirationYear: string;
  imageUrl: string;
  last4: string;
}

export interface PaymentMethod {
  details: PaymentMethodDetails;
  paymentMethodId: string;
  type: string;
}

export interface Plan {
  description: string;
  name: string;
  planId: string;
  price: number;
}

export interface Subscription {
  billingDayOfMonth: number;
  billingPeriodEndDate: string;
  billingPeriodStartDate: string;
  nextBillingDate: string;
  paymentMethod: PaymentMethod;
  plan: Plan;
  status: string;
  userId: string;
} 