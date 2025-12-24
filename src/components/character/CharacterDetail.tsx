'use client';

import { memo } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';

export const CharacterDetail = memo(function CharacterDetail() {
  const { selectedCharacterId, isFavorite, toggleFavorite } = useCharacterStore();
  const { character, loading, error } = useCharacterDetail(selectedCharacterId);

  if (!selectedCharacterId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a character to see details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 pb-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading character details
      </div>
    );
  }

  const isFav = isFavorite(character.id);

  return (
    <div className="p-6 h-full overflow-y-auto">
      {/* Character Header */}
      <div className="mb-6">
        <div className="relative inline-block">
          <Avatar src={character.image} alt={character.name} size="lg" />
          <div className="absolute -bottom-1 -right-1">
            <HeartIcon 
              filled={isFav} 
              size={20} 
              onClick={() => toggleFavorite(character.id)}
            />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-4">
          {character.name}
        </h2>
      </div>

      {/* Character Properties */}
      <div className="space-y-4 mb-8">
        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Specie</p>
          <p className="text-gray-600">{character.species}</p>
        </div>

        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Status</p>
          <p className="text-gray-600">{character.status}</p>
        </div>

        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Occupation</p>
          <p className="text-gray-600">{character.type || 'Unknown'}</p>
        </div>

        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Gender</p>
          <p className="text-gray-600">{character.gender}</p>
        </div>

        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Origin</p>
          <p className="text-gray-600">{character.origin?.name || 'Unknown'}</p>
        </div>

        <div className="border-b border-gray-100 pb-4">
          <p className="text-sm font-semibold text-gray-900">Location</p>
          <p className="text-gray-600">{character.location?.name || 'Unknown'}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
        <CommentForm characterId={character.id} />
        <CommentList characterId={character.id} />
      </div>
    </div>
  );
});

