import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Endereço base da API (base do projeto)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('should expose the API base URL from VITE_API_BASE_URL (CA05)', async () => {
    // Valor diferente do usado no .env, para provar que ele vem da variável.
    vi.stubEnv('VITE_API_BASE_URL', 'http://api.exemplo.test:4000');
    vi.resetModules();

    // Importa depois de definir a variável, que é lida na carga do módulo.
    const { API_BASE_URL } = await import('./apiClient');

    expect(API_BASE_URL).toBe('http://api.exemplo.test:4000');
  });
});
