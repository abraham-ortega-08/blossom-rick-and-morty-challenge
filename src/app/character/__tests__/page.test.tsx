import { render, screen, fireEvent, act } from '@/__tests__/test-utils';
import CharacterPage from '../[id]/page';
import { useCharacterStore } from '@/store/useCharacterStore';
import { useCharacterDetail } from '@/hooks/useCharacterDetail';
import { useParams } from 'next/navigation';
import type { Character } from '@/types/character';

// Mock de los hooks
jest.mock('@/hooks/useCharacterDetail');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

const mockUseCharacterDetail = useCharacterDetail as jest.MockedFunction<typeof useCharacterDetail>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

// Mock del router
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

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

describe('CharacterPage', () => {
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

    // Mock useParams por defecto
    mockUseParams.mockReturnValue({ id: '1' });

    // Mock useRouter
    const { useRouter } = require('next/navigation');
    useRouter.mockReturnValue(mockRouter);

    // Mock useCharacterDetail por defecto
    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: false,
      error: undefined,
      isDeleted: false,
    });
  });

  it('shows loading state', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: true,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    // Verificar elementos de carga
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('shows error state when character not found', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: false,
      error: new Error('Not found'),
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Character not found')).toBeInTheDocument();
    expect(screen.getByText('Please select another character')).toBeInTheDocument();
  });

  it('displays character details correctly', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Scientist')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Earth (Replacement Dimension)')).toBeInTheDocument();
  });

  it('shows Unknown for empty type field', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: { ...mockCharacter, type: '' },
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('displays character image', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    const image = screen.getByAltText('Rick Sanchez');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('toggles favorite when clicking heart icon', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    const { isFavorite } = useCharacterStore.getState();
    expect(isFavorite('1')).toBe(false);
    
    // Encontrar el botón de favorito por aria-label
    const heartIcon = screen.getByLabelText('Add to favorites');
    fireEvent.click(heartIcon);
    
    const { isFavorite: isFavoriteAfter } = useCharacterStore.getState();
    expect(isFavoriteAfter('1')).toBe(true);
  });

  it('shows comments section', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  it('can add a comment to the character', async () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    const textarea = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(textarea, { target: { value: 'Great character!' } });
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Great character!')).toBeInTheDocument();
  });

  it('shows all character property labels', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Occupation')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Origin')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('sets selected character id on mount', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: mockCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    const { selectedCharacterId } = useCharacterStore.getState();
    expect(selectedCharacterId).toBe('1');
  });

  it('handles different character ids from params', () => {
    mockUseParams.mockReturnValue({ id: '42' });
    
    mockUseCharacterDetail.mockReturnValue({
      character: { ...mockCharacter, id: '42', name: 'Morty Smith' },
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    const { selectedCharacterId } = useCharacterStore.getState();
    expect(selectedCharacterId).toBe('42');
  });

  it('shows error when character is null', () => {
    mockUseCharacterDetail.mockReturnValue({
      character: null,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    expect(screen.getByText('Character not found')).toBeInTheDocument();
  });

  it('displays character with minimal data', () => {
    const minimalCharacter: Character = {
      ...mockCharacter,
      type: '',
      origin: {
        id: '',
        name: '',
        type: '',
        dimension: '',
      },
      location: {
        id: '',
        name: '',
        type: '',
        dimension: '',
      },
    };

    mockUseCharacterDetail.mockReturnValue({
      character: minimalCharacter,
      loading: false,
      error: undefined,
      isDeleted: false,
    });

    render(<CharacterPage />);
    
    // Debería mostrar "Unknown" para campos vacíos
    const unknownElements = screen.getAllByText('Unknown');
    expect(unknownElements.length).toBeGreaterThan(0);
  });
});

