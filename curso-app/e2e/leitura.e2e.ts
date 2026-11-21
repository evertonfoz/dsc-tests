// Critérios 1, 5 e 6 do M1 e a navegação (plano do M1, seção 11).
import { expect, test } from '@playwright/test';
import { gabaritos, paginas, percurso, siglas, tituloSimples } from './curso';

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

test('(2) cada ocorrência de sigla tem definição e a primeira por seção entra na ordem do Tab', async ({ page }) => {
  const paginasPorSigla = new Map<string, string>();
  for (const caminho of paginas) {
    await page.goto(caminho);
    const ordemTab = await page.evaluate(() => {
      const vistos = new Set<string>();
      const problemas: string[] = [];
      for (const el of document.querySelectorAll('h2, abbr.sigla')) {
        if (el.tagName === 'H2') { vistos.clear(); continue; }
        const item = el as HTMLElement;
        const sigla = item.dataset.sigla!;
        const esperado = vistos.has(sigla) ? '-1' : '0';
        if (item.getAttribute('tabindex') !== esperado) problemas.push(`${sigla}: esperado ${esperado}, recebeu ${item.getAttribute('tabindex')}`);
        vistos.add(sigla);
      }
      return problemas;
    });
    expect(ordemTab, caminho).toEqual([]);
    const marcadas = await page.locator('abbr.sigla').evaluateAll((itens) => itens.map((el) => ({
      sigla: el.getAttribute('data-sigla')!,
      texto: el.textContent!,
      aria: el.getAttribute('aria-label')!,
      definicao: el.getAttribute('data-definicao')!,
      tabindex: el.getAttribute('tabindex'),
    })));
    for (const item of marcadas) {
      expect(siglas.get(item.sigla), item.sigla).toBe(item.definicao);
      expect(item.aria).toBe(`${item.texto}: ${item.definicao}`);
      if (!paginasPorSigla.has(item.sigla)) paginasPorSigla.set(item.sigla, caminho);
      // As demais ocorrências da sigla na seção não criam paradas extras de teclado.
      expect(['0', '-1']).toContain(item.tabindex);
    }
  }
  expect([...paginasPorSigla.keys()].sort()).toEqual([...siglas.keys()].sort());

  for (const [sigla, caminho] of paginasPorSigla) {
    await page.goto(caminho);
    const alvo = page.locator(`abbr.sigla[data-sigla="${sigla}"][tabindex="0"]`).first();
    await expect(alvo).toHaveCount(1);
    let focou = false;
    for (let i = 0; i < 180; i++) {
      await page.keyboard.press('Tab');
      if (await alvo.evaluate((el) => el === document.activeElement)) { focou = true; break; }
    }
    expect(focou, `${sigla} recebeu foco pela navegação de Tab`).toBe(true);
    await expect(alvo).toBeFocused();
    await page.keyboard.press('Escape');
    const display = await alvo.evaluate((el) => getComputedStyle(el, '::after').display);
    expect(display).toBe('none');
  }
});

test('(2) tocar numa sigla abre a definição e tocar fora fecha', async ({ page }, info) => {
  test.skip(info.project.name !== 'celular', 'abre e fecha por toque no projeto celular');
  await page.goto('/m00/');
  const alvo = page.locator('abbr.sigla[data-sigla="IA"]').first();
  await expect(alvo).toHaveCount(1);
  await alvo.tap();
  await expect(alvo).toHaveAttribute('data-aberta', 'true');
  await page.locator('h1').tap();
  await expect(alvo).not.toHaveAttribute('data-aberta', 'true');
});

test('(3) as arestas do grafo correspondem ao front matter, incluindo as condicionais', async ({ page }) => {
  await page.goto('/mapa/');
  const arestas = await page.locator('svg[data-grafo] [data-aresta]').evaluateAll((itens) => itens.map((el) => ({
    tipo: el.getAttribute('data-aresta'),
    de: el.getAttribute('data-de'),
    para: el.getAttribute('data-para'),
  })).sort((a, b) => `${a.para}:${a.tipo}:${a.de}`.localeCompare(`${b.para}:${b.tipo}:${b.de}`)));
  const esperado = percurso.flatMap((item) => [
    ...item.prerequisitos.map((de) => ({ tipo: 'obrigatoria', de, para: item.id })),
    ...item.prerequisitosSePrecisar.map((de) => ({ tipo: 'condicional', de, para: item.id })),
  ]).sort((a, b) => `${a.para}:${a.tipo}:${a.de}`.localeCompare(`${b.para}:${b.tipo}:${b.de}`));
  expect(arestas).toEqual(esperado);
  await expect(page.locator('.legenda-grafo')).toContainText('Linha contínua');
  await expect(page.locator('.legenda-grafo')).toContainText('Linha tracejada');
  await expect(page.locator('svg[data-grafo]')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('svg[data-grafo] a[data-no]')).toHaveCount(percurso.length);
  for (const item of percurso) {
    const no = page.locator(`svg[data-grafo] a[data-no="${item.id}"]`);
    await expect(no).toHaveAttribute('tabindex', '-1');
    const rotulo = await no.locator('text tspan').allTextContents();
    expect(rotulo.join(' ').replace(/\s+/g, ' ').trim(), item.id).toBe(tituloSimples(item.titulo).replace(/\s+/g, ' ').trim());
    await expect(no.locator('title')).toHaveText(tituloSimples(item.titulo));
  }
});

test('(7) mascotes são decorativos, respondem e não se repetem entre as páginas', async ({ page, request }) => {
  const usados: string[] = [];
  for (const caminho of paginas) {
    await page.goto(caminho);
    const imagem = page.locator('img.mascote');
    await expect(imagem, caminho).toHaveCount(1);
    await expect(imagem).toHaveAttribute('alt', '');
    const src = await imagem.getAttribute('src');
    expect(src).toMatch(/^\/mascotes\/mascote_\d{3}\.png$/);
    expect((await request.get(src!)).status(), src!).toBe(200);
    usados.push(src!);
  }
  expect(new Set(usados).size).toBe(usados.length);
});
