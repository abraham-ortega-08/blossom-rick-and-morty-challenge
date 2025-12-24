'use client';

import { useEffect } from 'react';
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
        <svg 
          className="w-16 h-16 mx-auto mb-4 text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
        <p className="text-lg">Select a character to see details</p>
      </div>
    </div>
  );
}
