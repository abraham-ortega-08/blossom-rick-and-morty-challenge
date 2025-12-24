'use client';

import { CharacterList } from '@/components/character/CharacterList';
import { CharacterDetail } from '@/components/character/CharacterDetail';

export default function Home() {
  return (
    <div className="h-screen w-screen bg-[var(--gray-100)] overflow-hidden">
      {/* Main Content Grid */}
      <main className="h-full grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-[1px] bg-gray-200">
        {/* Left Panel - Character List */}
        <section className="bg-white overflow-hidden flex flex-col min-h-0">
          <CharacterList />
        </section>

        {/* Right Panel - Character Detail */}
        <section className="bg-white overflow-hidden hidden lg:flex lg:flex-col min-h-0">
          <CharacterDetail />
        </section>
      </main>
    </div>
  );
}
