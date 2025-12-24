'use client';

import { memo, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { useCharacterStore } from '@/store/useCharacterStore';
import type { Character } from '@/types/character';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CharacterCard = memo(function CharacterCard({
  character,
  isSelected,
  onSelect,
}: CharacterCardProps) {
  const { isFavorite, toggleFavorite } = useCharacterStore();
  const isFav = isFavorite(character.id);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(character.id);
  }, [character.id, toggleFavorite]);

  const handleSelect = useCallback(() => {
    onSelect(character.id);
  }, [character.id, onSelect]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left cursor-pointer
        ${isSelected 
          ? 'bg-[var(--primary-100)] border-l-4 border-l-[var(--primary-600)]' 
          : 'hover:bg-gray-50'
        }`}
    >
      <Avatar src={character.image} alt={character.name} size="md" />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{character.name}</p>
        <p className="text-sm text-gray-400">{character.species}</p>
      </div>

      <HeartIcon 
        filled={isFav} 
        size={22} 
        onClick={handleFavoriteClick}
      />
    </div>
  );
});

