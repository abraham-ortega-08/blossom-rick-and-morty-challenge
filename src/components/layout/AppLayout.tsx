'use client';

import { useCharacterStore } from '@/store/useCharacterStore';
import { CharacterList } from '@/components/character/CharacterList';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);

  return (
    <div className="h-screen w-screen bg-[var(--gray-100)] overflow-hidden">
      {/* Main Content Grid */}
      <main className="h-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-0 lg:gap-[1px] bg-gray-200">
        {/* Left Panel - Character List */}
        {/* Hidden on mobile when a character is selected */}
        <section 
          className={`bg-white overflow-hidden flex flex-col min-h-0 ${
            selectedCharacterId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <CharacterList />
        </section>

        {/* Right Panel - Dynamic Content (children) */}
        {/* Hidden on mobile when no character is selected */}
        <section 
          className={`bg-white overflow-hidden flex-col min-h-0 ${
            selectedCharacterId ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {children}
        </section>
      </main>
    </div>
  );
}

