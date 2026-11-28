import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from './App';

// Teste de fumaça: prova que o executor de testes funciona com a tela mínima.
describe('App', () => {
  it('should render the base screen', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'CeliLac' })).toBeInTheDocument();
  });
});
