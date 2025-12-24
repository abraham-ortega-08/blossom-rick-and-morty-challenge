import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import { CommentForm } from '../CommentForm';
import { useCharacterStore } from '@/store/useCharacterStore';

describe('CommentForm', () => {
  const characterId = '1';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Resetear el store de Zustand
    const { getState, setState } = useCharacterStore;
    setState({
      ...getState(),
      comments: {},
      favorites: [],
      deletedCharacters: [],
    });
  });

  it('renders the form correctly', () => {
    render(<CommentForm characterId={characterId} />);

    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('allows typing in the textarea', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    expect(textarea.value).toBe('Test comment');
  });

  it('does not allow submitting empty comment', () => {
    render(<CommentForm characterId={characterId} />);

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments.length).toBe(0);
  });

  it('does not allow submitting comment with only spaces', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments.length).toBe(0);
  });

  it('adding comment updates the store', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(textarea, { target: { value: 'Great character!' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments.length).toBe(1);
    expect(comments[0].text).toBe('Great character!');
    expect(comments[0].characterId).toBe(characterId);
  });

  it('clears input after adding comment', async () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...') as HTMLInputElement;
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('can add multiple comments', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    const submitButton = screen.getByText('Add');

    // First comment
    fireEvent.change(textarea, { target: { value: 'First comment' } });
    fireEvent.click(submitButton);

    // Second comment
    fireEvent.change(textarea, { target: { value: 'Second comment' } });
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments.length).toBe(2);
    expect(comments[0].text).toBe('First comment');
    expect(comments[1].text).toBe('Second comment');
  });

  it('each comment has a unique ID', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    const submitButton = screen.getByText('Add');

    // Add two comments
    fireEvent.change(textarea, { target: { value: 'Comment 1' } });
    fireEvent.click(submitButton);

    fireEvent.change(textarea, { target: { value: 'Comment 2' } });
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments[0].id).not.toBe(comments[1].id);
  });

  it('each comment has a creation date', () => {
    render(<CommentForm characterId={characterId} />);

    const textarea = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(textarea, { target: { value: 'Test comment' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    const { getComments } = useCharacterStore.getState();
    const comments = getComments(characterId);
    expect(comments[0].createdAt).toBeDefined();
    expect(typeof comments[0].createdAt).toBe('string');
  });

  it('button is disabled while textarea is empty', () => {
    render(<CommentForm characterId={characterId} />);

    const submitButton = screen.getByText('Add');
    const textarea = screen.getByPlaceholderText('Add a comment...') as HTMLInputElement;

    // Initially empty
    expect(textarea.value).toBe('');

    // Escribir algo
    fireEvent.change(textarea, { target: { value: 'Test' } });
    expect(textarea.value).toBe('Test');
  });
});

