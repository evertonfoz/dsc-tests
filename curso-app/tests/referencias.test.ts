// Referências entre arquivos e mapa de páginas (plano do M1, seção 4.1).
import { describe, expect, it } from 'vitest';
import { resolverReferencia, resolverReferenciaMarkdown, type ContextoDeReferencias } from '../src/conteudo/referencias';
import { paginasDoCurso } from '../src/conteudo/paginas';

const fm = (id: string, tipo: string) => `---\nid: ${id}\ntipo: ${tipo}\ntitulo: 'X'\n---\n# X\n`;
const paginas = paginasDoCurso([
  { nome: 'README.md', texto: '# Curso\n' },
  { nome: 'm02-estado-como-fonte.md', texto: fm('m02', 'modulo') },
  { nome: 'm02-pratica.md', texto: fm('m02-pratica', 'pratica') },
  { nome: 'm02-gabarito.md', texto: fm('m02-gabarito', 'gabarito') },
]);
const ctx: ContextoDeReferencias = { paginas, commit: 'f6205a2', repositorio: 'dono/repo', pastaDoProjeto: 'projeto' };

describe('paginasDoCurso', () => {
  it('mapeia arquivos para rotas pelo id e exclui gabaritos', () => {
    expect([...paginas]).toEqual([
      ['README.md', '/'],
      ['m02-estado-como-fonte.md', '/m02/'],
      ['m02-pratica.md', '/m02-pratica/'],
    ]);
  });
});

describe('resolverReferencia', () => {
  it('arquivo do curso com página vira link interno', () => {
    expect(resolverReferencia('m02-pratica.md', ctx)).toEqual({ tipo: 'interno', href: '/m02-pratica/' });
    expect(resolverReferencia('README.md', ctx)).toEqual({ tipo: 'interno', href: '/' });
  });

  it('normaliza links Markdown equivalentes em caminhos internos publicados', () => {
    for (const href of ['m02-pratica.md', './m02-pratica.md', './m02-pratica.md#entregas']) {
      expect(resolverReferenciaMarkdown(href, 'm02-estado-como-fonte.md', ctx), href).toEqual({
        tipo: 'interno', href: href.endsWith('#entregas') ? '/m02-pratica/#entregas' : '/m02-pratica/',
      });
    }
    expect(resolverReferenciaMarkdown('../../../segredo.md', 'm02-estado-como-fonte.md', ctx)).toBeNull();
    expect(resolverReferenciaMarkdown('../../templates/state.yaml.md', 'm02-estado-como-fonte.md', ctx)).toEqual({
      tipo: 'github', href: 'https://github.com/dono/repo/blob/f6205a2/projeto/method/templates/state.yaml.md',
    });
  });

  it('gabarito fica como texto', () => {
    expect(resolverReferencia('m02-gabarito.md', ctx)).toBeNull();
  });

  it('arquivo do método vira link para o GitHub no commit de origem', () => {
    expect(resolverReferencia('method/templates/state.yaml', ctx)).toEqual({
      tipo: 'github',
      href: 'https://github.com/dono/repo/blob/f6205a2/projeto/method/templates/state.yaml',
    });
  });

  it('sufixo de linha vira âncora do GitHub', () => {
    expect(resolverReferencia('src/app.module.ts:10-20', ctx)?.href).toBe('https://github.com/dono/repo/blob/f6205a2/projeto/src/app.module.ts#L10-L20');
  });

  it('UC12 vira link interno só quando o arquivo pertence ao inventário', () => {
    const comUc12 = { ...ctx, uc12Paginas: new Map([['docs/uc/uc12/state.yaml', '/uc12/state/']]) };
    expect(resolverReferencia('docs/uc/uc12/state.yaml', comUc12)).toEqual({ tipo: 'interno', href: '/uc12/state/' });
    expect(resolverReferencia('docs/uc/uc12/segredo.txt', comUc12)).toBeNull();
  });

  it('diretório, nome solto, modelo e comando ficam como texto', () => {
    for (const t of ['method/', 'method/exemplos/', 'state.yaml', 'docs/uc/{{uc_pasta}}/state.yaml', 'method/scripts/check-state.sh docs/uc/<uc>/state.yaml', 'docs/../segredo.md']) {
      expect(resolverReferencia(t, ctx), t).toBeNull();
    }
  });

  it('sem commit de origem, nenhum link para o GitHub', () => {
    expect(resolverReferencia('method/templates/state.yaml', { ...ctx, commit: undefined })).toBeNull();
  });

  it('caminho fora das raízes do projeto fica como texto', () => {
    expect(resolverReferencia('.github/workflows/ci.yml', ctx)).toBeNull();
  });
});
