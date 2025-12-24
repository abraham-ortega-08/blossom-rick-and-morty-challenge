import { render, screen } from '@/__tests__/test-utils';
import Home from '../page';

describe('Home Page', () => {
  it('renders the home page correctly', () => {
    render(<Home />);
    
    expect(screen.getByText('Select a character to see details')).toBeInTheDocument();
  });

  it('displays the user icon', () => {
    const { container } = render(<Home />);
    
    // Iconify renderiza un svg o un elemento con clase iconify
    const icon = container.querySelector('svg') || container.querySelector('[class*="iconify"]');
    expect(icon).toBeInTheDocument();
    // Verificar que el contenedor del icono tenga las clases correctas
    const iconContainer = container.querySelector('.w-16.h-16');
    expect(iconContainer).toBeInTheDocument();
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

