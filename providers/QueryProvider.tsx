import { queryClient } from '@/services/query/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface QueryProviderProps {
  children: ReactNode;
}

export const SuspenseFallback = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const withQuerySuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <QueryProvider>
      <Suspense fallback={<SuspenseFallback />}>
        <Component {...props} />
      </Suspense>
    </QueryProvider>
  );
};

export default QueryProvider;
