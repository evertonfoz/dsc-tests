import { describe, expect, it } from 'vitest';
import { lerQuadroDeSiglas, siglasNoTexto, siglasSemDefinicao } from '../src/conteudo/siglas';

const quadro = `# Curso\n\n## Siglas usadas no curso\n\n| Sigla | Significado | Em uma frase |\n|---|---|---|\n| CI | *Continuous Integration*, integração contínua | Um robô |\n| PR | *Pull Request* | Proposta |\n| UC | *Use Case*, caso de uso | Comportamento |\n`;

describe('quadro de siglas', () => {
  it('lê o quadro depois de uma linha em branco e remove marcação Markdown', () => {
    expect(lerQuadroDeSiglas(quadro)).toEqual(new Map([
      ['CI', 'Continuous Integration, integração contínua'],
      ['PR', 'Pull Request'],
      ['UC', 'Use Case, caso de uso'],
    ]));
  });

  it('falha quando o quadro está ausente, repetido ou tem definição vazia', () => {
    expect(() => lerQuadroDeSiglas('# Sem quadro')).toThrow(/ausente/);
    expect(() => lerQuadroDeSiglas(quadro.replace('| UC |', '| CI |'))).toThrow(/repetida/);
    expect(() => lerQuadroDeSiglas(quadro.replace('| CI | *Continuous Integration*, integração contínua |', '| CI |  |'))).toThrow(/vazia/);
  });

  it('reconhece palavras inteiras, plurais e siglas com numeração', () => {
    const conhecidas = new Map([['CI', 'integração contínua'], ['PR', 'proposta'], ['UC', 'caso de uso'], ['CA', 'critério']]);
    expect(siglasNoTexto('CI em PRs, UC12, CA01 e ADR-001; não identificar APIx.', new Map([...conhecidas, ['ADR', 'registro']])).map((a) => a.sigla)).toEqual(['CI', 'PR', 'UC', 'CA', 'ADR']);
  });

  it('avisa siglas fora do quadro sem incluir exceções nem códigos conhecidos', () => {
    expect(siglasSemDefinicao('RED, GREEN, SUB-07, NUL, ADR-001, README, OK, A7, F03 e CA01.', new Map([['CA', 'critério'], ['ADR', 'registro']]))).toEqual([
      'RED', 'GREEN', 'SUB-07', 'NUL',
    ]);
  });
});
