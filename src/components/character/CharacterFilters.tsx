'use client';

import { memo, useMemo } from 'react';
import { FilterButton } from '@/components/ui/FilterButton';
import { useCharacterStore } from '@/store/useCharacterStore';
import type { CharacterFilter, SpeciesFilter, StatusFilter, GenderFilter } from '@/types/character';

interface CharacterFiltersProps {
  onApply?: () => void;
}

export const CharacterFilters = memo(function CharacterFilters({ onApply }: CharacterFiltersProps) {
  const { 
    filters, 
    setCharacterFilter, 
    setSpeciesFilter,
    setStatusFilter,
    setGenderFilter,
    resetFilters,
    isFilterPanelOpen,
    setFilterPanelOpen,
  } = useCharacterStore();

  const hasActiveFilters = useMemo(() => {
    return filters.characterFilter !== 'all' || 
           filters.speciesFilter !== 'all' ||
           filters.statusFilter !== 'all' ||
           filters.genderFilter !== 'all';
  }, [filters.characterFilter, filters.speciesFilter, filters.statusFilter, filters.genderFilter]);

  const handleApply = () => {
    setFilterPanelOpen(false);
    onApply?.();
  };

  const handleClear = () => {
    resetFilters();
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

  const statusOptions: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Alive', value: 'Alive' },
    { label: 'Dead', value: 'Dead' },
    { label: 'Unknown', value: 'unknown' },
  ];

  const genderOptions: { label: string; value: GenderFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    { label: 'Genderless', value: 'Genderless' },
    { label: 'Unknown', value: 'unknown' },
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

      {/* Status Filter */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Status</p>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={filters.statusFilter === option.value}
              onClick={() => setStatusFilter(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Gender</p>
        <div className="flex gap-2 flex-wrap">
          {genderOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={filters.genderFilter === option.value}
              onClick={() => setGenderFilter(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
          >
            Clear
          </button>
        )}
        <button
          type="button"
          onClick={handleApply}
          className={`py-2.5 rounded-lg font-medium transition-colors ${
            hasActiveFilters ? 'flex-1' : 'w-full'
          } ${
            hasActiveFilters
              ? 'bg-[var(--primary-700)] text-white hover:bg-[var(--primary-600)]'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}
        >
          Filter
        </button>
      </div>
    </div>
  );
});

