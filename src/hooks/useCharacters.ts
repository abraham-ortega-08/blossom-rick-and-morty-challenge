'use client';

import { useQuery } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client/core';
import { GET_CHARACTERS } from '@/graphql/queries';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useDebounce } from './useDebounce';
import type { Character, CharactersResponse } from '@/types/character';
import { useMemo, useCallback, useRef, useState } from 'react';

export function useCharacters(page: number = 1) {
  const { filters, favorites } = useCharacterStore();
  const debouncedSearch = useDebounce(filters.search, 300);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const currentPageRef = useRef(1);

  // Prepare species filter for GraphQL (only Human/Alien, not 'all')
  const speciesVariable = filters.speciesFilter === 'all' ? undefined : filters.speciesFilter;

  const { data, loading, error, fetchMore, networkStatus } = useQuery<CharactersResponse>(GET_CHARACTERS, {
    variables: {
      page,
      name: debouncedSearch || undefined,
      species: speciesVariable,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Initial loading state (not fetchMore)
  const isInitialLoading = networkStatus === NetworkStatus.loading;

  // Process characters with local filters (starred/others) and sorting
  const processedCharacters = useMemo(() => {
    if (!data?.characters?.results) return { starred: [], others: [] };

    let characters = [...data.characters.results];

    // Sort by name
    characters.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    // Separate into starred and others
    const starred: Character[] = [];
    const others: Character[] = [];

    characters.forEach((char) => {
      if (favorites.includes(char.id)) {
        starred.push(char);
      } else {
        others.push(char);
      }
    });

    // Apply character filter (all, starred, others)
    if (filters.characterFilter === 'starred') {
      return { starred, others: [] };
    } else if (filters.characterFilter === 'others') {
      return { starred: [], others };
    }

    return { starred, others };
  }, [data?.characters?.results, favorites, filters.sortOrder, filters.characterFilter]);

  const loadMore = useCallback(async () => {
    const nextPage = data?.characters?.info?.next;
    
    // Prevent duplicate calls
    if (!nextPage || isLoadingMore || nextPage <= currentPageRef.current) {
      return;
    }
    
    currentPageRef.current = nextPage;
    setIsLoadingMore(true);
    
    try {
      await fetchMore({
        variables: { page: nextPage },
      });
    } catch (err) {
      // Reset on error so user can retry
      currentPageRef.current = nextPage - 1;
      console.error('Error loading more characters:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [data?.characters?.info?.next, fetchMore, isLoadingMore]);

  // Reset page ref when filters change
  const filterKey = `${debouncedSearch}-${speciesVariable}`;
  const prevFilterKeyRef = useRef(filterKey);
  if (prevFilterKeyRef.current !== filterKey) {
    prevFilterKeyRef.current = filterKey;
    currentPageRef.current = 1;
  }

  return {
    characters: data?.characters?.results || [],
    starredCharacters: processedCharacters.starred,
    otherCharacters: processedCharacters.others,
    info: data?.characters?.info,
    loading: isInitialLoading,
    isLoadingMore,
    error,
    loadMore,
    hasMore: !!data?.characters?.info?.next,
  };
}

