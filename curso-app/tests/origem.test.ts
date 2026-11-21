// Critério 2 do M0: rodapé com commit e data de origem (plano do M0, seção 5).
import { describe, expect, it } from 'vitest';
import { lerOrigem } from '../src/conteudo/origem';

describe('lerOrigem', () => {
  it('sem variáveis, devolve null (rodapé "a confirmar")', () => {
    expect(lerOrigem({})).toBeNull();
  });

  it('lê commit e data, e exibe em formato brasileiro em UTC', () => {
    const o = lerOrigem({ ORIGEM_COMMIT: '7cb151504a900d20032014d2ef1b40c3763f43e0', ORIGEM_DATA: '2026-11-21T11:20:54-03:00' });
    expect(o).toEqual({
      commit: '7cb151504a900d20032014d2ef1b40c3763f43e0',
      commitCurto: '7cb1515',
      dataUtc: '2026-11-21T14:20:54.000Z',
      dataExibida: '21/11/2026 14:20 UTC',
    });
  });

  it('recusa commit que não é hexadecimal', () => {
    expect(() => lerOrigem({ ORIGEM_COMMIT: 'main', ORIGEM_DATA: '2026-11-21T14:20:54Z' })).toThrow(/ORIGEM_COMMIT inválido/);
  });

  it('recusa data ausente ou inválida quando há commit', () => {
    expect(() => lerOrigem({ ORIGEM_COMMIT: '7cb1515' })).toThrow(/ORIGEM_DATA inválida/);
    expect(() => lerOrigem({ ORIGEM_COMMIT: '7cb1515', ORIGEM_DATA: 'ontem' })).toThrow(/ORIGEM_DATA inválida/);
  });
});
