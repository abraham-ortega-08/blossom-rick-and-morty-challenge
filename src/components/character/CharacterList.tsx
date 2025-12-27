'use client';

import { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { CharacterCard } from './CharacterCard';
import { CharacterFilters } from './CharacterFilters';
import { SearchInput } from '@/components/ui/SearchInput';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacters } from '@/hooks/useCharacters';
import { Icon } from '@iconify/react';

export const CharacterList = memo(function CharacterList() {
  const { 
    filters, 
    setSearch, 
    setSortOrder,
    selectedCharacterId, 
    setSelectedCharacterId,
    isFilterPanelOpen,
    toggleFilterPanel,
  } = useCharacterStore();
  
  const { 
    starredCharacters, 
    otherCharacters, 
    loading, 
    isLoadingMore,
    error,
    loadMore,
    hasMore,
  } = useCharacters();

  // Infinite scroll using react-intersection-observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Track previous inView state to detect transitions
  const prevInViewRef = useRef(false);

  // Load more when trigger element becomes visible (transition from false to true)
  useEffect(() => {
    const justBecameVisible = inView && !prevInViewRef.current;
    prevInViewRef.current = inView;

    if (justBecameVisible && hasMore && !isLoadingMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loading, loadMore]);

  const handleSelect = useCallback((id: string) => {
    setSelectedCharacterId(id);
  }, [setSelectedCharacterId]);

  const handleSortToggle = useCallback(() => {
    setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc');
  }, [filters.sortOrder, setSortOrder]);

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
      <div className="px-4 py-5 lg:px-6 lg:py-6 border-b border-gray-100">
        <h1 className="text-2xl lg:text-xl font-bold text-gray-900 mb-4 lg:mb-5">Rick and Morty list</h1>
        
        {/* Search Input and Sort Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={setSearch}
              onFilterClick={toggleFilterPanel}
              isFilterActive={isFilterPanelOpen || activeFilterCount > 0}
            />
          </div>
          
          {/* Sort Button */}
          <button
            onClick={handleSortToggle}
            className="flex items-center gap-1.5 px-3 py-3 rounded-lg border border-gray-200 hover:border-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-colors group"
            aria-label={`Ordenar ${filters.sortOrder === 'asc' ? 'descendente' : 'ascendente'}`}
          >
            <Icon 
              icon={filters.sortOrder === 'asc' ? 'mdi:sort-alphabetical-ascending' : 'mdi:sort-alphabetical-descending'} 
              className="w-5 h-5 text-gray-500 group-hover:text-[var(--primary-600)]"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--primary-600)] whitespace-nowrap">
              {filters.sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        <CharacterFilters />

        {/* Results info - Shown when filters are active */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-3 mt-4 justify-between">
            <span className="text-sm text-[var(--primary-600)] font-semibold">
              {totalResults} Result{totalResults !== 1 ? 's' : ''}
            </span>
            <span className="text-xs bg-[var(--primary-100)] text-[var(--primary-600)] px-3 py-1.5 rounded-full font-medium">
              {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Character Lists */}
      <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6 lg:py-4">
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Starred Characters ({starredCharacters.length})
                </p>
                <div className="space-y-2">
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Characters ({otherCharacters.length})
                </p>
                <div className="space-y-2">
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
              <div className="text-center py-12 text-gray-400">
                No characters found
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-4">
              {isLoadingMore && (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-5 h-5 border-2 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Loading more...</span>
                </div>
              )}
              {!hasMore && totalResults > 0 && (
                <p className="text-center text-xs text-gray-400">
                  You have reached the end of the list
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});
