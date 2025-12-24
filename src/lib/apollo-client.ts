import { ApolloClient } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from '@apollo/client/link/http';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/graphql';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: RICK_AND_MORTY_API,
    }),
    cache: new InMemoryCache(),
  });
}

let apolloClient: ReturnType<typeof createApolloClient> | null = null;

export function getApolloClient() {
  if (!apolloClient || typeof window === 'undefined') {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

export { RICK_AND_MORTY_API };
