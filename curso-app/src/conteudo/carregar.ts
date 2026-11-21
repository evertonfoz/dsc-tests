// Carrega o curso e valida o conteúdo. Se houver problema, a construção falha
// e nenhuma página (portanto nenhuma imagem) é gerada.
import { getCollection, type CollectionEntry } from 'astro:content';
import { validarConteudo } from './validar';
import { compararPrerequisito } from './prerequisitos';
import { compararTitulo } from './titulo';
import type { FrontMatter, FrontMatterPercurso } from './esquema';

export type EntradaDoCurso = CollectionEntry<'curso'> & { dados: FrontMatter };
export type EntradaDePercurso = CollectionEntry<'curso'> & { dados: FrontMatterPercurso };

let cache: Promise<Map<string, EntradaDoCurso>> | undefined;

async function carregar(): Promise<Map<string, EntradaDoCurso>> {
  const entradas = await getCollection('curso');
  const nomeDoArquivo = (e: CollectionEntry<'curso'>) => `${e.id}.md`;
  const erros = validarConteudo(entradas.map((e) => ({ arquivo: nomeDoArquivo(e), dados: e.data })));
  if (erros.length === 0) {
    for (const e of entradas) {
      const d = e.data as FrontMatter;
      // Título do front matter × h1 do corpo (o h1 é retirado da página para não repetir).
      erros.push(...compararTitulo(nomeDoArquivo(e), e.body ?? '', d.titulo));
      // Linha "Pré-requisito" do corpo × front matter (plano do M1, seção 9).
      if (d.tipo === 'gabarito' || d.tipo === 'pratica') continue;
      erros.push(...compararPrerequisito(nomeDoArquivo(e), e.body ?? '', d));
    }
  }
  if (erros.length > 0) {
    throw new Error(`\n${erros.join('\n')}\n${erros.length} problema(s) no conteúdo do curso; a construção foi interrompida.`);
  }
  return new Map(entradas.map((e) => [(e.data as FrontMatter).id, { ...e, dados: e.data as FrontMatter }]));
}

/** Curso validado, indexado pelo id do front matter. */
export function cursoValidado(): Promise<Map<string, EntradaDoCurso>> {
  cache ??= carregar();
  return cache;
}

/** Módulos, apoios e projeto, na ordem de `ordem`. */
export async function percurso(): Promise<EntradaDePercurso[]> {
  const curso = await cursoValidado();
  return [...curso.values()]
    .filter((e): e is EntradaDePercurso => e.dados.tipo !== 'gabarito' && e.dados.tipo !== 'pratica')
    .sort((a, b) => a.dados.ordem - b.dados.ordem);
}
