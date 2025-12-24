'use client';

import { memo } from 'react';

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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="8" cy="6" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <circle cx="10" cy="18" r="2" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
});

