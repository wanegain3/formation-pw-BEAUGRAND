import { test, expect } from '@playwright/test';
import { seConnecter } from './helpers/auth';

test.beforeEach(async ({ page }) => {
  await seConnecter(page);
});

// LIVRAISON - test paramétré. Génère "calculer le total avec Standard" et "calculer le total avec Express"
const livraisons = [
  { mode: 'Standard', total: '12,90 €' },
  { mode: 'Express', total: '17,80 €' }
];
for (const livraison of livraisons) {
  test(`calculer le total avec ${livraison.mode}`, async ({ page }) => {
    await page.getByRole('button',{ name: 'Ajouter Chaussettes Pair Programming au panier' }).click();
    await page.getByRole('button', { name: 'Panier 1' }).click();
    await page.getByRole('radio',{ name: new RegExp(livraison.mode) }).check();
    await expect(page.locator('#cartView')).toContainText(`Total : ${livraison.total}`);
  });
}

// COMMANDE — utilisation du code promo réellement prévu par la boutique.
test('appliquer le code promo TEST10 au panier', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter Gourde Trace Viewer au panier' }).click();
  await page.getByRole('button', { name: 'Panier 1' }).click();

  await page.getByLabel('Code promo').fill('TEST10');
  await page.getByRole('button', { name: 'Appliquer' }).click();

  await expect(page.locator('#promoStatus')).toContainText('Code TEST10 appliqué : -10 %.');
  await expect(page.locator('#cartView')).toContainText('Total : 16,11 €');
});

// COMMANDE — parcours complet de checkout simulé.
test('valider une commande avec une adresse complète', async ({ page }) => {
  await test.step('Ajouter un produit', async () => {   
    await page.getByRole('button', { name: 'Ajouter Carnet Bug Report au panier' }).click();
    await page.getByRole('button', { name: 'Panier 1' }).click();
    await page.getByRole('button', { name: 'Passer la commande' }).click();
  }); 

  await test.step('Finaliser la commande', async () => {   
    const dialogue = page.getByRole('dialog', { name: 'Finaliser la commande' });
    await dialogue.getByLabel('Nom du destinataire').fill('Stagiaire Playwright');
    await dialogue.getByLabel('Adresse de livraison').fill('12 rue des Tests');
    await dialogue.getByLabel('Ville').fill('Valence');
    await dialogue.getByRole('button', { name: 'Confirmer la commande' }).click();
  }); 

  await expect(page.getByText('Commande validée. Merci !', { exact: true })).toBeVisible();
  await expect(page.locator('#cartTotal')).toHaveText('0,00 €');
});