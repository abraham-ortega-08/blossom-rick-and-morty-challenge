'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { CommentForm } from '@/components/comments/CommentForm';
import { CommentList } from '@/components/comments/CommentList';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { isFavorite, toggleFavorite, setSelectedCharacterId } = useCharacterStore();
  const { character, loading, error } = useCharacterDetail(id);

  useEffect(() => {
    if (id) {
      setSelectedCharacterId(id);
    }
  }, [id, setSelectedCharacterId]);

  const handleBack = () => {
    setSelectedCharacterId(null);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 lg:hidden">
          <button onClick={handleBack} className="p-2 -ml-2 text-[var(--primary-600)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 animate-pulse">
          <div className="text-center lg:text-left mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto lg:mx-0" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto lg:mx-0 mt-4 mb-2" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 lg:hidden">
          <button onClick={handleBack} className="p-2 -ml-2 text-[var(--primary-600)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-500">
          <div className="text-center">
            <p className="text-lg mb-2">Character not found</p>
            <p className="text-sm text-gray-400">Please select another character</p>
          </div>
        </div>
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Character Header */}
        <div className="mb-6 text-center lg:text-left">
          <div className="relative inline-block">
            <Avatar src={character.image} alt={character.name} size="xl" className="!w-[120px] !h-[120px] lg:!w-20 lg:!h-20" />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
              <HeartIcon 
                filled={isFav} 
                size={24} 
                onClick={() => toggleFavorite(character.id)}
              />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {character.name}
          </h1>
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

        {/* Comments Section - Hidden on mobile */}
        <div className="mt-8 hidden lg:block">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
          <CommentForm characterId={character.id} />
          <CommentList characterId={character.id} />
        </div>
      </div>
    </div>
  );
}

