// Site estático, sem integrações que acessem a rede (E7, seção 2; planos do M0 e do M1).
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { paginasDoCurso } from './src/conteudo/paginas.ts';
import { carregarInventarioUc12 } from './src/conteudo/uc12.ts';
import { htmlCruComoTexto } from './src/conteudo/htmlSeguro.ts';
import { satteri } from '@astrojs/markdown-satteri';
import { pluginDeConversao } from './src/conteudo/conversao.ts';
import { lerQuadroDeSiglas } from './src/conteudo/siglas.ts';
import { textos } from './src/textos.ts';

const pastaDoCurso = fileURLToPath(new URL('../celilac-backend/method/didatico/curso/', import.meta.url));
const paginas = paginasDoCurso(
  readdirSync(pastaDoCurso)
    .filter((nome) => nome.endsWith('.md'))
    .map((nome) => ({ nome, texto: readFileSync(pastaDoCurso + nome, 'utf8') })),
);
const siglas = lerQuadroDeSiglas(readFileSync(pastaDoCurso + 'README.md', 'utf8'));
const commit = process.env.ORIGEM_COMMIT?.trim();
const inventarioUc12 = carregarInventarioUc12();

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Estilos sempre em arquivo próprio: a política de segurança do servidor (nginx.conf)
    // aceita só recursos do próprio endereço e nenhum estilo embutido.
    inlineStylesheets: 'never',
  },
  // Scripts também sempre em arquivo próprio (a mesma política bloqueia script embutido).
  vite: { build: { assetsInlineLimit: 0 } },
  markdown: {
    // Prism marca os trechos por classe (sem style=""); cores em src/estilos/base.css (plano do M1, seção 4.3).
    syntaxHighlight: 'prism',
    // Sätteri, o processador padrão do Astro 7, com o passo de conversão do curso (plano do M1, seção 4).
    processor: satteri({
      hastPlugins: [
        htmlCruComoTexto,
        pluginDeConversao(
          {
            paginas,
            uc12Paginas: new Map(inventarioUc12.map((item) => [item.arquivo, item.rota])),
            commit: commit && /^[0-9a-f]{7,40}$/.test(commit) ? commit : undefined,
            repositorio: 'evertonfoz/dsc-tests',
            pastaDoProjeto: 'celilac-backend',
          },
          { rotuloDaTabela: textos.rotuloDaTabela, abreNoGithub: textos.abreNoGithub, siglas },
        ),
      ],
    }),
  },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
