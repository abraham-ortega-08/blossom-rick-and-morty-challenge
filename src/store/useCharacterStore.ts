'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Comment, FilterState, CharacterFilter, SpeciesFilter, StatusFilter, GenderFilter, SortOrder } from '@/types/character';

interface CharacterStore {
  // Favorites
  favorites: string[];
  toggleFavorite: (characterId: string) => void;
  isFavorite: (characterId: string) => boolean;
  
  // Comments
  comments: Record<string, Comment[]>;
  addComment: (characterId: string, text: string) => void;
  deleteComment: (characterId: string, commentId: string) => void;
  getComments: (characterId: string) => Comment[];
  
  // Soft Delete
  deletedCharacters: string[];
  softDeleteCharacter: (characterId: string) => void;
  restoreCharacter: (characterId: string) => void;
  isDeleted: (characterId: string) => boolean;
  
  // Selected character
  selectedCharacterId: string | null;
  setSelectedCharacterId: (id: string | null) => void;
  
  // Filters
  filters: FilterState;
  setSearch: (search: string) => void;
  setCharacterFilter: (filter: CharacterFilter) => void;
  setSpeciesFilter: (filter: SpeciesFilter) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setGenderFilter: (filter: GenderFilter) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
  
  // Filter panel visibility
  isFilterPanelOpen: boolean;
  toggleFilterPanel: () => void;
  setFilterPanelOpen: (open: boolean) => void;
}

const initialFilters: FilterState = {
  search: '',
  characterFilter: 'all',
  speciesFilter: 'all',
  statusFilter: 'all',
  genderFilter: 'all',
  sortOrder: 'asc',
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      // Favorites
      favorites: [],
      toggleFavorite: (characterId: string) => {
        set((state) => {
          const isFav = state.favorites.includes(characterId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== characterId)
              : [...state.favorites, characterId],
          };
        });
      },
      isFavorite: (characterId: string) => {
        return get().favorites.includes(characterId);
      },
      
      // Comments
      comments: {},
      addComment: (characterId: string, text: string) => {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          characterId,
          text,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          comments: {
            ...state.comments,
            [characterId]: [...(state.comments[characterId] || []), newComment],
          },
        }));
      },
      deleteComment: (characterId: string, commentId: string) => {
        set((state) => ({
          comments: {
            ...state.comments,
            [characterId]: (state.comments[characterId] || []).filter(
              (c) => c.id !== commentId
            ),
          },
        }));
      },
      getComments: (characterId: string) => {
        return get().comments[characterId] || [];
      },
      
      // Soft Delete
      deletedCharacters: [],
      softDeleteCharacter: (characterId: string) => {
        set((state) => {
          if (state.deletedCharacters.includes(characterId)) {
            return state;
          }
          return {
            deletedCharacters: [...state.deletedCharacters, characterId],
          };
        });
      },
      restoreCharacter: (characterId: string) => {
        set((state) => ({
          deletedCharacters: state.deletedCharacters.filter((id) => id !== characterId),
        }));
      },
      isDeleted: (characterId: string) => {
        return get().deletedCharacters.includes(characterId);
      },
      
      // Selected character
      selectedCharacterId: null,
      setSelectedCharacterId: (id: string | null) => {
        set({ selectedCharacterId: id });
      },
      
      // Filters
      filters: initialFilters,
      setSearch: (search: string) => {
        set((state) => ({
          filters: { ...state.filters, search },
        }));
      },
      setCharacterFilter: (characterFilter: CharacterFilter) => {
        set((state) => ({
          filters: { ...state.filters, characterFilter },
        }));
      },
      setSpeciesFilter: (speciesFilter: SpeciesFilter) => {
        set((state) => ({
          filters: { ...state.filters, speciesFilter },
        }));
      },
      setStatusFilter: (statusFilter: StatusFilter) => {
        set((state) => ({
          filters: { ...state.filters, statusFilter },
        }));
      },
      setGenderFilter: (genderFilter: GenderFilter) => {
        set((state) => ({
          filters: { ...state.filters, genderFilter },
        }));
      },
      setSortOrder: (sortOrder: SortOrder) => {
        set((state) => ({
          filters: { ...state.filters, sortOrder },
        }));
      },
      resetFilters: () => {
        set({ filters: initialFilters });
      },
      
      // Filter panel
      isFilterPanelOpen: false,
      toggleFilterPanel: () => {
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen }));
      },
      setFilterPanelOpen: (open: boolean) => {
        set({ isFilterPanelOpen: open });
      },
    }),
    {
      name: 'rick-morty-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        comments: state.comments,
        deletedCharacters: state.deletedCharacters,
      }),
    }
  )
);

