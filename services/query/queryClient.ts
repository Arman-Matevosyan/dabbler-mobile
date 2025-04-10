import {
  ActivityQueryKeys,
  AuthQueryKeys,
  ClassQueryKeys,
  ContentQueryKeys,
  PaymentQueryKeys,
  UserQueryKeys,
  VenueQueryKeys,
} from '@/constants/QueryKeys';
import { showErrorTooltip } from '@/hooks/tooltip';
import NetInfo from '@react-native-community/netinfo';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

const onError = (error: any) => {
  if (error?.response?.status === 401) {
    return;
  }
  
  if (error?.message?.includes('Network Error') || error?.code === 'ECONNABORTED') {
    return;
  }
  
  showErrorTooltip(error);
};

const queryCache = new QueryCache({
  onError,
});

const mutationCache = new MutationCache({
  onError,
});

const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return !!(state.isConnected && state.isInternetReachable);
};

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000,  
      
      networkMode: 'online',    
      
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        
        if (error?.response?.status === 404) {
          return false;
        }
        
        return failureCount < 2;
      },
      
      refetchOnWindowFocus: false,
      
    },
    mutations: {
      retry: false,
      
      networkMode: 'online',
    },
  },
});

export const invalidateAuthDependentQueries = () => {
  queryClient.invalidateQueries({ queryKey: createQueryKeys.user.data() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.auth.session() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.auth.userAvatar() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.venues.favorites() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.classes.schedules() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.payment.methods() });
  queryClient.invalidateQueries({ queryKey: createQueryKeys.payment.subscriptions() });
};

export const createQueryKeys = {
  auth: {
    state: () => [AuthQueryKeys.AUTH_STATE],
    session: () => [AuthQueryKeys.SESSION],
    token: () => [AuthQueryKeys.TOKEN],
    refresh: () => [AuthQueryKeys.REFRESH],
    userAvatar: () => [AuthQueryKeys.USER_AVATAR],
  },
  
  venues: {
    data: () => [VenueQueryKeys.venuesData],
    search: () => [VenueQueryKeys.venuesSearch],
    byCoords: (coords?: any) => [VenueQueryKeys.venuesByCoords, coords],
    details: (id: string) => [VenueQueryKeys.venueDetails, id],
    plans: (id: string) => [VenueQueryKeys.venuePlans, id],
    searchBottomSheet: () => [VenueQueryKeys.venuesSearchBottomSheet],
    favorites: () => [VenueQueryKeys.favorites],
  },
  
  user: {
    session: () => [UserQueryKeys.userSession],
    data: () => [UserQueryKeys.userData],
    checkins: () => [UserQueryKeys.checkins],
  },
  
  payment: {
    subscriptions: () => [PaymentQueryKeys.subscriptions],
    plans: () => [PaymentQueryKeys.plans],
    methods: () => [PaymentQueryKeys.paymentMethods],
    gatewayToken: () => [PaymentQueryKeys.gatewayToken],
    success: (id?: string) => [PaymentQueryKeys.paymentSuccess, id],
    createSubscription: () => [PaymentQueryKeys.createSubscription],
  },
  
  classes: {
    search: (params?: any) => [ClassQueryKeys.classesSearch, params],
    venueClasses: (venueId: string) => [ClassQueryKeys.venueClasses, venueId],
    details: (id: string) => [ClassQueryKeys.classDetails, id],
    schedules: (params?: any) => [ClassQueryKeys.schedules, params],
    booking: (id: string) => [ClassQueryKeys.classBooking, id],
    cancelBooking: (id: string) => [ClassQueryKeys.cancelBooking, id],
    discover: {
      search: (params?: any) => [ClassQueryKeys.discoverSearch, params],
      venue: (venueId: string) => [ClassQueryKeys.discoverVenue, venueId],
      checkins: () => [ClassQueryKeys.discoverCheckins],
      schedules: (params?: any) => [ClassQueryKeys.discoverSchedules, params],
      allSchedules: () => [ClassQueryKeys.discoverAllSchedules],
      details: (id: string) => [ClassQueryKeys.discoverClassDetails, id],
    },
  },
  
  content: {
    categories: () => [ContentQueryKeys.categories],
  },
  
  activity: {
    data: () => [ActivityQueryKeys.activity],
  },
};
