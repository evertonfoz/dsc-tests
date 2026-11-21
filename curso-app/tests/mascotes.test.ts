import { describe, expect, it } from 'vitest';
import { atribuirMascotes } from '../src/conteudo/mascotes';

const rotas = ['/', '/mapa/', '/m00/', '/apoio-a/'];
const arquivos = ['mascote_001.png', 'mascote_002.png', 'mascote_003.png'];

describe('atribuição de mascotes', () => {
  it('é reproduzível para o mesmo commit e não repete antes de esgotar os arquivos', () => {
    const primeiro = atribuirMascotes(rotas, arquivos, '3975d87');
    expect(atribuirMascotes(rotas, arquivos, '3975d87')).toEqual(primeiro);
    expect(new Set([...primeiro.values()].slice(0, 3)).size).toBe(3);
    expect([...primeiro.values()][3]).toBeDefined();
  });

  it('usa outra ordem quando muda a semente, sem exigir mudança em todas as sementes', () => {
    expect(atribuirMascotes(rotas, arquivos, '3975d87')).not.toEqual(atribuirMascotes(rotas, arquivos, 'c920158'));
  });

  it('rejeita rotas duplicadas e lista vazia de mascotes', () => {
    expect(() => atribuirMascotes(['/m00/', '/m00/'], arquivos, 'seed')).toThrow(/rotas repetidas/);
    expect(() => atribuirMascotes(['/m00/'], [], 'seed')).toThrow(/nenhum mascote/);
  });
});
