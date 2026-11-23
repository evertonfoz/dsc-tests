// Passo da conversão do Markdown, como plugin do Sätteri sobre a árvore HTML (plano do M1, seções 4.1 e 4.2;
// processador decidido pelo professor em 2026-11-21):
// 1. trecho de código que nomeia um arquivo vira link, mantendo a aparência de código;
// 2. cada tabela fica num contêiner com rolagem própria, focável e com rótulo;
// 3. o h1 do corpo sai (a página o gera do front matter, com a ficha logo abaixo); o README o mantém.
import { resolverReferencia, resolverReferenciaMarkdown, type ContextoDeReferencias } from './referencias';
import { siglasNoTexto, siglasSemDefinicao } from './siglas';

// Tipos mínimos da árvore HTML (hast) e do contexto do visitante, para não depender dos tipos internos do Sätteri.
interface Texto { type: 'text'; value: string }
interface Elemento { type: 'element'; tagName: string; properties: Record<string, unknown>; children: No[] }
type No = Texto | Elemento | { type: string };
interface ContextoDoVisitante {
  parent(no: No): (No & { tagName?: string }) | undefined;
  replaceNode(no: No, novo: No): void;
  wrapNode(no: No, pai: Elemento): void;
  removeNode(no: No): void;
  setProperty(no: No, chave: string, valor: unknown): void;
}

export interface TextosDaConversao {
  rotuloDaTabela: (n: number) => string;
  abreNoGithub: string;
  siglas: ReadonlyMap<string, string>;
}

function dentroDe(no: No, tags: string[], ctx: ContextoDoVisitante): boolean {
  for (let p = ctx.parent(no); p; p = ctx.parent(p)) {
    if (p.type === 'element' && tags.includes((p as Elemento).tagName)) return true;
  }
  return false;
}

