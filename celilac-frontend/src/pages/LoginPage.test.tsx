import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginPage } from './LoginPage';

describe('Formulário de login (F02)', () => {
  it('should show the e-mail and password fields and the submit button (CA02)', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute('type', 'submit');
  });
});
