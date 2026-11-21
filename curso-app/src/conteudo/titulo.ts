// Título da página: vem do front matter, e o `h1` do corpo é retirado na conversão para não repetir.
// Para nada se perder, a construção exige que os dois sejam iguais (plano do M1, registro da implementação).

/** Texto do primeiro título de nível 1 fora de blocos de código. */
export function primeiroTitulo(corpo: string): string | undefined {
  let emCodigo = false;
  for (const linha of corpo.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(linha)) emCodigo = !emCodigo;
    else if (!emCodigo && linha.startsWith('# ')) return linha.slice(2).trim();
  }
  return undefined;
}

export function compararTitulo(arquivo: string, corpo: string, titulo: string): string[] {
  const h1 = primeiroTitulo(corpo);
  if (h1 === titulo) return [];
  return [`conteúdo inválido: ${arquivo}: titulo: "${titulo}" difere do título do corpo ("${h1 ?? 'sem título de nível 1'}")`];
}

/** Partes do título, separando os trechos entre crases (exibidos como código). */
export function partesDoTitulo(titulo: string): Array<{ codigo: boolean; texto: string }> {
  return titulo
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((p) => (p.startsWith('`') && p.endsWith('`') ? { codigo: true, texto: p.slice(1, -1) } : { codigo: false, texto: p }));
}

/** Título em texto simples, para a aba do navegador. */
export const tituloSimples = (titulo: string) => titulo.replace(/`/g, '');
