// Referências entre arquivos (plano do M1, seção 4.1). O curso não usa links Markdown:
// cita arquivos entre crases. Esta função decide o que cada trecho de código vira.

export interface ContextoDeReferencias {
  /** Nome de arquivo do curso → rota da página (só arquivos que viram página, mais README.md → "/"). */
  paginas: ReadonlyMap<string, string>;
  /** Commit de origem; sem ele, nenhum link para o GitHub é gerado. */
  commit?: string | undefined;
  /** "dono/repositório" no GitHub. */
  repositorio: string;
  /** Pasta do projeto dentro do repositório. */
  pastaDoProjeto: string;
}

export type Alvo = { tipo: 'interno'; href: string } | { tipo: 'github'; href: string };

/** Raízes do projeto de referência cujos arquivos viram link para o GitHub (decisão 3 do plano do M1). */
const RAIZES_GITHUB = /^(method|docs|src|test)\//;
/** O UC12 ganha páginas próprias no M2; até lá, texto. */
const UC12 = /^docs\/uc\/uc12\//;
/** Comando, modelo ou expressão: nunca é caminho. */
const NAO_E_CAMINHO = /[\s<>{}*$|;&=()]/;

export function resolverReferencia(texto: string, ctx: ContextoDeReferencias): Alvo | null {
  const t = texto.trim();
  if (!t || NAO_E_CAMINHO.test(t)) return null;

  const pagina = ctx.paginas.get(t);
  if (pagina) return { tipo: 'interno', href: pagina };

  if (!ctx.commit || !RAIZES_GITHUB.test(t) || UC12.test(t)) return null;
  const linhas = t.match(/:(\d+)(?:-(\d+))?$/);
  const caminho = linhas ? t.slice(0, linhas.index) : t;
  // Só arquivos (com extensão); diretórios ficam como texto.
  if (!/\/[^/]+\.[a-z0-9]+$/i.test(caminho) || caminho.includes('..')) return null;
  const ancora = linhas ? `#L${linhas[1]}${linhas[2] ? `-L${linhas[2]}` : ''}` : '';
  return {
    tipo: 'github',
    href: `https://github.com/${ctx.repositorio}/blob/${ctx.commit}/${ctx.pastaDoProjeto}/${caminho}${ancora}`,
  };
}
