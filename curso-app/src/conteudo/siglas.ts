function textoMarkdown(valor: string): string {
  return valor.replace(/\*\*|\*|__|_|`/g, '').replace(/<[^>]*>/g, '').trim();
}

/** Lê as duas primeiras colunas do quadro "Siglas usadas no curso". */
export function lerQuadroDeSiglas(markdown: string): Map<string, string> {
  const linhas = markdown.split(/\r?\n/);
  const titulo = linhas.findIndex((linha) => /^##\s+Siglas usadas no curso\s*$/.test(linha.trim()));
  if (titulo < 0) throw new Error('quadro de siglas ausente: seção "Siglas usadas no curso" não encontrada');

  const definicoes = new Map<string, string>();
  let iniciouTabela = false;
  for (const linha of linhas.slice(titulo + 1)) {
    if (!iniciouTabela && !linha.trim()) continue;
    if (!linha.trim().startsWith('|')) break;
    iniciouTabela = true;
    const colunas = linha.split('|').slice(1, -1).map((c) => c.trim());
    if (colunas.length < 3 || /^-+$/.test(colunas[0]!.replace(/\s/g, ''))) continue;
    const sigla = textoMarkdown(colunas[0]!);
    const definicao = textoMarkdown(colunas[1]!);
    if (sigla === 'Sigla' && definicao === 'Significado') continue;
    if (!sigla || !definicao) throw new Error(`quadro de siglas inválido: sigla ou definição vazia na linha "${linha}"`);
    if (definicoes.has(sigla)) throw new Error(`quadro de siglas inválido: sigla repetida "${sigla}"`);
    definicoes.set(sigla, definicao);
  }
  if (definicoes.size === 0) throw new Error('quadro de siglas ausente ou vazio');
  return definicoes;
}

const EXCECOES = new Set(['README', 'OK']);

/** Identifica siglas por palavra inteira, incluindo plural PRs e códigos como UC12/RF02. */
export function siglasNoTexto(texto: string, conhecidas: ReadonlyMap<string, string>): Array<{ sigla: string; inicio: number; fim: number }> {
  const nomes = [...conhecidas.keys()].sort((a, b) => b.length - a.length).map(escaparRegex).join('|');
  if (!nomes) return [];
  const regex = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${nomes})(?:s|\\d{1,3}|-\\d{1,3})?(?![\\p{L}\\p{N}_])`, 'giu');
  const saida: Array<{ sigla: string; inicio: number; fim: number }> = [];
  for (const m of texto.matchAll(regex)) {
    const token = m[0];
    const sigla = [...conhecidas.keys()].sort((a, b) => b.length - a.length).find((nome) => token.toUpperCase().startsWith(nome.toUpperCase()));
    if (sigla) saida.push({ sigla, inicio: m.index!, fim: m.index! + token.length });
  }
  return saida;
}

export function siglasSemDefinicao(texto: string, conhecidas: ReadonlyMap<string, string>): string[] {
  const resultado = new Set<string>();
  for (const m of texto.matchAll(/(?<![\p{L}\p{N}_])\p{Lu}{2,6}(?:-\d+)?(?![\p{L}\p{N}_])/gu)) {
    const token = m[0];
    if (EXCECOES.has(token) || [...conhecidas.keys()].some((s) => token === s || new RegExp(`^${escaparRegex(s)}(?:s|\\d{1,3}|-\\d{1,3})$`, 'i').test(token))) continue;
    resultado.add(token);
  }
  return [...resultado];
}

function escaparRegex(valor: string): string {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
