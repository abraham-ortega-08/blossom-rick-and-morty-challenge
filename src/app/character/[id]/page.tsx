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
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-b border-gray-100 pb-4">
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
      <div className="min-h-screen bg-[var(--background)] p-4 md:p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <p className="text-center text-red-500">Character not found</p>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(character.id);

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Back Button */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to list
          </button>
        </div>

        <div className="p-6">
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
            
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              {character.name}
            </h1>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
            <CommentForm characterId={character.id} />
            <CommentList characterId={character.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

