'use client';

import { memo, useCallback } from 'react';
import { useCharacterStore } from '@/store/useCharacterStore';

interface CommentListProps {
  characterId: string;
}

export const CommentList = memo(function CommentList({ characterId }: CommentListProps) {
  const { getComments, deleteComment } = useCharacterStore();
  const comments = getComments(characterId);

  const handleDelete = useCallback((commentId: string) => {
    deleteComment(characterId, commentId);
  }, [characterId, deleteComment]);

  if (comments.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <p className="text-sm text-gray-700">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(comment.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Delete comment"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
});

