'use client';

import { memo, useState, useCallback } from 'react';
import { useCharacterStore } from '@/store/useCharacterStore';

interface CommentFormProps {
  characterId: string;
}

export const CommentForm = memo(function CommentForm({ characterId }: CommentFormProps) {
  const [text, setText] = useState('');
  const { addComment } = useCharacterStore();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addComment(characterId, text.trim());
      setText('');
    }
  }, [characterId, text, addComment]);

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg 
                     focus:outline-none focus:border-[var(--primary-600)] focus:ring-1 focus:ring-[var(--primary-600)]
                     text-gray-700 placeholder-gray-400 text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2 bg-[var(--primary-700)] text-white rounded-lg font-medium
                     hover:bg-[var(--primary-600)] transition-colors
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </form>
  );
});

