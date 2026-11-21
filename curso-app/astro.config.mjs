// Site estático, sem integrações que acessem a rede (E7, seção 2; plano do M0).
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Estilos sempre em arquivo próprio: a política de segurança do servidor (nginx.conf)
    // aceita só recursos do próprio endereço e nenhum estilo embutido.
    inlineStylesheets: 'never',
  },
  // Realce de código desligado no M0: o Shiki grava cores em atributos style="", que a mesma
  // política bloqueia. Reavaliar no M1 (por exemplo, realce por classes CSS).
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
