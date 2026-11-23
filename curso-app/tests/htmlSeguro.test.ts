import { describe, expect, it } from 'vitest';
import { htmlCruComoTexto } from '../src/conteudo/htmlSeguro';

describe('HTML cru em Markdown', () => {
  it('converte o nó para texto escapável em vez de permitir HTML executável', () => {
    let substituto: unknown;
    htmlCruComoTexto.raw(
      { value: '<script>alert(1)</script>' },
      { replaceNode: (_no, novo) => { substituto = novo; } },
    );
    expect(substituto).toEqual({ type: 'text', value: '<script>alert(1)</script>' });
  });
});
