'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CharacterDetail } from '@/components/character/CharacterDetail';
import { useCharacterStore } from '@/store/useCharacterStore';

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { setSelectedCharacterId } = useCharacterStore();

  useEffect(() => {
    if (id) {
      setSelectedCharacterId(id);
    }
  }, [id, setSelectedCharacterId]);

  const handleBack = () => {
    setSelectedCharacterId(null);
    router.push('/');
  };

  return <CharacterDetail characterId={id} onBack={handleBack} />;
}

