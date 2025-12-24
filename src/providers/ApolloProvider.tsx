'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { getApolloClient } from '@/lib/apollo-client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const client = getApolloClient();
  
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}

