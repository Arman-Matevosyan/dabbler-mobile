import { axiosClient } from '@/api';
import {
  IPaymentGatewayToken,
  IPaymentMethod,
  IPlan,
  ISubscription,
  ISubscriptionCreateRequest,
  ISubscriptionCreateResponse,
} from '@/hooks/payment/payment.interfaces';
import { AxiosRequestConfig } from 'axios';

interface CustomAxiosConfig extends AxiosRequestConfig {
  skipErrorTooltip?: boolean;
}

export const PaymentAPI = {
  getPlans: async (): Promise<IPlan[]> => {
    const response = await axiosClient.get('/payment/plans');
    return response.data.response;
  },

  getSubscriptions: async (): Promise<ISubscription> => {
    const config: CustomAxiosConfig = {
      skipErrorTooltip: true,
    };
    const response = await axiosClient.get('/payment/subscriptions/me', config);
    return response.data.response;
  },

  getSubscriptionQuery: async (): Promise<ISubscription | null> => {
    const config: CustomAxiosConfig = {
      skipErrorTooltip: true,
    };
    try {
      const response = await axiosClient.get(
        '/payment/subscriptions/me',
        config
      );
      return response.data.response;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  },

  getPaymentMethods: async (): Promise<IPaymentMethod[]> => {
    const config: CustomAxiosConfig = {
      skipErrorTooltip: true,
    };
    const response = await axiosClient.get(
      '/payment/payment-methods/me',
      config
    );
    return response.data.response;
  },

  getClientToken: async (): Promise<IPaymentGatewayToken[]> => {
    const response = await axiosClient.get('/payment/gateway/token');
    return response.data.response;
  },

  subscribe: async (
    subData: ISubscriptionCreateRequest
  ): Promise<ISubscriptionCreateResponse[]> => {
    const response = await axiosClient.post('/payment/subscriptions', subData);
    return response.data.response;
  },

  verifyPayment: async (paymentData: any) => {
    const response = await axiosClient.post(
      '/payment/payment-methods/me',
      paymentData
    );
    return response.data.response;
  },
};
