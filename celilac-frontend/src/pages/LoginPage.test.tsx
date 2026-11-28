import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './LoginPage';

describe('Formulário de login (F02)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should show the e-mail and password fields and the submit button (CA02)', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute('type', 'submit');
  });

  it('should not send any request when the login form is submitted (CA07)', async () => {
    // Observa os dois meios de requisição por código: fetch e XMLHttpRequest.
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const xhrSpy = vi.spyOn(XMLHttpRequest.prototype, 'send');
    const user = userEvent.setup();
    render(<LoginPage />);

    // Sem "action", o envio nativo do HTML não aponta para a API.
    const botao = screen.getByRole('button', { name: 'Entrar' });
    expect(botao.closest('form')).not.toHaveAttribute('action');
    expect(botao).not.toHaveAttribute('formaction');

    await user.type(screen.getByLabelText('E-mail'), 'pessoa@exemplo.com');
    await user.type(screen.getByLabelText('Senha'), 'senha-de-teste');
    await user.click(botao);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrSpy).not.toHaveBeenCalled();
  });
});
