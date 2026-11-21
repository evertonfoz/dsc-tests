import { expect, test } from '@playwright/test';
import { dadosVazios } from '../src/dados/modelo';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('curso-app-m3-test-inicializado')) return;
    localStorage.clear();
    sessionStorage.setItem('curso-app-m3-test-inicializado', 'sim');
  });
});

test('tentativa não vazia registra e libera o gabarito ao lado da tentativa', async ({ page }) => {
  await page.goto('/m01/');
  const tentativa = page.getByLabel('Minha tentativa (a aplicação não avalia o texto)');
  await expect(tentativa).toBeVisible();
  await page.getByRole('button', { name: 'Registrar tentativa e liberar gabarito' }).click();
  await expect(page.locator('[data-mensagem-progresso]')).toContainText('Escreva alguma coisa');
  await tentativa.fill('Minha hipótese para o comportamento observado.');
  await page.getByRole('button', { name: 'Registrar tentativa e liberar gabarito' }).click();
  await expect(page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' })).toBeVisible();
  await page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' }).click();
  await expect(page.locator('[data-corpo-gabarito]')).toBeVisible();
  await expect(page.locator('[data-corpo-gabarito]')).toContainText('Minha hipótese para o comportamento observado.');
  await expect(page.locator('[data-progresso-pagina]')).toContainText('escrito originalmente para o professor');
});

test('abertura antecipada fica registrada como decisão pessoal', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/m02/');
  await page.getByRole('button', { name: 'Abrir gabarito antes da tentativa' }).click();
  await expect(page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' })).toBeVisible();
  await page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' }).click();
  await expect(page.locator('[data-corpo-gabarito]')).toContainText('aberto antecipadamente');
});

test('m04 e apoio D liberam a mesma página de gabarito compartilhado', async ({ page }) => {
  await page.goto('/m04/');
  await page.getByLabel('Minha tentativa (a aplicação não avalia o texto)').fill('Tentei a atividade do módulo.');
  await page.getByRole('button', { name: 'Registrar tentativa e liberar gabarito' }).click();
  await page.goto('/apoio-d/');
  await expect(page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Abrir o gabarito deste conteúdo' })).toHaveAttribute('href', '/m04-gabarito/');
});

test('declarações de leitura e checklist não são apresentadas como verificação', async ({ page }) => {
  await page.goto('/m01/');
  await page.getByRole('button', { name: 'Declarar que li este conteúdo' }).click();
  const checkbox = page.locator('input[aria-label^="Declarado por você:"]').first();
  if (await checkbox.count()) {
    await checkbox.check();
    await expect(checkbox.locator('..')).toContainText('declarado por você');
  }
  await expect(page.locator('[data-mensagem-progresso]')).toContainText('fica neste navegador');
  await page.goto('/mapa/');
  await expect(page.locator('[data-progresso-para="m01"]')).toHaveText('Leitura declarada por você');
  await expect(page.locator('svg [data-no="m01"]')).toHaveClass(/com-pendencias/);
});

test('importação inválida mantém intactos os dados atuais', async ({ page }) => {
  const inicial = dadosVazios('commit-de-teste');
  inicial.conteudos.m01 = { lido: { em: '2026-11-21T10:00:00Z' } };
  await page.addInitScript((json) => localStorage.setItem('curso-app.dados', json), JSON.stringify(inicial));
  await page.goto('/seus-dados/');
  await page.locator('[data-importar-arquivo]').setInputFiles({ name: 'invalido.json', mimeType: 'application/json', buffer: Buffer.from('{ruim') });
  await expect(page.locator('[data-mensagem-progresso]')).toContainText('Importação recusada');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('curso-app.dados'))).toBe(JSON.stringify(inicial));
});

test('importar tudo baixa uma cópia antes de substituir e mantém os dados após recarregar', async ({ page }) => {
  await page.goto('/seus-dados/');
  const importado = dadosVazios('commit-importado');
  importado.conteudos.m01 = { lido: { em: '2026-11-21T11:00:00Z' } };
  page.on('dialog', (dialog) => dialog.accept());
  const download = page.waitForEvent('download');
  await page.locator('[data-importar-arquivo]').setInputFiles({ name: 'curso.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(importado)) });
  const arquivoBackup = await download;
  expect(arquivoBackup.suggestedFilename()).toContain('backup-antes-de-importar');
  await expect.poll(() => page.evaluate(() => {
    const valor = localStorage.getItem('curso-app.dados');
    return valor ? JSON.parse(valor).meta?.commitConteudoCriacao : undefined;
  })).toBe('commit-importado');
  await page.goto('/m01/');
  await expect(page.getByRole('button', { name: 'Atualizar data de leitura declarada' })).toBeVisible();
});

