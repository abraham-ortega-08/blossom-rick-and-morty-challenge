import { ApolloClient } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { HttpLink } from '@apollo/client/link/http';

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/graphql';

interface CharacterResult {
  __ref: string;
}

interface CharactersData {
  info: {
    count: number;
    pages: number;
    next: number | null;
    prev: number | null;
  };
  results: CharacterResult[];
}

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: RICK_AND_MORTY_API,
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            characters: {
              // Cache separately based on filter params (not page)
              keyArgs: ['filter'],
              merge(existing: CharactersData | undefined, incoming: CharactersData, { args }) {
                // If it's the first page or no existing data, return incoming
                if (!existing || args?.page === 1) {
                  return incoming;
                }
                
                // Merge results avoiding duplicates
                const existingRefs = new Set(
                  existing.results?.map((c) => c.__ref) || []
                );
                const newResults = incoming.results?.filter(
                  (c) => !existingRefs.has(c.__ref)
                ) || [];

                return {
                  ...incoming,
                  results: [...existing.results, ...newResults],
                };
              },
            },
          },
        },
      },
    }),
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
