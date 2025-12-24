'use client';

import { useQuery } from '@apollo/client/react';
import { GET_CHARACTER } from '@/graphql/queries';
import type { CharacterResponse } from '@/types/character';

export function useCharacterDetail(id: string | null) {
  const { data, loading, error } = useQuery<CharacterResponse>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  });

  return {
    character: data?.character || null,
    loading,
    error,
  };
}

