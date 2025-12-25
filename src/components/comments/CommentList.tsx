'use client';

import { memo, useCallback } from 'react';
import { Icon } from '@iconify/react';
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
          className="flex items-start justify-between gap-3 p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-2">
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
            className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
            aria-label="Delete comment"
          >
            <Icon 
              icon="mdi:delete-outline"
              width={18}
              height={18}
            />
          </button>
        </div>
      ))}
    </div>
  );
});

