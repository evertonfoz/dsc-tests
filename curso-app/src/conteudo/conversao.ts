// Passo da conversão do Markdown, como plugin do Sätteri sobre a árvore HTML (plano do M1, seções 4.1 e 4.2;
// processador decidido pelo professor em 2026-11-21):
// 1. trecho de código que nomeia um arquivo vira link, mantendo a aparência de código;
// 2. cada tabela fica num contêiner com rolagem própria, focável e com rótulo;
// 3. o h1 do corpo sai (a página o gera do front matter, com a ficha logo abaixo); o README o mantém.
import { resolverReferencia, type ContextoDeReferencias } from './referencias';

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
}

function dentroDe(no: No, tags: string[], ctx: ContextoDoVisitante): boolean {
  for (let p = ctx.parent(no); p; p = ctx.parent(p)) {
    if (p.type === 'element' && tags.includes((p as Elemento).tagName)) return true;
  }
  return false;
}

/** Fábrica chamada uma vez por documento (o contador de tabelas e o h1 são por arquivo). */
export function pluginDeConversao(ref: ContextoDeReferencias, textos: TextosDaConversao) {
  return (documento: { fileURL: URL | undefined }) => {
    let tabelas = 0;
    let h1Retirado = documento.fileURL?.pathname.endsWith('/README.md') ?? false;
    return {
      name: 'curso-conversao',
      element: {
        filter: ['code', 'table', 'h1', 'pre', 'input'],
        visit(no: Elemento, ctx: ContextoDoVisitante) {
          // 4. bloco de código que rola precisa receber foco pelo teclado (WCAG 2.1.1).
          if (no.tagName === 'pre') {
            ctx.setProperty(no, 'tabIndex', 0);
            return;
          }
          // 5. caixas das listas de verificação: no M1 são só leitura (desabilitadas, sem rótulo próprio);
          //    o texto do item já diz o que conferir. Viram controles com rótulo no M3.
          if (no.tagName === 'input') {
            if (no.properties.type === 'checkbox') ctx.setProperty(no, 'ariaHidden', 'true');
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
            ctx.replaceNode(no, { type: 'element', tagName: 'a', properties: { href: alvo.href, className: ['ref'] }, children: [codigo] });
          } else {
            ctx.replaceNode(no, {
              type: 'element',
              tagName: 'a',
              properties: { href: alvo.href, className: ['ref', 'externo'], rel: ['noopener', 'noreferrer'] },
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
