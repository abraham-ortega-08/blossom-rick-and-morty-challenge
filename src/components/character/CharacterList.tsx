'use client';

import { memo, useCallback, useMemo } from 'react';
import { CharacterCard } from './CharacterCard';
import { CharacterFilters } from './CharacterFilters';
import { SearchInput } from '@/components/ui/SearchInput';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacters } from '@/hooks/useCharacters';

export const CharacterList = memo(function CharacterList() {
  const { 
    filters, 
    setSearch, 
    selectedCharacterId, 
    setSelectedCharacterId,
    isFilterPanelOpen,
    toggleFilterPanel,
  } = useCharacterStore();
  
  const { starredCharacters, otherCharacters, loading, error } = useCharacters();

  const handleSelect = useCallback((id: string) => {
    setSelectedCharacterId(id);
  }, [setSelectedCharacterId]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.characterFilter !== 'all') count++;
    if (filters.speciesFilter !== 'all') count++;
    return count;
  }, [filters.characterFilter, filters.speciesFilter]);

  const totalResults = starredCharacters.length + otherCharacters.length;

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading characters. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Rick and Morty list</h1>
        
        {/* Search Input */}
        <SearchInput
          value={filters.search}
          onChange={setSearch}
          onFilterClick={toggleFilterPanel}
          isFilterActive={isFilterPanelOpen || activeFilterCount > 0}
        />

        {/* Filters Panel */}
        <CharacterFilters />

        {/* Results info */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-[var(--primary-600)] font-medium">
              {totalResults} Results
            </span>
            <span className="text-xs bg-[var(--primary-100)] text-[var(--primary-600)] px-3 py-1 rounded-full font-medium">
              {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Character Lists */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Starred Characters Section */}
            {starredCharacters.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
                  Starred Characters ({starredCharacters.length})
                </p>
                <div className="space-y-1">
                  {starredCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacterId === character.id}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Characters Section */}
            {otherCharacters.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
                  Characters ({otherCharacters.length})
                </p>
                <div className="space-y-1">
                  {otherCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacterId === character.id}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {starredCharacters.length === 0 && otherCharacters.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No characters found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