function hrefDeOnboarding(href: string): string | undefined {
  if (href === '/') return '/indice/';
  return /\/[^/]*-pratica\/(?:#.*)?$/.test(href) ? href : undefined;
}

/** Converte destinos Markdown antes da geração do HAST, preservando referências equivalentes. */
function converterLinkMarkdownPai(no: No, ctx: ContextoDoVisitante, arquivo: string, ref: ContextoDeReferencias): boolean {
  for (let pai = ctx.parent(no); pai; pai = ctx.parent(pai)) {
    if (pai.type !== 'element' || (pai as Elemento).tagName !== 'a') continue;
    const link = pai as Elemento;
    const href = link.properties.href;
    if (typeof href !== 'string') return true;
    const alvo = resolverReferenciaMarkdown(href, arquivo, ref);
    if (!alvo) return true;
    const hrefOnboarding = alvo.tipo === 'interno' ? hrefDeOnboarding(alvo.href) : undefined;
    const hrefFinal = hrefOnboarding ?? alvo.href;
    const classes = [...(Array.isArray(link.properties.className) ? link.properties.className as string[] : []), 'ref'];
    ctx.setProperty(link, 'href', hrefFinal);
    ctx.setProperty(link, 'className', alvo.tipo === 'github' ? [...classes, 'externo'] : classes);
    if (hrefOnboarding) ctx.setProperty(link, 'dataOnboardingHref', hrefOnboarding);
    if (alvo.tipo === 'github') {
      ctx.setProperty(link, 'target', '_blank');
      ctx.setProperty(link, 'rel', ['noopener', 'noreferrer']);
    }
    return true;
  }
  return false;
}

/** Fábrica chamada uma vez por documento (o contador de tabelas e o h1 são por arquivo). */
export function pluginDeConversao(ref: ContextoDeReferencias, textos: TextosDaConversao) {
  return (documento: { fileURL: URL | undefined }) => {
    let tabelas = 0;
    let h1Retirado = documento.fileURL?.pathname.endsWith('/README.md') ?? false;
    const primeiraParada = new WeakMap<Texto, Set<number>>();
    let siglasPrecomputadas = false;
    const arquivo = documento.fileURL?.pathname.split('/').at(-1) ?? 'arquivo desconhecido';
    const caminhoFonte = arquivo;
    const eLeiaMe = arquivo === 'README.md';

    function textoPlano(no: No): string {
      if (no.type === 'text') return (no as Texto).value;
      if (no.type !== 'element') return '';
      return (no as Elemento).children.map(textoPlano).join('');
    }

    function primeiraExplicada(texto: string, token: string): boolean {
      const sigla = [...textos.siglas.keys()].sort((a, b) => b.length - a.length)
        .find((s) => new RegExp(`^${s}(?:s|\\d{1,3}|-\\d{1,3})?$`, 'i').test(token));
      if (!sigla) return true;
      const nome = siglasNoTexto(texto, new Map([[sigla, '']]))[0];
      if (!nome) return true;
      const antes = texto.slice(0, nome.inicio);
      const depois = texto.slice(nome.fim);
      const abreAntes = antes.lastIndexOf('(');
      return (abreAntes > antes.lastIndexOf(')') && /^\s*\)/.test(depois)) || /^\s*\([^)]{1,160}\)/.test(depois);
    }

    function precomputarSiglas(no: No, ctx: ContextoDoVisitante) {
      if (siglasPrecomputadas) return;
      let raiz = no;
      while (ctx.parent(raiz)) raiz = ctx.parent(raiz)!;
      const conhecidasNaSecao = new Set<string>();
      const desconhecidasNoArquivo = new Set<string>();
      const explicacoesAvisadas = new Set<string>();

      const percorrer = (atual: No, bloco?: Elemento, dentroDoQuadro = false) => {
        if (atual.type === 'text') {
          if (!bloco || dentroDoQuadro) return;
          const texto = (atual as Texto).value;
          for (const sigla of siglasSemDefinicao(texto, textos.siglas)) {
            if (desconhecidasNoArquivo.has(sigla)) continue;
            desconhecidasNoArquivo.add(sigla);
            console.warn(`[curso-app] ${arquivo}: sigla fora do quadro: ${sigla}`);
          }
          for (const ocorrencia of siglasNoTexto(texto, textos.siglas)) {
            if (!conhecidasNaSecao.has(ocorrencia.sigla)) {
              conhecidasNaSecao.add(ocorrencia.sigla);
              let paradas = primeiraParada.get(atual as Texto);
              if (!paradas) { paradas = new Set(); primeiraParada.set(atual as Texto, paradas); }
              paradas.add(ocorrencia.inicio);
              if (!explicacoesAvisadas.has(ocorrencia.sigla)) {
                explicacoesAvisadas.add(ocorrencia.sigla);
                if (!primeiraExplicada(textoPlano(bloco), texto.slice(ocorrencia.inicio, ocorrencia.fim))) {
                  console.warn(`[curso-app] ${arquivo}: sigla usada antes de ser explicada nesta seção: ${ocorrencia.sigla}`);
                }
              }
            }
          }
          return;
        }
        if (atual.type === 'root') {
          for (const filho of (atual as unknown as { children: No[] }).children) percorrer(filho, bloco, dentroDoQuadro);
          return;
        }
        if (atual.type !== 'element') return;
        const elemento = atual as Elemento;
        if (elemento.tagName === 'h2') { conhecidasNaSecao.clear(); explicacoesAvisadas.clear(); return; }
        if (['code', 'pre', 'a', 'h1', 'h3', 'h4', 'script', 'style'].includes(elemento.tagName)) return;
        const dentroDaTabela = dentroDoQuadro || (eLeiaMe && elemento.tagName === 'table');
        const proximoBloco = ['p', 'li', 'td', 'th', 'blockquote'].includes(elemento.tagName) ? elemento : bloco;
        for (const filho of elemento.children) percorrer(filho, proximoBloco, dentroDaTabela);
      };
      percorrer(raiz);
      siglasPrecomputadas = true;
    }

    function transformarTexto(no: Texto, ctx: ContextoDoVisitante) {
      if (converterLinkMarkdownPai(no, ctx, caminhoFonte, ref)) return;
      if (dentroDe(no, ['code', 'pre', 'a', 'h1', 'h2', 'h3', 'h4', 'script', 'style'], ctx)) return;
      // O quadro do README é a própria fonte das definições e não deve receber marcação nem avisos.
      if (eLeiaMe && dentroDe(no, ['table'], ctx)) return;
      const conhecidas = siglasNoTexto(no.value, textos.siglas);
      if (conhecidas.length === 0) return;

      const filhos: No[] = [];
      let posicao = 0;
      for (const encontrada of conhecidas) {
        const token = no.value.slice(encontrada.inicio, encontrada.fim);
        const definicao = textos.siglas.get(encontrada.sigla)!;
        if (encontrada.inicio > posicao) filhos.push({ type: 'text', value: no.value.slice(posicao, encontrada.inicio) });
        const recebeTab = primeiraParada.get(no)?.has(encontrada.inicio) ?? false;
        filhos.push({
          type: 'element', tagName: 'abbr',
          properties: {
            className: ['sigla'], role: 'term', ariaLabel: `${token}: ${definicao}`,
            tabIndex: recebeTab ? 0 : -1,
            dataSigla: encontrada.sigla, dataDefinicao: definicao,
          },
          children: [{ type: 'text', value: token }],
        });
        posicao = encontrada.fim;
      }
      if (posicao < no.value.length) filhos.push({ type: 'text', value: no.value.slice(posicao) });
      ctx.replaceNode(no, { type: 'element', tagName: 'span', properties: { className: ['texto-com-siglas'] }, children: filhos });
    }

    return {
      name: 'curso-conversao',
      element: {
        filter: ['code', 'table', 'h1', 'h2', 'h3', 'h4', 'pre', 'input', 'p', 'li', 'td', 'th', 'blockquote'],
        visit(no: Elemento, ctx: ContextoDoVisitante) {
          precomputarSiglas(no, ctx);
          if (no.tagName === 'code' && converterLinkMarkdownPai(no, ctx, caminhoFonte, ref)) return;
          if (no.tagName === 'h2') {
            return;
          }
          if (['p', 'li', 'td', 'th', 'blockquote'].includes(no.tagName)) {
            const percorrer = (atual: No) => {
              if (atual.type === 'text') transformarTexto(atual as Texto, ctx);
              else if (atual.type === 'element' && !['code', 'pre', 'h1', 'h2', 'h3', 'h4'].includes((atual as Elemento).tagName)) {
                for (const filho of [...(atual as Elemento).children]) percorrer(filho);
              }
            };
            for (const filho of [...no.children]) percorrer(filho);
            return;
          }
          // 4. bloco de código que rola precisa receber foco pelo teclado (WCAG 2.1.1).
          if (no.tagName === 'pre') {
            ctx.setProperty(no, 'tabIndex', 0);
            return;
          }
          // 5. A caixa Markdown é só sintaxe de checklist; o curso não registra marcações pessoais.
          //    Mantém-se o texto do critério como item comum da lista.
          if (no.tagName === 'input') {
            if (no.properties.type === 'checkbox') ctx.removeNode(no);
            return;
          }
          if (no.tagName === 'h1') {
            if (!h1Retirado) {
              h1Retirado = true;
              ctx.removeNode(no);
            }
            return;
          }
          if (no.tagName === 'table') {
            tabelas += 1;
            ctx.wrapNode(no, {
              type: 'element',
              tagName: 'div',
              properties: { className: ['tabela'], role: 'region', ariaLabel: textos.rotuloDaTabela(tabelas), tabIndex: 0 },
              children: [],
            });
            return;
          }
          // code: só trecho em linha, fora de bloco e fora de link.
          const [unico] = no.children;
          if (no.children.length !== 1 || unico?.type !== 'text' || dentroDe(no, ['pre', 'a'], ctx)) return;
          const alvo = resolverReferencia((unico as Texto).value, ref);
          if (!alvo) return;
          const codigo: Elemento = { type: 'element', tagName: 'code', properties: { ...no.properties }, children: [{ type: 'text', value: (unico as Texto).value }] };
          if (alvo.tipo === 'interno') {
            const hrefOnboarding = hrefDeOnboarding(alvo.href);
            ctx.replaceNode(no, {
              type: 'element', tagName: 'a',
              properties: { href: hrefOnboarding ?? alvo.href, className: ['ref'], ...(hrefOnboarding ? { dataOnboardingHref: hrefOnboarding } : {}) },
              children: [codigo],
            });
          } else {
            ctx.replaceNode(no, {
              type: 'element',
              tagName: 'a',
              properties: { href: alvo.href, target: '_blank', className: ['ref', 'externo'], rel: ['noopener', 'noreferrer'] },
              children: [
                codigo,
                { type: 'element', tagName: 'span', properties: { className: ['visualmente-oculto'] }, children: [{ type: 'text', value: ` (${textos.abreNoGithub})` }] },
              ],
            });
          }
        },
      },
    };
  };
}
