import { render, screen, fireEvent, waitFor } from '@/__tests__/test-utils';
import { CharacterCard } from '../CharacterCard';
import { useCharacterStore } from '@/store/useCharacterStore';
import type { Character } from '@/types/character';

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    id: '1',
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
  },
  location: {
    id: '20',
    name: 'Earth (Replacement Dimension)',
    type: 'Planet',
    dimension: 'Replacement Dimension',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
  created: '2017-11-04T18:48:46.250Z',
};

describe('CharacterCard', () => {
  const mockOnSelect = jest.fn();

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

  it('renders correctly with character data', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByAltText('Rick Sanchez')).toBeInTheDocument();
  });

  it('shows different styles when selected', () => {
    const { container } = render(
      <CharacterCard
        character={mockCharacter}
        isSelected={true}
        onSelect={mockOnSelect}
      />
    );

    const link = container.querySelector('a');
    expect(link).toHaveClass('bg-[var(--primary-100)]');
  });

  it('calls onSelect when clicked', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const card = screen.getByText('Rick Sanchez').closest('a');
    fireEvent.click(card!);

    expect(mockOnSelect).toHaveBeenCalledWith('1');
  });

  it('favorite toggle works correctly', () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const { isFavorite } = useCharacterStore.getState();
    expect(isFavorite('1')).toBe(false);

    // Find the heart button by aria-label
    const heartButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(heartButton);

    const { isFavorite: isFavoriteAfter } = useCharacterStore.getState();
    expect(isFavoriteAfter('1')).toBe(true);
  });

  it('shows delete confirmation when clicking delete button', async () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    // Find the delete button (the second button)
    const buttons = screen.getAllByRole('button', { hidden: true });
    const deleteButton = buttons[1];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Delete Rick Sanchez\?/i)).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  it('soft-delete works correctly', async () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    const { isDeleted } = useCharacterStore.getState();
    expect(isDeleted('1')).toBe(false);

    // Click the delete button
    const buttons = screen.getAllByRole('button', { hidden: true });
    const deleteButton = buttons[1];
    fireEvent.click(deleteButton);

    // Confirm deletion
    await waitFor(() => {
      const confirmButton = screen.getByText('Delete');
      fireEvent.click(confirmButton);
    });

    const { isDeleted: isDeletedAfter } = useCharacterStore.getState();
    expect(isDeletedAfter('1')).toBe(true);
  });

  it('cancels deletion correctly', async () => {
    render(
      <CharacterCard
        character={mockCharacter}
        isSelected={false}
        onSelect={mockOnSelect}
      />
    );

    // Click the delete button
    const buttons = screen.getAllByRole('button', { hidden: true });
    const deleteButton = buttons[1];
    fireEvent.click(deleteButton);

    // Cancel deletion
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    // Verify that it shows the character normally again
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    
    const { isDeleted } = useCharacterStore.getState();
    expect(isDeleted('1')).toBe(false);
  });
});

