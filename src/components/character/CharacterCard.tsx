'use client';

import { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
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
  const { isFavorite, toggleFavorite, softDeleteCharacter } = useCharacterStore();
  const isFav = isFavorite(character.id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(character.id);
  }, [character.id, toggleFavorite]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    softDeleteCharacter(character.id);
    setShowDeleteConfirm(false);
  }, [character.id, softDeleteCharacter]);

  const handleCancelDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(false);
  }, []);

  const handleClick = useCallback(() => {
    onSelect(character.id);
  }, [character.id, onSelect]);

  if (showDeleteConfirm) {
    return (
      <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Delete {character.name}?</p>
          <p className="text-xs text-gray-500">You can restore it later</p>
        </div>
        <button
          onClick={handleConfirmDelete}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={handleCancelDelete}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <Link
      href={`/character/${character.id}`}
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left cursor-pointer block
        ${isSelected 
          ? 'bg-[var(--primary-100)]' 
          : 'hover:bg-gray-50'
        }`}
    >
      <Avatar src={character.image} alt={character.name} size="md" />
      
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base text-gray-900 truncate">{character.name}</p>
        <p className="text-sm text-gray-500">{character.species}</p>
      </div>

      <div className="flex items-center gap-2">
        <HeartIcon 
          filled={isFav} 
          size={24} 
          onClick={handleFavoriteClick}
        />
        <button
          onClick={handleDeleteClick}
          className="p-1 hover:bg-red-50 rounded transition-colors lg:block hidden"
          title="Delete character"
        >
          <Icon 
            icon="mdi:delete-outline"
            width={20}
            height={20}
            className="text-gray-400 hover:text-red-600"
          />
        </button>
      </div>
    </Link>
  );
});

