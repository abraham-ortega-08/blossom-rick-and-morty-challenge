'use client';

import { useQuery } from '@apollo/client/react';
import { GET_CHARACTER } from '@/graphql/queries';
import { useCharacterStore } from '@/store/useCharacterStore';
import type { CharacterResponse } from '@/types/character';

export function useCharacterDetail(id: string | null) {
  const { isDeleted } = useCharacterStore();
  const { data, loading, error } = useQuery<CharacterResponse>(GET_CHARACTER, {
    variables: { id },
    skip: !id,
  });

  // Check if character is deleted
  const characterIsDeleted = id ? isDeleted(id) : false;

  return {
    character: characterIsDeleted ? null : (data?.character || null),
    loading,
    error: characterIsDeleted ? new Error('Character has been deleted') : error,
    isDeleted: characterIsDeleted,
  };
}

