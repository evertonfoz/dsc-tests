// Critério 1 do M0: front matter inválido impede a imagem (plano do M0, seções 4 e 7).
import { describe, expect, it } from 'vitest';
import { validarConteudo, type ArquivoDoCurso } from '../src/conteudo/validar';

function curso(): ArquivoDoCurso[] {
  return [
    { arquivo: 'm00-o-caso-pronto.md', dados: { id: 'm00', tipo: 'modulo', titulo: 'M0', ordem: 1, prerequisitos: [], duracao: '1 aula' } },
    {
      arquivo: 'm01-cobertura-real.md',
      dados: { id: 'm01', tipo: 'modulo', titulo: 'M1', ordem: 2, prerequisitos: ['m00'], prerequisitos_se_precisar: ['apoio-b'], duracao: '2 aulas', gabarito: 'm01-gabarito' },
    },
    { arquivo: 'm01-gabarito.md', dados: { id: 'm01-gabarito', tipo: 'gabarito', titulo: 'G1', gabarito_de: ['m01'] } },
    {
      arquivo: 'm02-estado.md',
      dados: { id: 'm02', tipo: 'modulo', titulo: 'M2', ordem: 4, prerequisitos: ['m01'], duracao: '2 aulas', pratica: 'm02-pratica' },
    },
    { arquivo: 'm02-pratica.md', dados: { id: 'm02-pratica', tipo: 'pratica', titulo: 'P2', pratica_de: 'm02' } },
    { arquivo: 'apoio-b-testes.md', dados: { id: 'apoio-b', tipo: 'apoio', titulo: 'B', ordem: 3, prerequisitos: ['m00'], duracao: '1 aula' } },
  ];
}

function alterar(arquivos: ArquivoDoCurso[], arquivo: string, mudar: (d: Record<string, unknown>) => void): ArquivoDoCurso[] {
  return arquivos.map((a) => {
    if (a.arquivo !== arquivo) return a;
    const dados = structuredClone(a.dados) as Record<string, unknown>;
    mudar(dados);
    return { arquivo: a.arquivo, dados };
  });
}

describe('validarConteudo', () => {
  it('aceita um curso conforme', () => {
    expect(validarConteudo(curso())).toEqual([]);
  });

  it('acusa campo obrigatório ausente, com arquivo e campo', () => {
    const erros = validarConteudo(alterar(curso(), 'm01-cobertura-real.md', (d) => delete d.duracao));
    expect(erros).toEqual(['conteúdo inválido: m01-cobertura-real.md: duracao: campo obrigatório ausente']);
  });

  it('acusa campo desconhecido (erro de digitação)', () => {
    const erros = validarConteudo(alterar(curso(), 'm00-o-caso-pronto.md', (d) => (d.prerequisito = [])));
    expect(erros).toContain('conteúdo inválido: m00-o-caso-pronto.md: prerequisito: campo desconhecido');
  });

  it('acusa tipo desconhecido', () => {
    const erros = validarConteudo(alterar(curso(), 'm00-o-caso-pronto.md', (d) => (d.tipo = 'aula')));
    expect(erros).toHaveLength(1);
    expect(erros[0]).toMatch(/^conteúdo inválido: m00-o-caso-pronto\.md: tipo: /);
  });

  it('acusa pré-requisito com id inexistente', () => {
    const erros = validarConteudo(alterar(curso(), 'm02-estado.md', (d) => (d.prerequisitos = ['m1'])));
    expect(erros).toEqual(['conteúdo inválido: m02-estado.md: prerequisitos: "m1" não existe']);
  });

  it('acusa pré-requisito condicional com id inexistente', () => {
    const erros = validarConteudo(alterar(curso(), 'm01-cobertura-real.md', (d) => (d.prerequisitos_se_precisar = ['apoio-z'])));
    expect(erros).toEqual(['conteúdo inválido: m01-cobertura-real.md: prerequisitos_se_precisar: "apoio-z" não existe']);
  });

  it('acusa ciclo no grafo de pré-requisitos', () => {
    const erros = validarConteudo(alterar(curso(), 'm00-o-caso-pronto.md', (d) => (d.prerequisitos = ['m02'])));
    // Dois ciclos reais: m01 pede m00 e, se precisar, apoio-b, que também pede m00.
    expect(erros).toContain('conteúdo inválido: ciclo em prerequisitos: m00 → m02 → m01 → m00');
    expect(erros.every((e) => e.startsWith('conteúdo inválido: ciclo em prerequisitos: '))).toBe(true);
  });

  it('conta os pré-requisitos condicionais no teste de ciclo', () => {
    const erros = validarConteudo(alterar(curso(), 'apoio-b-testes.md', (d) => (d.prerequisitos = ['m01'])));
    expect(erros).toEqual(['conteúdo inválido: ciclo em prerequisitos: apoio-b → m01 → apoio-b']);
  });

  it('acusa id repetido', () => {
    const erros = validarConteudo([...curso(), { arquivo: 'm00-copia.md', dados: { id: 'm00', tipo: 'modulo', titulo: 'X', ordem: 9, prerequisitos: [], duracao: '1' } }]);
    expect(erros).toContain('conteúdo inválido: m00-copia.md: id: "m00" repetido (também em m00-o-caso-pronto.md)');
  });

  it('acusa id que não corresponde ao nome do arquivo', () => {
    const erros = validarConteudo(alterar(curso(), 'apoio-b-testes.md', (d) => (d.id = 'apoio-c')));
    expect(erros).toContain('conteúdo inválido: apoio-b-testes.md: id: "apoio-c" não corresponde ao nome do arquivo');
  });

  it('acusa ordem repetida', () => {
    const erros = validarConteudo(alterar(curso(), 'apoio-b-testes.md', (d) => (d.ordem = 2)));
    expect(erros).toEqual(['conteúdo inválido: apoio-b-testes.md: ordem: 2 repetida (também em m01-cobertura-real.md)']);
  });

  it('acusa gabarito sem reciprocidade', () => {
    const erros = validarConteudo(alterar(curso(), 'm01-gabarito.md', (d) => (d.gabarito_de = ['m00'])));
    expect(erros).toEqual([
      'conteúdo inválido: m01-cobertura-real.md: gabarito: "m01-gabarito" não declara gabarito_de: m01',
      'conteúdo inválido: m01-gabarito.md: gabarito_de: "m00" não declara gabarito: m01-gabarito',
    ]);
  });

  it('acusa prática sem reciprocidade', () => {
    const erros = validarConteudo(alterar(curso(), 'm02-estado.md', (d) => delete d.pratica));
    expect(erros).toEqual(['conteúdo inválido: m02-pratica.md: pratica_de: "m02" não declara pratica: m02-pratica']);
  });

  it('acusa substitui apontando para id que ainda existe', () => {
    const erros = validarConteudo(alterar(curso(), 'm02-estado.md', (d) => (d.substitui = ['m01'])));
    expect(erros).toEqual(['conteúdo inválido: m02-estado.md: substitui: "m01" ainda existe; substitui só vale para id renomeado']);
  });

  it('mostra todos os problemas de uma vez', () => {
    let arquivos = alterar(curso(), 'm01-cobertura-real.md', (d) => delete d.titulo);
    arquivos = alterar(arquivos, 'm02-estado.md', (d) => (d.prerequisitos = ['m9']));
    expect(validarConteudo(arquivos)).toHaveLength(2);
  });
});
