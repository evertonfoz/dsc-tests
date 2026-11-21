// Critérios 4 e 7 do M1 e a largura de celular (plano do M1, seção 11).
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { paginas } from './curso';

for (const caminho of paginas) {
  test(`(4) ${caminho}: nenhuma requisição a outro endereço e nenhuma violação da política de segurança`, async ({ page, baseURL }) => {
    const origem = new URL(baseURL!).origin;
    const fora: string[] = [];
    const violacoes: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).origin !== origem) fora.push(r.url());
    });
    page.on('console', (m) => {
      if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) violacoes.push(m.text());
    });
    await page.goto(caminho, { waitUntil: 'networkidle' });
    expect(fora).toEqual([]);
    expect(violacoes).toEqual([]);
  });

  test(`(7) ${caminho}: axe-core sem violação de nível A ou AA`, async ({ page }) => {
    await page.goto(caminho);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const resumo = r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} nó(s), ex.: ${v.nodes[0]?.target.join(' ')}`);
    expect(resumo).toEqual([]);
  });

  test(`celular: ${caminho} não rola na horizontal a 320 pixels`, async ({ page }, info) => {
    test.skip(info.project.name !== 'celular', 'só na largura de celular');
    await page.goto(caminho);
    // Compara com a largura configurada, não com innerWidth: no celular, conteúdo largo demais faz o
    // navegador alargar a janela de layout, e innerWidth cresce junto (o teste passaria sem dever).
    const largura = page.viewportSize()!.width;
    const medidas = await page.evaluate(() => ({ conteudo: document.documentElement.scrollWidth, janela: window.innerWidth }));
    expect(medidas.janela).toBe(largura);
    expect(medidas.conteudo).toBeLessThanOrEqual(largura);
  });
}
