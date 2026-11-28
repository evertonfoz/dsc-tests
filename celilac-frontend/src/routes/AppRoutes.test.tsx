import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '../App';

// Abre a aplicação no endereço informado, como faria quem digita no navegador.
function abrirEm(caminho: string) {
  window.history.pushState({}, '', caminho);
  render(<App />);
}

describe('Telas iniciais (F01)', () => {
  it('should redirect the root path to the login page (CA01)', () => {
    abrirEm('/');

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should show the dashboard page at /dashboard (CA03)', () => {
    abrirEm('/dashboard');

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/representará uma área autenticada/)).toBeInTheDocument();
  });

  it('should show the access denied page at /unauthorized (CA04)', () => {
    abrirEm('/unauthorized');

    expect(screen.getByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument();
    expect(screen.getByText(/não possui permissão para acessar esta página/)).toBeInTheDocument();
  });
});
