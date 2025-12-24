'use client';

import { memo } from 'react';
import { Icon } from '@iconify/react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
  isFilterActive: boolean;
  placeholder?: string;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  onFilterClick,
  isFilterActive,
  placeholder = 'Search or filter results',
}: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      {/* Search Icon */}
      <div className="absolute left-3 pointer-events-none">
        <Icon 
          icon="mdi:magnify"
          width={20}
          height={20}
          style={{ color: '#9CA3AF' }}
        />
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 
                   focus:outline-none focus:border-[var(--primary-600)] focus:ring-1 focus:ring-[var(--primary-600)]
                   text-gray-700 placeholder-gray-400 text-sm"
      />

      {/* Filter Icon Button */}
      <button
        type="button"
        onClick={onFilterClick}
        className={`absolute right-2 p-2 rounded-lg transition-colors ${
          isFilterActive 
            ? 'text-[var(--primary-600)]' 
            : 'text-gray-400 hover:text-gray-600'
        }`}
        aria-label="Toggle filters"
      >
        <Icon 
          icon="mdi:tune-variant"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
});

