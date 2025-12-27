import { render, screen, fireEvent, waitFor, act } from '@/__tests__/test-utils';
import { CharacterDetail } from '../CharacterDetail';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';
import type { Character } from '@/types/character';

// Mock del hook
jest.mock('@/hooks/useCharacterDetail');

const mockUseCharacterDetail = useCharacterDetail as jest.MockedFunction<typeof useCharacterDetail>;

const mockCharacter: Character = {
  id: '1',
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  type: 'Scientist',
  gender: 'Male' as const,
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

describe('CharacterDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Reset store
    act(() => {
      const { getState, setState } = useCharacterStore;
      setState({
        ...getState(),
        comments: {},
        favorites: [],
        deletedCharacters: [],
        selectedCharacterId: null,
      });
    });

    // Mock por defecto
    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: false,
      error: undefined,
      isDeleted: false,
    });
  });

  it('shows message when no character is selected', () => {
    render(<CharacterDetail />);
    
    expect(screen.getByText('Select a character to see details')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: true,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    // Verificar elementos de carga
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('shows error state', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: false,
      error: new Error('Test error'),
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    expect(screen.getByText('Character not found')).toBeInTheDocument();
    expect(screen.getByText('Please select another character')).toBeInTheDocument();
  });

  it('displays character details correctly', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Scientist')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Earth (Replacement Dimension)')).toBeInTheDocument();
  });

  it('shows Unknown for empty type field', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: { ...mockCharacter, type: '' },
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('toggles favorite when clicking heart icon', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    const { isFavorite } = useCharacterStore.getState();
    expect(isFavorite('1')).toBe(false);
    
    // Encontrar el botón de favorito por aria-label
    const heartIcon = screen.getByLabelText('Add to favorites');
    fireEvent.click(heartIcon);
    
    const { isFavorite: isFavoriteAfter } = useCharacterStore.getState();
    expect(isFavoriteAfter('1')).toBe(true);
  });

  it('can soft delete character via store', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    // Verify character is not deleted initially
    expect(useCharacterStore.getState().isDeleted('1')).toBe(false);
    
    // Simulate soft deleting the character
    act(() => {
      const { softDeleteCharacter } = useCharacterStore.getState();
      softDeleteCharacter('1');
    });
    
    // Verify character was soft deleted
    const { isDeleted } = useCharacterStore.getState();
    expect(isDeleted('1')).toBe(true);
  });

  it('shows comments section', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('can add a comment to the character', async () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(textarea, { target: { value: 'Great character!' } });
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Great character!')).toBeInTheDocument();
    });
  });

  it('shows back button on mobile', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    // The back button now uses Iconify, so we check for the button with an icon
    const buttons = screen.getAllByRole('button');
    // Find the button that contains an icon (Iconify renders svg or has iconify class)
    const backButton = buttons.find(button => {
      const icon = button.querySelector('svg') || button.querySelector('[class*="iconify"]');
      return icon !== null && button.className.includes('text-[var(--primary-600)]');
    });
    
    expect(backButton).toBeDefined();
  });

  it('can deselect character via store', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    // Verify character is selected
    expect(useCharacterStore.getState().selectedCharacterId).toBe('1');
    
    // Simulate deselecting the character (what the back button does)
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId(null);
    });
    
    // Verify character was deselected
    const { selectedCharacterId } = useCharacterStore.getState();
    expect(selectedCharacterId).toBeNull();
  });

  it('displays character image', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    const image = screen.getByAltText('Rick Sanchez');
    expect(image).toBeInTheDocument();
    // Next.js Image component transforma el src, así que solo verificamos que existe
    expect(image).toHaveAttribute('src');
  });

  it('shows all character property labels', () => {
    act(() => {
      const { setSelectedCharacterId } = useCharacterStore.getState();
      setSelectedCharacterId('1');
    });

    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterDetail />);
    
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Occupation')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Origin')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });
});

