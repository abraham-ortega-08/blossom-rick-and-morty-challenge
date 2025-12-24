'use client';

import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCharacterStore } from '@/store/useCharacterStore';

export default function Home() {
  const setSelectedCharacterId = useCharacterStore((state) => state.setSelectedCharacterId);

  useEffect(() => {
    // Limpiar el personaje seleccionado cuando se carga la página principal
    setSelectedCharacterId(null);
  }, [setSelectedCharacterId]);

  return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <div className="text-center">
        <Icon 
          icon="mdi:account-circle-outline"
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
        />
        <p className="text-lg">Select a character to see details</p>
      </div>
    </div>
  );
}
