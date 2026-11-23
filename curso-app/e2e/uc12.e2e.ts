import { expect, test } from '@playwright/test';
import { carregarInventarioUc12 } from '../src/conteudo/uc12';

const inventario = carregarInventarioUc12();

test('os links do caso real abrem painéis empilhados e o retorno fecha a camada atual', async ({ page }) => {
  await page.goto('/m00/');
  await page.getByRole('link', { name: 'Caso real UC12' }).click();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);

  await page.getByRole('link', { name: 'Relatório da fase F' }).click();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);
  const onboarding = page.locator('dialog[data-drawer="onboarding"]');
  const conteudo = page.locator('#conteudo-onboarding');
  await expect(onboarding).toBeVisible();
  await expect(conteudo.locator('h1')).toHaveText('Relatório da fase F');
  await conteudo.locator('a[href$="/uc12/evidencias/F/cobertura/"]').click();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);
  await expect(conteudo.locator('h1')).toContainText('cobertura');

  const relacionados = conteudo.getByRole('navigation', { name: 'Módulos que citam este arquivo' });
  await expect(relacionados.getByRole('link', { name: /Módulo 12/ })).toBeVisible();
  await relacionados.getByRole('link', { name: /Módulo 12/ }).click();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);
  await expect(conteudo.locator('h1')).toContainText('Módulo 12');

  await page.locator('[data-voltar-onboarding]').click();
  await expect(conteudo.locator('h1')).toContainText('cobertura');
  await page.locator('[data-voltar-onboarding]').click();
  await expect(conteudo.locator('h1')).toHaveText('Relatório da fase F');
  await page.locator('[data-voltar-onboarding]').click();
  await expect(onboarding).toBeHidden();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);

  await page.getByRole('link', { name: 'Relatório da fase F' }).click();
  await conteudo.getByRole('link', { name: 'Estado atual' }).click();
  await expect(onboarding).toBeHidden();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);
});

test('cada arquivo publicado do inventário UC12 tem página estática', async ({ request }) => {
  for (const item of inventario) {
    const resposta = await request.get(item.rota);
    expect(resposta.status(), item.arquivo).toBe(200);
  }
});

test('o estado oferece links internos para relatório, evidência e documento', async ({ page }) => {
  await page.goto('/uc12/state/');
  for (const href of ['/uc12/relatorios/F/', '/uc12/evidencias/F/cobertura/', '/uc12/documento/']) {
    await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
  }
});
