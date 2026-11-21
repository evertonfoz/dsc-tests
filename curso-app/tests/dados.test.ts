import { describe, expect, it } from 'vitest';
import { chaveChecklist, dadosVazios, migrarV1ParaV2, separarIdsLegados, validarDados } from '../src/dados/modelo';

describe('dados pessoais do curso', () => {
  it('cria um documento v1 com os escopos aprovados para M3', () => {
    expect(dadosVazios('abc123', '2026-11-21T12:00:00.000Z')).toEqual({
      versao: 1,
      meta: {
        commitConteudoCriacao: 'abc123',
        commitConteudoUltimaGravacao: 'abc123',
        criadoEm: '2026-11-21T12:00:00.000Z',
        atualizadoEm: '2026-11-21T12:00:00.000Z',
      },
      conteudos: {},
      preferencias: {},
      legado: {},
    });
  });

  it('gera a mesma chave para diferenças de espaços, caixa e Unicode composto', () => {
    expect(chaveChecklist('  O   teste TERMINA   com OK. ')).toBe(chaveChecklist('o teste termina com ok.'));
    expect(chaveChecklist('cafe\u0301')).toBe(chaveChecklist('café'));
  });

  it('recusa estrutura inválida e versões não reconhecidas', () => {
    const dados = dadosVazios('abc');
    expect(() => validarDados({ ...dados, versao: 99 })).toThrow('Versão de arquivo não reconhecida');
    expect(() => validarDados({ ...dados, conteudos: [] })).toThrow('progresso válido');
    expect(() => validarDados({ ...dados, conteudos: { m01: { checklist: { ruim: { texto: 'x', marcado: true, em: 'agora' } } } } })).toThrow('Item de checklist inválido');
    expect(() => validarDados(JSON.parse('{"versao":1,"meta":{"commitConteudoCriacao":"a","commitConteudoUltimaGravacao":"a","criadoEm":"agora","atualizadoEm":"agora"},"conteudos":{"__proto__":{"lido":{"em":"agora"}}},"preferencias":{},"legado":{}}'))).toThrow('Registro de conteúdo inválido');
  });

  it('preserva conteúdo desconhecido no escopo legado', () => {
    const dados = dadosVazios('abc');
    dados.conteudos['modulo-removido'] = { lido: { em: '2026-11-20' } };
    const migrados = separarIdsLegados(dados, new Set(['m01']));
    expect(migrados.conteudos['modulo-removido']).toBeUndefined();
    expect(migrados.legado['modulo-removido']).toEqual({ lido: { em: '2026-11-20' } });
  });

  it('migra v1 para v2 acrescentando escopos sem perder dados pessoais', () => {
    const v1 = dadosVazios('abc');
    v1.conteudos.m01 = {
      lido: { em: '2026-11-20' },
      tentativa: { texto: 'Minha hipótese', em: '2026-11-20' },
      checklist: { [chaveChecklist('O teste termina com OK')]: { texto: 'O teste termina com OK', marcado: true, em: '2026-11-20' } },
    };
    v1.preferencias.tema = 'escuro';
    v1.legado['modulo-removido'] = { tentativa: { texto: 'preservada' } };
    const v2 = migrarV1ParaV2(v1);
    expect(v2.versao).toBe(2);
    expect(v2.conteudos).toEqual(v1.conteudos);
    expect(v2.preferencias).toEqual(v1.preferencias);
    expect(v2.legado).toEqual(v1.legado);
    expect(v2).toMatchObject({ projeto: {}, casoDeUso: {}, passos: {}, fases: {} });
  });
});
