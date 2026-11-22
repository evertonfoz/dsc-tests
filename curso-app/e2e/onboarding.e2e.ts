import { expect, test } from '@playwright/test';
import { paginas, paginasUc12 } from './curso';

test('práticas e README abrem no onboarding sem mudar a página em todos os conteúdos do curso', async ({ page }) => {
  test.setTimeout(120_000);
  const onboarding = page.locator('#drawer-onboarding');
  const conteudo = page.locator('#conteudo-onboarding');

  for (const rota of paginas) {
    await page.goto(rota);
    const links = page.locator('main a[data-onboarding-href]');
    const quantidade = await links.count();
    for (let indice = 0; indice < quantidade; indice += 1) {
      const rotaDeOrigem = page.url();
      const link = links.nth(indice);
      const destino = await link.getAttribute('data-onboarding-href');
      await link.click();
      await expect(page).toHaveURL(rotaDeOrigem);
      await expect(onboarding).toBeVisible();
      await expect(conteudo).toHaveAttribute('aria-busy', 'false');
      await expect(conteudo.locator('h1')).toHaveCount(1);
      expect(destino).toBeTruthy();
      await page.locator('#drawer-onboarding [data-fechar-drawer]').click();
      await expect(onboarding).toBeHidden();
    }
  }
});

test('todos os links das páginas do UC12 permanecem no onboarding sem navegar a página', async ({ page }) => {
  test.setTimeout(180_000);
  const onboarding = page.locator('#drawer-onboarding');
  const conteudo = page.locator('#conteudo-onboarding');

  for (const rota of paginasUc12) {
    await page.goto(rota);
    const links = page.locator('main a[href]');
    const quantidade = await links.count();
    for (let indice = 0; indice < quantidade; indice += 1) {
      const rotaDeOrigem = page.url();
      await links.nth(indice).click();
      await expect(page).toHaveURL(rotaDeOrigem);
      await expect(onboarding).toBeVisible();
      await expect(conteudo).toHaveAttribute('aria-busy', 'false');
      expect(await conteudo.textContent()).not.toBe('');
      await page.locator('#drawer-onboarding [data-fechar-drawer]').click();
      await expect(onboarding).toBeHidden();
    }
  }
});

test('retorno externo fecha a camada atual e links externos nunca navegam a página', async ({ page }) => {
  await page.goto('/m00/');
  const rotaDeOrigem = page.url();
  await page.locator('a[data-onboarding-href="/m00-pratica/"]').click();
  const onboarding = page.locator('#drawer-onboarding');
  const conteudo = page.locator('#conteudo-onboarding');
  await expect(conteudo.locator('h1')).toHaveText('Prática do módulo 0');

  await conteudo.locator('a.externo').first().click();
  await expect(page).toHaveURL(rotaDeOrigem);
  await expect(conteudo).toContainText('não pode ser exibido dentro do onboarding');
  await page.locator('[data-voltar-onboarding]').click();
  await expect(conteudo.locator('h1')).toHaveText('Prática do módulo 0');

  await conteudo.getByRole('link', { name: /Voltar a:/ }).click();
  await expect(onboarding).toBeHidden();
  await expect(page).toHaveURL(/\/m00\/$/);
});
