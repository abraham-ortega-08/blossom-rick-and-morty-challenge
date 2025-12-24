import '@testing-library/jest-dom';

// Mock de crypto.randomUUID para tests
if (typeof crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => Math.random().toString(36).substring(7),
  } as any;
}
