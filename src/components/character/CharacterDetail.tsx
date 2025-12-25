'use client';

import { memo, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Avatar } from '@/components/ui/Avatar';
import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';

interface CharacterDetailProps {
  characterId?: string | null;
  onBack?: () => void;
}

export const CharacterDetail = memo(function CharacterDetail({ characterId: propCharacterId, onBack }: CharacterDetailProps = {}) {
  const { selectedCharacterId, isFavorite, toggleFavorite, setSelectedCharacterId } = useCharacterStore();
  
  // Use prop characterId if provided, otherwise use store's selectedCharacterId
  const characterId = propCharacterId ?? selectedCharacterId;
  const { character, loading, error } = useCharacterDetail(characterId);

  // All hooks must be called before any conditional returns
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      setSelectedCharacterId(null);
      // En móvil, esto causará que el layout muestre la lista nuevamente
    }
  }, [onBack, setSelectedCharacterId]);

  // Conditional returns after all hooks
  if (!characterId) {
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
    <div className="h-full flex flex-col bg-white">
      {/* Mobile Header with Back Button */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 lg:hidden">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-[var(--primary-600)]"
        >
          <Icon icon="mdi:arrow-left" width={24} height={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Character Header */}
        <div className="mb-6 text-center lg:text-left">
          <div className="relative inline-block">
            <Avatar src={character.image} alt={character.name} size="xl" className="!w-[120px] !h-[120px] lg:!w-20 lg:!h-20" />
            <button
              type="button"
              onClick={() => toggleFavorite(character.id)}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon 
                icon={isFav ? "mdi:heart" : "mdi:heart-outline"}
                width={24}
                height={24}
                style={{ color: isFav ? '#63D838' : '#9CA3AF' }}
              />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {character.name}
          </h2>
        </div>

        {/* Character Properties */}
        <div className="mb-8">
          <div className="pb-4 border-b border-gray-300">
            <p className="text-sm font-semibold text-gray-500 mb-1">Specie</p>
            <p className="text-base text-gray-900">{character.species}</p>
          </div>

          <div className="pt-4 pb-4 border-b border-gray-300">
            <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
            <p className="text-base text-gray-900">{character.status}</p>
          </div>

          <div className="pt-4 pb-4 border-b border-gray-300">
            <p className="text-sm font-semibold text-gray-500 mb-1">Occupation</p>
            <p className="text-base text-gray-900">{character.type || 'Unknown'}</p>
          </div>

          <div className="pt-4 pb-4 border-b border-gray-300 lg:block hidden">
            <p className="text-sm font-semibold text-gray-500 mb-1">Gender</p>
            <p className="text-base text-gray-900">{character.gender}</p>
          </div>

          <div className="pt-4 pb-4 border-b border-gray-300 lg:block hidden">
            <p className="text-sm font-semibold text-gray-500 mb-1">Origin</p>
            <p className="text-base text-gray-900">{character.origin?.name || 'Unknown'}</p>
          </div>

          <div className="pt-4 pb-4 lg:block hidden">
            <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
            <p className="text-base text-gray-900">{character.location?.name || 'Unknown'}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
          <div className="mb-4">
            <CommentForm characterId={character.id} />
          </div>
          <CommentList characterId={character.id} />
        </div>
      </div>
    </div>
  );
});

