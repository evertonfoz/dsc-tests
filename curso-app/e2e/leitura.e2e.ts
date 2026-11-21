// Critérios 1, 5 e 6 do M1 e a navegação (plano do M1, seção 11).
import { expect, test } from '@playwright/test';
import { gabaritos, paginas, percurso, tituloSimples } from './curso';

test('(1) o mapa lista os arquivos de leitura na ordem de `ordem`', async ({ page }) => {
  await page.goto('/mapa/');
  const ids = await page.locator('[data-mapa] > li').evaluateAll((lis) => lis.map((li) => li.getAttribute('data-id')));
  expect(ids).toEqual(percurso.map((a) => a.id));
});

test('(1) seguindo "próximo" a partir do m00 passa pelos arquivos na ordem, com um h1 cada', async ({ page }) => {
  test.setTimeout(120_000); // 18 páginas em sequência
  await page.goto('/m00/');
  const visitados: string[] = [];
  for (;;) {
    const id = new URL(page.url()).pathname.replaceAll('/', '');
    visitados.push(id);
    const esperado = percurso.find((a) => a.id === id)!;
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(tituloSimples(esperado.titulo));
    const proximo = page.locator('nav.sequencia a[rel="next"]');
    if ((await proximo.count()) === 0) break;
    await proximo.click();
  }
  expect(visitados).toEqual(percurso.map((a) => a.id));
});

test('todas as páginas respondem e todo link interno leva a uma página existente', async ({ page, request }) => {
  const internos = new Set<string>();
  for (const caminho of paginas) {
    const resposta = await page.goto(caminho);
    expect(resposta?.status(), caminho).toBe(200);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    for (const h of hrefs) internos.add(h.split('#')[0]!);
  }
  for (const h of internos) expect((await request.get(h)).status(), h).toBe(200);
});

test('(5) nenhum gabarito publicado', async ({ page, request }) => {
  for (const g of gabaritos) expect((await request.get(`/${g.id}/`)).status(), g.id).toBe(404);
  for (const caminho of paginas) {
    await page.goto(caminho);
    await expect(page.locator('h1'), caminho).not.toContainText(/gabarito/i);
    expect(await page.locator('a[href*="gabarito"]').count(), caminho).toBe(0);
  }
});

test('(6) avisos de honestidade visíveis no índice e no projeto final', async ({ page }) => {
  for (const caminho of ['/', '/projeto-final/']) {
    await page.goto(caminho);
    const avisos = page.locator('[data-avisos-de-honestidade]');
    await expect(avisos, caminho).toBeVisible();
    await expect(avisos).toContainText('"criar"');
    await expect(avisos).toContainText('esboços');
    await expect(avisos).toContainText('não testadas com turmas');
    await expect(avisos).toContainText('Docker');
  }
});

test('links para o GitHub apontam para o commit de origem e não são seguidos sozinhos', async ({ page }) => {
  await page.goto('/m02/');
  const commit = await page.locator('[data-origem-commit]').getAttribute('data-origem-commit');
  const externos = await page.locator('a.externo').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  expect(externos.length).toBeGreaterThan(0);
  for (const h of externos) expect(h).toMatch(new RegExp(`^https://github\\.com/evertonfoz/dsc-tests/blob/${commit}/celilac-backend/`));
});
