'use client';

import { memo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Avatar } from '@/components/ui/Avatar';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';

export const CharacterDetail = memo(function CharacterDetail() {
  const { selectedCharacterId, isFavorite, toggleFavorite, setSelectedCharacterId, softDeleteCharacter } = useCharacterStore();
  const { character, loading, error } = useCharacterDetail(selectedCharacterId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleBack = () => {
    setSelectedCharacterId(null);
    // En móvil, esto causará que el layout muestre la lista nuevamente
  };

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    softDeleteCharacter(character.id);
    setShowDeleteConfirm(false);
    setSelectedCharacterId(null);
  }, [character.id, softDeleteCharacter, setSelectedCharacterId]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

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
              className="absolute bottom-2 right-2 min-w-[48px] min-h-[48px] w-12 h-12 max-w-[48px] max-h-[48px] bg-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none shrink-0"
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon 
                icon={isFav ? "mdi:heart" : "mdi:heart-outline"}
                width={20}
                height={20}
                style={{ color: isFav ? '#63D838' : '#9CA3AF' }}
                className="shrink-0"
              />
            </button>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {character.name}
          </h2>

        {/* Delete Button - Hidden on mobile in reference design */}
        {showDeleteConfirm ? (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg hidden lg:block">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Are you sure you want to delete this character?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="mt-4 items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors hidden lg:flex"
          >
            <Icon 
              icon="mdi:delete-outline"
              width={16}
              height={16}
            />
            Delete Character
          </button>
        )}
        </div>

        {/* Character Properties */}
        <div className="space-y-4 mb-8">
          <div className="pb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Specie</p>
            <p className="text-base text-gray-900">{character.species}</p>
          </div>

          <div className="pb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Status</p>
            <p className="text-base text-gray-900">{character.status}</p>
          </div>

          <div className="pb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Occupation</p>
            <p className="text-base text-gray-900">{character.type || 'Unknown'}</p>
          </div>

          <div className="pb-4 lg:block hidden">
            <p className="text-sm font-semibold text-gray-500 mb-1">Gender</p>
            <p className="text-base text-gray-900">{character.gender}</p>
          </div>

          <div className="pb-4 lg:block hidden">
            <p className="text-sm font-semibold text-gray-500 mb-1">Origin</p>
            <p className="text-base text-gray-900">{character.origin?.name || 'Unknown'}</p>
          </div>

          <div className="pb-4 lg:block hidden">
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

