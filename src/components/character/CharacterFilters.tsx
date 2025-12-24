'use client';

import { memo, useMemo } from 'react';
import { FilterButton } from '@/components/ui/FilterButton';
import { useCharacterStore } from '@/store/useCharacterStore';
import type { CharacterFilter, SpeciesFilter } from '@/types/character';

interface CharacterFiltersProps {
  onApply?: () => void;
}

export const CharacterFilters = memo(function CharacterFilters({ onApply }: CharacterFiltersProps) {
  const { 
    filters, 
    setCharacterFilter, 
    setSpeciesFilter,
    isFilterPanelOpen,
    setFilterPanelOpen,
  } = useCharacterStore();

  const hasActiveFilters = useMemo(() => {
    return filters.characterFilter !== 'all' || filters.speciesFilter !== 'all';
  }, [filters.characterFilter, filters.speciesFilter]);

  const handleApply = () => {
    setFilterPanelOpen(false);
    onApply?.();
  };

  if (!isFilterPanelOpen) return null;

  const characterOptions: { label: string; value: CharacterFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Starred', value: 'starred' },
    { label: 'Others', value: 'others' },
  ];

  const speciesOptions: { label: string; value: SpeciesFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Human', value: 'Human' },
    { label: 'Alien', value: 'Alien' },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-2 bg-white">
      {/* Character Filter */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Character</p>
        <div className="flex gap-2">
          {characterOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={filters.characterFilter === option.value}
              onClick={() => setCharacterFilter(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Species Filter */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Specie</p>
        <div className="flex gap-2">
          {speciesOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={filters.speciesFilter === option.value}
              onClick={() => setSpeciesFilter(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
          hasActiveFilters
            ? 'bg-[var(--primary-700)] text-white hover:bg-[var(--primary-600)]'
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}
      >
        Filter
      </button>
    </div>
  );
});

