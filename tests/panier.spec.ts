import { test, expect } from '@playwright/test';
import { seConnecter } from './helpers/auth';

test.beforeEach(async ({ page }) => {
  await seConnecter(page);
});

// PANIER — ajout d'un produit du nouveau catalogue.
test('ajouter Sac Regression au panier', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter Sac Regression au panier' }).click();
  await page.getByRole('button', { name: 'Panier 1' }).click();

  const panier = page.locator('#cartView');
  await expect(panier.getByText('Sac Regression', { exact: true })).toBeVisible();
  await expect(panier).toContainText('Total : 39,90 €');
});

// PANIER — plusieurs produits et recalcul du total.
test('ajouter plusieurs produits et recalculer le total', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter Sac Regression au panier' }).click();
  await page.getByRole('button', { name: 'Ajouter Casquette Commit au panier' }).click();

  const boutonPanier = page.getByRole('button', { name: 'Panier 2' });
  await expect(boutonPanier).toBeVisible();
  await boutonPanier.click();

  const panier = page.locator('#cartView');
  await expect(panier.getByText('Sac Regression', { exact: true })).toBeVisible();
  await expect(panier.getByText('Casquette Commit', { exact: true })).toBeVisible();
  await expect(panier).toContainText('Total : 59,80 €');
});

// PANIER — ce test suppose explicitement l'état initial d'un panier neuf.
test('afficher un panier vide après suppression du dernier produit', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter Carnet Bug Report au panier' }).click();
  await page.getByRole('button', { name: 'Panier 1' }).click();
  await page.getByRole('button', { name: 'Supprimer' }).click();

  await expect(page.getByText('Votre panier est vide.', { exact: true })).toBeVisible();
  await expect(page.locator('#cartCount')).toHaveText('0');
  await expect(page.locator('#cartTotal')).toHaveText('0,00 €');
});

// PANIER — suppression ciblée sur la ligne du bon produit.
test('supprimer un produit et recalculer le total restant', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter Gourde Trace Viewer au panier' }).click();
  await page.getByRole('button', { name: 'Ajouter Lampe Night Run au panier' }).click();
  await page.getByRole('button', { name: 'Panier 2' }).click();

  const panier = page.locator('#cartView');
  const ligneGourde = panier.locator('.cart-row').filter({ hasText: 'Gourde Trace Viewer' });
  await ligneGourde.getByRole('button', { name: 'Supprimer' }).click();

  await expect(panier.getByText('Gourde Trace Viewer', { exact: true })).not.toBeVisible();
  await expect(panier.getByText('Lampe Night Run', { exact: true })).toBeVisible();
  await expect(panier).toContainText('Total : 22,50 €');
});