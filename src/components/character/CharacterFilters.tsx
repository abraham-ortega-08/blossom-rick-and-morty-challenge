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
  ];

  const genderOptions: { label: string; value: GenderFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    { label: 'Genderless', value: 'Genderless' },
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFilterPanelOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay - Only on mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
        onClick={handleBackdropClick}
      />
      
      {/* Filter Panel */}
      <div className="fixed inset-x-0 top-0 bottom-0 bg-white z-[101] lg:relative lg:border lg:border-gray-200 lg:rounded-lg lg:p-4 lg:mt-2 lg:z-0 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setFilterPanelOpen(false)}
            className="p-2 -ml-2 text-[var(--primary-600)]"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-0">
          {/* Characters Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Characters</p>
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

          {/* Species Section */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Specie</p>
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

          {/* Status Section - Hidden on mobile in reference design */}
          <div className="mb-6 hidden lg:block">
            <p className="text-sm text-gray-500 mb-3">Status</p>
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

          {/* Gender Section - Hidden on mobile in reference design */}
          <div className="mb-6 hidden lg:block">
            <p className="text-sm text-gray-500 mb-3">Gender</p>
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
        </div>

        {/* Action Buttons */}
        <div className="p-6 lg:p-0 lg:mt-4 border-t border-gray-200 lg:border-t-0">
          <button
            type="button"
            onClick={handleApply}
            className="w-full py-3 rounded-lg font-medium transition-colors bg-[var(--primary-700)] text-white hover:bg-[var(--primary-600)]"
          >
            Filter
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="w-full mt-2 py-3 rounded-lg font-medium transition-colors bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </>
  );
});

