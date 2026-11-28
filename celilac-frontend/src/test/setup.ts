// Preparação comum dos testes.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Desmonta o que foi renderizado, para um teste não interferir no outro.
afterEach(() => {
  cleanup();
});
