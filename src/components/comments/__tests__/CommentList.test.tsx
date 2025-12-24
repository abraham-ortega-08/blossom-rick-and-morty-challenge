import { render, screen, fireEvent, act } from '@/__tests__/test-utils';
import { CommentList } from '../CommentList';
import { useCharacterStore } from '@/store/useCharacterStore';

describe('CommentList', () => {
  const characterId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Resetear el store de Zustand
    act(() => {
      const { getState, setState } = useCharacterStore;
      setState({
        ...getState(),
        comments: {},
        favorites: [],
        deletedCharacters: [],
      });
    });
  });

  it('shows message when there are no comments', () => {
    render(<CommentList characterId={characterId} />);
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  it('renders comment list correctly', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'First comment');
      addComment(characterId, 'Second comment');
    });

    render(<CommentList characterId={characterId} />);

    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });

  it('shows delete button for each comment', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'Test comment');
    });

    render(<CommentList characterId={characterId} />);

    const deleteButtons = screen.getAllByRole('button');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('delete comment works correctly', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'Comment to delete');
    });

    render(<CommentList characterId={characterId} />);

    expect(screen.getByText('Comment to delete')).toBeInTheDocument();

    // Click the delete button
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    // Verify that the comment was deleted
    const comments = useCharacterStore.getState().getComments(characterId);
    expect(comments.length).toBe(0);
  });

  it('deletes only the correct comment when there are multiple', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'First comment');
      addComment(characterId, 'Second comment');
      addComment(characterId, 'Third comment');
    });

    render(<CommentList characterId={characterId} />);

    // Get all delete buttons
    const deleteButtons = screen.getAllByRole('button');
    
    // Delete the second comment (index 1)
    fireEvent.click(deleteButtons[1]);

    const comments = useCharacterStore.getState().getComments(characterId);
    expect(comments.length).toBe(2);
    expect(comments[0].text).toBe('First comment');
    expect(comments[1].text).toBe('Third comment');
  });

  it('shows comments in creation order', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'First');
      addComment(characterId, 'Second');
      addComment(characterId, 'Third');
    });

    render(<CommentList characterId={characterId} />);

    const comments = screen.getAllByText(/First|Second|Third/);
    expect(comments[0]).toHaveTextContent('First');
    expect(comments[1]).toHaveTextContent('Second');
    expect(comments[2]).toHaveTextContent('Third');
  });

  it('does not show comments from other characters', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment('1', 'Comment for character 1');
      addComment('2', 'Comment for character 2');
    });

    render(<CommentList characterId="1" />);

    expect(screen.getByText('Comment for character 1')).toBeInTheDocument();
    expect(screen.queryByText('Comment for character 2')).not.toBeInTheDocument();
  });

  it('updates the list when a new comment is added', () => {
    const { rerender } = render(<CommentList characterId={characterId} />);
    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();

    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'New comment');
    });
    
    rerender(<CommentList characterId={characterId} />);

    expect(screen.queryByText('No comments yet. Be the first to comment!')).not.toBeInTheDocument();
    expect(screen.getByText('New comment')).toBeInTheDocument();
  });

  it('each comment shows date information', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'Test comment');
    });

    render(<CommentList characterId={characterId} />);

    // Verify that there is some time/date element
    const timeElements = document.querySelectorAll('time, .text-xs');
    expect(timeElements.length).toBeGreaterThan(0);
  });

  it('handles deletion of the last comment correctly', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      addComment(characterId, 'Only comment');
    });

    const { rerender } = render(<CommentList characterId={characterId} />);
    
    expect(screen.getByText('Only comment')).toBeInTheDocument();

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    rerender(<CommentList characterId={characterId} />);

    expect(screen.getByText('No comments yet. Be the first to comment!')).toBeInTheDocument();
  });

  it('renders multiple comments without errors', () => {
    act(() => {
      const { addComment } = useCharacterStore.getState();
      
      // Add many comments
      for (let i = 1; i <= 10; i++) {
        addComment(characterId, `Comment ${i}`);
      }
    });

    render(<CommentList characterId={characterId} />);

    // Verificar que todos se renderizaron
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Comment ${i}`)).toBeInTheDocument();
    }
  });
});

