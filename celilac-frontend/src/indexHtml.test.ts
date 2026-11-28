import { describe, expect, it } from 'vitest';

import html from '../index.html?raw';

const pagina = new DOMParser().parseFromString(html, 'text/html');

describe('Documento HTML da aplicação (base do projeto)', () => {
  it('should declare the page language as Brazilian Portuguese (CA08)', () => {
    expect(pagina.documentElement.lang).toBe('pt-BR');
  });

  it('should use CeliLac as the page title (CA08)', () => {
    expect(pagina.title).toBe('CeliLac');
  });
});
