// Critérios 4 e 7 do M1 e a largura de celular (plano do M1, seção 11).
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { paginasPublicadas } from './curso';

for (const caminho of paginasPublicadas) {
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

test('a área de conteúdo ocupa 90% da viewport sem rolagem horizontal', async ({ page }) => {
  for (const largura of [320, 768, 1280, 1920]) {
    await page.setViewportSize({ width: largura, height: 900 });
    await page.goto('/uc12/state/');
    const medidas = await page.evaluate(() => {
      const corpo = document.body.getBoundingClientRect();
      return {
        viewport: document.documentElement.clientWidth,
        pagina: document.documentElement.scrollWidth,
        larguraCorpo: corpo.width,
      };
    });
    expect(medidas.larguraCorpo, `${largura}px`).toBeCloseTo(largura * 0.9, 0);
    expect(medidas.pagina, `${largura}px`).toBeLessThanOrEqual(medidas.viewport);
  }
});

test('tabelas e código extensos rolam dentro do próprio bloco a 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const [caminho, seletor] of [['/m02-pratica/', '.tabela'], ['/uc12/state/', 'pre']]) {
    await page.goto(caminho);
    const bloco = page.locator(seletor).first();
    await expect(bloco, `${caminho} ${seletor}`).toBeVisible();
    const medidas = await bloco.evaluate((el) => ({
      overflowX: getComputedStyle(el).overflowX,
      larguraVisivel: el.clientWidth,
      larguraDoConteudo: el.scrollWidth,
    }));
    expect(medidas.overflowX).toBe('auto');
    expect(medidas.larguraDoConteudo).toBeGreaterThan(medidas.larguraVisivel);
  }
  const pagina = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(pagina).toBeLessThanOrEqual(320);
});

test('referências do GitHub abrem em nova guia e as internas permanecem na atual', async ({ page, context }) => {
  await page.goto('/m02/');
  const externo = page.locator('a.externo').first();
  await expect(externo).toHaveAttribute('target', '_blank');
  await expect(externo).toHaveAttribute('rel', /noopener/);
  await expect(externo).toHaveAttribute('rel', /noreferrer/);
  await expect(externo).toContainText('abre em nova guia no GitHub');
  const hrefExterno = await externo.getAttribute('href');
  await context.route('https://github.com/**', (route) => route.fulfill({ status: 200, body: 'GitHub interceptado pelo teste' }));
  const popupPromise = page.waitForEvent('popup');
  await externo.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(hrefExterno!);
  await expect(page).toHaveURL(/\/m02\/$/);

  const interno = page.locator('a.ref[href^="/"]').first();
  const hrefInterno = await interno.getAttribute('href');
  const guiasAntes = context.pages().length;
  await interno.click();
  await expect(page).toHaveURL(new RegExp(`${hrefInterno!.replaceAll('/', '\\/')}$`));
  expect(context.pages()).toHaveLength(guiasAntes);
});
