import '@testing-library/jest-dom';

// Mock de crypto.randomUUID para tests
if (typeof crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(7),
  } as any;
}

// Suprimir el warning de "Not implemented: navigation" de jsdom
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Filtrar el error de navegación de jsdom
    const errorString = args[0]?.toString() || '';
    if (errorString.includes('Not implemented: navigation')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
