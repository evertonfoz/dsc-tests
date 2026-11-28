import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '../App';

describe('Telas iniciais (F01)', () => {
  it('should redirect the root path to the login page (CA01)', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(window.location.pathname).toBe('/login');
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });

  it('should show the dashboard page at /dashboard (CA03)', () => {
    window.history.pushState({}, '', '/dashboard');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/representará uma área autenticada/)).toBeInTheDocument();
  });

  it('should show the access denied page at /unauthorized (CA04)', () => {
    window.history.pushState({}, '', '/unauthorized');
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Acesso negado' })).toBeInTheDocument();
    expect(screen.getByText(/não possui permissão para acessar esta página/)).toBeInTheDocument();
  });
});
