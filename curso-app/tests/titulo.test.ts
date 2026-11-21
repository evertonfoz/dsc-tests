// Título da página: front matter × h1 do corpo.
import { describe, expect, it } from 'vitest';
import { compararTitulo, partesDoTitulo, primeiroTitulo, tituloSimples } from '../src/conteudo/titulo';

describe('título', () => {
  it('ignora "# " dentro de bloco de código', () => {
    expect(primeiroTitulo('```bash\n# comentário\n```\n# Real\n')).toBe('Real');
  });

  it('aceita título igual', () => {
    expect(compararTitulo('m03.md', '# Por que a `main` ficou vermelha?\n', 'Por que a `main` ficou vermelha?')).toEqual([]);
  });

  it('acusa título diferente e corpo sem h1', () => {
    expect(compararTitulo('m03.md', '# Outro\n', 'Título')).toEqual(['conteúdo inválido: m03.md: titulo: "Título" difere do título do corpo ("Outro")']);
    expect(compararTitulo('m03.md', 'sem título\n', 'Título')[0]).toContain('sem título de nível 1');
  });

  it('separa trechos de código e gera texto simples', () => {
    expect(partesDoTitulo('Por que a `main` ficou?')).toEqual([
      { codigo: false, texto: 'Por que a ' },
      { codigo: true, texto: 'main' },
      { codigo: false, texto: ' ficou?' },
    ]);
    expect(tituloSimples('a `main` b')).toBe('a main b');
  });
});
