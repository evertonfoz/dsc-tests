// Testes no navegador contra a IMAGEM construída, não contra o servidor de desenvolvimento (E7, seção 6).
// O contêiner é iniciado por scripts/testar-navegador.sh; aqui só se aponta para o endereço.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: process.env.URL_BASE ?? 'http://127.0.0.1:4321',
    colorScheme: 'light',
  },
  projects: [
    { name: 'computador', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'celular', use: { browserName: 'chromium', viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true } },
  ],
});
