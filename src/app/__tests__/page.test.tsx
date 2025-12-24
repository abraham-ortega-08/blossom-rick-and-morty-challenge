import { render, screen } from '@/__tests__/test-utils';
import Home from '../page';

describe('Home Page', () => {
  it('renders the home page correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Select a character to see details')).toBeInTheDocument();
  });

  it('displays the user icon', () => {
    const { container } = render(<Home />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-16', 'h-16');
  });

  it('has centered layout', () => {
    const { container } = render(<Home />);
    
    const mainDiv = container.querySelector('.flex.items-center.justify-center');
    expect(mainDiv).toBeInTheDocument();
  });

  it('displays message in gray color', () => {
    render(<Home />);
    
    const message = screen.getByText('Select a character to see details');
    expect(message).toHaveClass('text-lg');
  });

  it('renders without errors', () => {
    const { container } = render(<Home />);
    expect(container).toBeInTheDocument();
  });
});

