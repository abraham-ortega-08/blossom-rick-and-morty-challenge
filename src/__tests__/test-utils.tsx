import { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

// Simplificado: no usar Apollo Provider por ahora ya que los tests no hacen llamadas reales
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, options);

// Re-exportar todo de testing-library
export * from '@testing-library/react';
export { customRender as render };

// Helper para limpiar el store de Zustand entre tests
export const clearZustandStore = () => {
  // Limpiar localStorage donde Zustand persiste los datos
  localStorage.clear();
};

// Dummy test para evitar error "must contain at least one test"
describe('test-utils', () => {
  it('exports render function', () => {
    expect(customRender).toBeDefined();
  });
});

