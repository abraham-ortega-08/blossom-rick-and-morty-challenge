import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/graphql';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: RICK_AND_MORTY_API,
    }),
    cache: new InMemoryCache(),
  });
}

let apolloClient: ApolloClient | null = null;

export function getApolloClient() {
  if (!apolloClient || typeof window === 'undefined') {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

export { RICK_AND_MORTY_API };

