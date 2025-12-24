import { render, screen, fireEvent } from '@/__tests__/test-utils';
import { SearchInput } from '../SearchInput';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();
  const mockOnFilterClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results');
    expect(input).toBeInTheDocument();
  });

  it('shows search icon', () => {
    const { container } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    // Iconify renderiza un svg, pero verificamos que el icono esté presente
    const iconElement = container.querySelector('[class*="iconify"]') || container.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('allows typing in the input', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Rick' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('Rick');
  });

  it('shows the provided value', () => {
    render(
      <SearchInput
        value="Morty"
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results') as HTMLInputElement;
    expect(input.value).toBe('Morty');
  });

  it('shows filter button', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const filterButton = screen.getByLabelText('Toggle filters');
    expect(filterButton).toBeInTheDocument();
  });

  it('calls onFilterClick when filter button is clicked', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const filterButton = screen.getByLabelText('Toggle filters');
    fireEvent.click(filterButton);
    
    expect(mockOnFilterClick).toHaveBeenCalledTimes(1);
  });

  it('applies different styles when filter is active', () => {
    const { rerender } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    let filterButton = screen.getByLabelText('Toggle filters');
    expect(filterButton).toHaveClass('text-gray-400');
    
    rerender(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={true}
      />
    );
    
    filterButton = screen.getByLabelText('Toggle filters');
    expect(filterButton).toHaveClass('text-[var(--primary-600)]');
  });

  it('input has the correct type', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('can use custom placeholder', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
        placeholder="Custom placeholder"
      />
    );
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('calls onChange with the correct value', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results');
    
    fireEvent.change(input, { target: { value: 'Rick Sanchez' } });
    expect(mockOnChange).toHaveBeenCalledWith('Rick Sanchez');
    
    fireEvent.change(input, { target: { value: '123' } });
    expect(mockOnChange).toHaveBeenCalledWith('123');
    
    fireEvent.change(input, { target: { value: 'Rick & Morty #1!' } });
    expect(mockOnChange).toHaveBeenCalledWith('Rick & Morty #1!');
  });

  it('can handle empty values', () => {
    render(
      <SearchInput
        value="Test"
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results');
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('input can receive focus', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onFilterClick={mockOnFilterClick}
        isFilterActive={false}
      />
    );
    
    const input = screen.getByPlaceholderText('Search or filter results');
    input.focus();
    
    expect(document.activeElement).toBe(input);
  });
});
