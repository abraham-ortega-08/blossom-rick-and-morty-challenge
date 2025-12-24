import { render, screen, fireEvent, act } from '@/__tests__/test-utils';
import { CharacterFilters } from '../CharacterFilters';
import { useCharacterStore } from '@/store/useCharacterStore';

describe('CharacterFilters', () => {
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
        filters: {
          search: '',
          characterFilter: 'all',
          speciesFilter: 'all',
          statusFilter: 'all',
          genderFilter: 'all',
          sortOrder: 'asc',
        },
        isFilterPanelOpen: false,
      });
    });
  });

  it('does not render when panel is closed', () => {
    const { container } = render(<CharacterFilters />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all filters when panel is open', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('Specie')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('shows all Character options', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    // Verify that multiple "All" buttons exist (one for each filter section)
    const allButtons = screen.getAllByText('All');
    expect(allButtons.length).toBeGreaterThan(0);
    
    expect(screen.getByText('Starred')).toBeInTheDocument();
    expect(screen.getByText('Others')).toBeInTheDocument();
  });

  it('shows all Species options', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Alien')).toBeInTheDocument();
  });

  it('shows all Status options', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Dead')).toBeInTheDocument();
    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0);
  });

  it('shows all Gender options', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Genderless')).toBeInTheDocument();
  });

  it('changing Character filter updates the store', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    const starredButton = screen.getByText('Starred');
    fireEvent.click(starredButton);

    const { filters } = useCharacterStore.getState();
    expect(filters.characterFilter).toBe('starred');
  });

  it('changing Species filter updates the store', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    const humanButton = screen.getByText('Human');
    fireEvent.click(humanButton);

    const { filters } = useCharacterStore.getState();
    expect(filters.speciesFilter).toBe('Human');
  });

  it('changing Status filter updates the store', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    const aliveButton = screen.getByText('Alive');
    fireEvent.click(aliveButton);

    const { filters } = useCharacterStore.getState();
    expect(filters.statusFilter).toBe('Alive');
  });

  it('changing Gender filter updates the store', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    const femaleButton = screen.getByText('Female');
    fireEvent.click(femaleButton);

    const { filters } = useCharacterStore.getState();
    expect(filters.genderFilter).toBe('Female');
  });

  it('Filter button is disabled when no filters are active', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    const filterButton = screen.getByText('Filter');
    expect(filterButton).toHaveClass('bg-gray-100');
  });

  it('Filter button is enabled when filters are active', () => {
    act(() => {
      const { setFilterPanelOpen, setCharacterFilter } = useCharacterStore.getState();
      setFilterPanelOpen(true);
      setCharacterFilter('starred');
    });

    render(<CharacterFilters />);

    const filterButton = screen.getByText('Filter');
    expect(filterButton).toHaveClass('bg-[var(--primary-700)]');
  });

  it('applying filters closes the panel', () => {
    act(() => {
      const { setFilterPanelOpen, setCharacterFilter } = useCharacterStore.getState();
      setFilterPanelOpen(true);
      setCharacterFilter('starred');
    });

    render(<CharacterFilters />);

    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    const { isFilterPanelOpen } = useCharacterStore.getState();
    expect(isFilterPanelOpen).toBe(false);
  });

  it('calls onApply when filters are applied', () => {
    const mockOnApply = jest.fn();
    
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters onApply={mockOnApply} />);

    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
  });

  it('multiple filters can be active at the same time', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    // Activate multiple filters
    fireEvent.click(screen.getByText('Starred'));
    fireEvent.click(screen.getByText('Human'));
    fireEvent.click(screen.getByText('Alive'));
    fireEvent.click(screen.getByText('Female'));

    const { filters } = useCharacterStore.getState();
    expect(filters.characterFilter).toBe('starred');
    expect(filters.speciesFilter).toBe('Human');
    expect(filters.statusFilter).toBe('Alive');
    expect(filters.genderFilter).toBe('Female');
  });

  it('shows Clear button when filters are active', () => {
    act(() => {
      const { setFilterPanelOpen, setCharacterFilter } = useCharacterStore.getState();
      setFilterPanelOpen(true);
      setCharacterFilter('starred');
    });

    render(<CharacterFilters />);

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('does not show Clear button when no filters are active', () => {
    act(() => {
      const { setFilterPanelOpen } = useCharacterStore.getState();
      setFilterPanelOpen(true);
    });

    render(<CharacterFilters />);

    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('Clear button resets all filters', () => {
    act(() => {
      const { setFilterPanelOpen, setCharacterFilter, setSpeciesFilter, setStatusFilter, setGenderFilter } = useCharacterStore.getState();
      setFilterPanelOpen(true);
      
      // Set multiple filters
      setCharacterFilter('starred');
      setSpeciesFilter('Human');
      setStatusFilter('Alive');
      setGenderFilter('Female');
    });

    render(<CharacterFilters />);

    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);

    const { filters } = useCharacterStore.getState();
    expect(filters.characterFilter).toBe('all');
    expect(filters.speciesFilter).toBe('all');
    expect(filters.statusFilter).toBe('all');
    expect(filters.genderFilter).toBe('all');
  });
});

