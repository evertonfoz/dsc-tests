// Carrega o curso e valida o conteúdo. Se houver problema, a construção falha
// e nenhuma página (portanto nenhuma imagem) é gerada.
import { getCollection, type CollectionEntry } from 'astro:content';
import { validarConteudo } from './validar';
import type { FrontMatter } from './esquema';

export type EntradaDoCurso = CollectionEntry<'curso'> & { dados: FrontMatter };

let cache: Promise<Map<string, EntradaDoCurso>> | undefined;

async function carregar(): Promise<Map<string, EntradaDoCurso>> {
  const entradas = await getCollection('curso');
  const nomeDoArquivo = (e: CollectionEntry<'curso'>) => `${e.id}.md`;
  const erros = validarConteudo(entradas.map((e) => ({ arquivo: nomeDoArquivo(e), dados: e.data })));
  if (erros.length > 0) {
    throw new Error(`\n${erros.join('\n')}\n${erros.length} problema(s) no front matter do curso; a construção foi interrompida.`);
  }
  return new Map(entradas.map((e) => [(e.data as FrontMatter).id, { ...e, dados: e.data as FrontMatter }]));
}

/** Curso validado, indexado pelo id do front matter. */
export function cursoValidado(): Promise<Map<string, EntradaDoCurso>> {
  cache ??= carregar();
  return cache;
}
