import { expect, test } from '@playwright/test';
import { carregarInventarioUc12 } from '../src/conteudo/uc12';

const inventario = carregarInventarioUc12();

test('do m00 chega ao estado, abre relatório e evidência e volta ao módulo relacionado', async ({ page }) => {
  await page.goto('/m00/');
  await page.getByRole('link', { name: 'Caso real UC12' }).click();
  await expect(page).toHaveURL(/\/uc12\/state\/$/);

  await page.getByRole('link', { name: 'Relatório da fase F' }).click();
  await expect(page).toHaveURL(/\/uc12\/relatorios\/F\/$/);
  await page.locator('a[href="/uc12/evidencias/F/cobertura/"]').click();
  await expect(page).toHaveURL(/\/uc12\/evidencias\/F\/cobertura\/$/);

  const relacionados = page.getByRole('navigation', { name: 'Módulos que citam este arquivo' });
  await expect(relacionados.getByRole('link', { name: /Módulo 12/ })).toBeVisible();
  await relacionados.getByRole('link', { name: /Módulo 12/ }).click();
  await expect(page).toHaveURL(/\/m12\/$/);
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
