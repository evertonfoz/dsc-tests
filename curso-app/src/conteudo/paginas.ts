// Mapa "nome do arquivo do curso → rota da página", usado na conversão das referências.
// Função pura: quem lê o disco é astro.config.mjs. O front matter completo é validado depois,
// na construção das páginas (carregar.ts); aqui só se leem `id` e `tipo`.

export function paginasDoCurso(arquivos: Array<{ nome: string; texto: string }>): Map<string, string> {
  const paginas = new Map<string, string>();
  for (const { nome, texto } of arquivos) {
    if (nome === 'README.md') {
      paginas.set(nome, '/');
      continue;
    }
    const frontMatter = texto.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const id = frontMatter.match(/^id:\s*['"]?([a-z0-9-]+)['"]?\s*$/m)?.[1];
    const tipo = frontMatter.match(/^tipo:\s*['"]?([a-z]+)['"]?\s*$/m)?.[1];
    // Gabaritos não viram página antes do M3 (liberação depois da tentativa).
    if (id && tipo && tipo !== 'gabarito') paginas.set(nome, `/${id}/`);
  }
  return paginas;
}
