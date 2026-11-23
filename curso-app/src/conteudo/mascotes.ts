/** Nomes versionados da pasta mascotes/web/, copiada para public/mascotes durante a construção. */
export const arquivosDeMascotes = Array.from({ length: 23 }, (_, i) => `mascote_${String(i + 1).padStart(3, '0')}.png`);

function hash(texto: string): number {
  let valor = 2166136261;
  for (const caractere of texto) {
    valor ^= caractere.codePointAt(0)!;
    valor = Math.imul(valor, 16777619);
  }
  return valor >>> 0;
}

function embaralhar<T>(itens: T[], semente: string): T[] {
  const resultado = [...itens];
  let estado = hash(semente) || 1;
  for (let i = resultado.length - 1; i > 0; i--) {
    estado ^= estado << 13;
    estado ^= estado >>> 17;
    estado ^= estado << 5;
    const j = (estado >>> 0) % (i + 1);
    [resultado[i], resultado[j]] = [resultado[j]!, resultado[i]!];
  }
  return resultado;
}

/** Atribui um arquivo único por rota, de modo reproduzível para o commit de origem. */
export function atribuirMascotes(rotas: string[], arquivos: string[], commit: string): Map<string, string> {
  if (new Set(rotas).size !== rotas.length) throw new Error('rotas repetidas ao atribuir mascotes');
  if (arquivos.length === 0) throw new Error('nenhum mascote disponível');
  const saida = new Map<string, string>();
  for (let i = 0; i < rotas.length; i++) {
    const ciclo = Math.floor(i / arquivos.length);
    const ordem = embaralhar(arquivos, `${commit}:${ciclo}`);
    saida.set(rotas[i]!, ordem[i % arquivos.length]!);
  }
  return saida;
}
