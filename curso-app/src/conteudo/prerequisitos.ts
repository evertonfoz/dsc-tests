// Compara a linha "Pré-requisito" do corpo com o front matter (plano do M1, seção 9).
// Função pura: recebe o corpo do Markdown e o front matter já validado.
import type { FrontMatterPercurso } from './esquema';

const APOIOS: Record<string, string> = { A: 'apoio-a', B: 'apoio-b', C: 'apoio-c', D: 'apoio-d' };

/** Linha "> **Pré-requisito:** ..." do corpo, se houver (só a primeira). */
export function linhaDePrerequisito(corpo: string): string | undefined {
  return corpo.split(/\r?\n/).find((l) => /^>\s*\*\*Pré-requisito:\*\*/.test(l));
}

/** ids citados em prosa: "módulos 4 a 7", "módulos 4, 7, 8 e 9", "apoios A e B". Ignora parênteses e crases. */
export function idsCitados(linha: string): Set<string> {
  const ids = new Set<string>();
  const texto = linha.replace(/`[^`]*`/g, ' ').replace(/\([^)]*\)/g, ' ');
  for (const m of texto.matchAll(/módulos?\s+(\d+(?:\s*(?:,|e|a)\s*\d+)*)/g)) {
    const parte = m[1]!;
    const faixa = parte.match(/^(\d+)\s*a\s*(\d+)$/);
    const numeros: number[] = [];
    if (faixa) for (let i = Number(faixa[1]); i <= Number(faixa[2]); i++) numeros.push(i);
    else for (const n of parte.match(/\d+/g) ?? []) numeros.push(Number(n));
    for (const n of numeros) ids.add(`m${String(n).padStart(2, '0')}`);
  }
  for (const m of texto.matchAll(/apoios?\s+([A-D](?:\s*(?:,|e)\s*[A-D])*)\b/g)) {
    for (const letra of m[1]!.match(/[A-D]/g) ?? []) ids.add(APOIOS[letra]!);
  }
  return ids;
}

/**
 * Regra: os ids citados contêm todos os `prerequisitos` e nada fora de
 * `prerequisitos` ∪ `prerequisitos_se_precisar`; a linha é opcional;
 * se a linha tiver "Duração sugerida", ela contém o valor de `duracao`.
 */
export function compararPrerequisito(arquivo: string, corpo: string, dados: FrontMatterPercurso): string[] {
  const erros: string[] = [];
  const msg = (motivo: string) => `conteúdo inválido: ${arquivo}: linha "Pré-requisito": ${motivo}`;
  const linha = linhaDePrerequisito(corpo);
  if (!linha) return erros;
  const citados = idsCitados(linha);
  const permitidos = new Set([...dados.prerequisitos, ...(dados.prerequisitos_se_precisar ?? [])]);
  for (const id of dados.prerequisitos) {
    if (!citados.has(id)) erros.push(msg(`não cita "${id}", que está em prerequisitos`));
  }
  for (const id of citados) {
    if (!permitidos.has(id)) erros.push(msg(`cita "${id}", que não está em prerequisitos nem em prerequisitos_se_precisar`));
  }
  if (/Duração sugerida/.test(linha) && !linha.includes(dados.duracao)) {
    erros.push(msg(`a duração sugerida não contém "${dados.duracao}" (campo duracao)`));
  }
  return erros;
}
