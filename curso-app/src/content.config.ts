// Coleções lidas dos Markdown do curso (fonte única: celilac-backend/method/didatico/curso/).
// O front matter NÃO é validado aqui: a validação fica em src/conteudo/validar.ts, que mostra
// todos os problemas de uma vez, com o arquivo e o campo (plano do M0, seção 4).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const PASTA_DO_CURSO = '../celilac-backend/method/didatico/curso';

const curso = defineCollection({
  loader: glob({
    base: PASTA_DO_CURSO,
    pattern: ['*.md', '!README.md'],
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
});

const indice = defineCollection({
  loader: glob({
    base: PASTA_DO_CURSO,
    pattern: 'README.md',
    generateId: () => 'README',
  }),
});

const uc12 = defineCollection({
  loader: glob({
    base: '../celilac-backend/docs',
    pattern: ['uc/uc12/**/*.md', 'planejamento/uc12-cadastrar-produto/uc-12.md'],
    generateId: ({ entry }) => entry,
  }),
});

export const collections = { curso, indice, uc12 };
