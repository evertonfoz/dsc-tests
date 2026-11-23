// Comparação da linha "Pré-requisito" com o front matter (plano do M1, seção 9).
import { describe, expect, it } from 'vitest';
import { compararPrerequisito, idsCitados } from '../src/conteudo/prerequisitos';
import type { FrontMatterPercurso } from '../src/conteudo/esquema';

function dados(parcial: Partial<FrontMatterPercurso>): FrontMatterPercurso {
  return { id: 'm08', tipo: 'modulo', titulo: 'M8', ordem: 13, prerequisitos: [], duracao: '2 aulas', ...parcial };
}
const linha = (texto: string) => `# Título\n\n> **Pré-requisito:** ${texto}\n\nCorpo.`;

describe('idsCitados', () => {
  it('lê faixa de módulos e apoio, ignorando parênteses', () => {
    expect([...idsCitados('> **Pré-requisito:** módulos 4 a 7 e apoio D (contêineres).')]).toEqual(['m04', 'm05', 'm06', 'm07', 'apoio-d']);
  });
  it('lê listas com vírgula e "e"', () => {
    expect([...idsCitados('módulos 4, 7, 8 e 9, e apoios C e D.')].sort()).toEqual(['apoio-c', 'apoio-d', 'm04', 'm07', 'm08', 'm09']);
  });
  it('ignora nomes de arquivo entre crases', () => {
    expect([...idsCitados('módulo 1 e o apoio A (`apoio-a-github.md`).')]).toEqual(['m01', 'apoio-a']);
  });
  it('linha sem id não cita nada', () => {
    expect(idsCitados('saber fazer commit, push e abrir uma branch.').size).toBe(0);
  });
});

describe('compararPrerequisito', () => {
  it('aceita a linha que bate com o front matter (caso real do m08)', () => {
    const d = dados({ prerequisitos: ['m04', 'm05', 'm06', 'm07', 'apoio-d'], duracao: '2 a 3 aulas' });
    expect(compararPrerequisito('m08.md', linha('módulos 4 a 7 e apoio D (contêineres). Duração sugerida: 2 a 3 aulas.'), d)).toEqual([]);
  });

  it('aceita o condicional em prosa (caso real do m01)', () => {
    const d = dados({ id: 'm01', prerequisitos: ['m00'], prerequisitos_se_precisar: ['apoio-b'] });
    const texto = 'módulo 0 e o apoio B (testes automatizados), se você ainda não escreveu um teste. Duração sugerida: 2 aulas.';
    expect(compararPrerequisito('m01.md', linha(texto), d)).toEqual([]);
  });

  it('acusa pré-requisito do front matter que a linha não cita', () => {
    const d = dados({ prerequisitos: ['m03', 'apoio-b'] });
    expect(compararPrerequisito('m05.md', linha('apoio B. Duração sugerida: 2 aulas.'), d)).toEqual([
      'conteúdo inválido: m05.md: linha "Pré-requisito": não cita "m03", que está em prerequisitos',
    ]);
  });

  it('acusa id citado que não está no front matter', () => {
    const d = dados({ prerequisitos: ['m03'] });
    expect(compararPrerequisito('m05.md', linha('módulos 3 e 4.'), d)).toEqual([
      'conteúdo inválido: m05.md: linha "Pré-requisito": cita "m04", que não está em prerequisitos nem em prerequisitos_se_precisar',
    ]);
  });

  it('acusa duração divergente', () => {
    const d = dados({ prerequisitos: ['m03'], duracao: '2 aulas' });
    expect(compararPrerequisito('m05.md', linha('módulo 3. Duração sugerida: 3 aulas.'), d)).toEqual([
      'conteúdo inválido: m05.md: linha "Pré-requisito": a duração sugerida não contém "2 aulas" (campo duracao)',
    ]);
  });

  it('aceita arquivo sem a linha quando prerequisitos é vazio', () => {
    expect(compararPrerequisito('apoio-b.md', '# Apoio B\n\nCorpo.', dados({ prerequisitos: [] }))).toEqual([]);
  });

  it('acusa arquivo sem a linha quando prerequisitos não é vazio', () => {
    expect(compararPrerequisito('m02.md', '# M2\n', dados({ prerequisitos: ['m01'] }))).toEqual([
      'conteúdo inválido: m02.md: linha "Pré-requisito": ausente, mas prerequisitos tem m01',
    ]);
  });
});
