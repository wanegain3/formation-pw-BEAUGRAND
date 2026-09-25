import { test, expect } from '@playwright/test';
import { seConnecter } from './helpers/auth';

test.beforeEach(async ({ page }) => {
  await seConnecter(page);
});

// PROFIL — ouverture du menu utilisateur.
test('ouvrir le menu utilisateur après connexion', async ({ page }) => {
  const boutonCompte = page.getByRole('button', { name: 'Ouvrir le menu du compte' });
  await expect(boutonCompte).toHaveText('ST');
  await boutonCompte.click();
  
  await expect(page.getByRole('button', { name: 'Mon profil' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mes commandes' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Préférences' })).toBeVisible();
});

// PROFIL — vérification des informations affichées.
test('afficher les informations du profil', async ({ page }) => {
  await page.getByRole('button', { name: 'Ouvrir le menu du compte' }).click();
  await page.getByRole('button', { name: 'Mon profil' }).click();
  
  const dialogue = page.getByRole('dialog', { name: 'Mon profil' });
  await expect(dialogue).toContainText('Stagiaire Playwright');
  await expect(dialogue).toContainText('stagiaire@test.local');
  await expect(dialogue).toContainText('client testeur depuis 2026');
});

// PROFIL — cette persistance locale servira à parler de localStorage et d'isolation.
test('enregistrer et retrouver les préférences utilisateur', async ({ page }) => {
  await page.getByRole('button', { name: 'Ouvrir le menu du compte' }).click();
  await page.getByRole('button', { name: 'Préférences' }).click();

  let dialogue = page.getByRole('dialog', { name: 'Préférences' });
  await dialogue.getByRole('checkbox', { name: 'Recevoir les nouveautés par e-mail' }).check();
  await dialogue.getByRole('checkbox', { name: "Utiliser l'affichage compact du catalogue" }).check();
  await dialogue.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(dialogue.getByRole('status')).toHaveText('Préférences enregistrées.');

  // On ferme puis on rouvre le dialogue pour vérifier que l'état a été conservé.
  await dialogue.getByRole('button', { name: 'Fermer' }).click();
  await page.getByRole('button', { name: 'Ouvrir le menu du compte' }).click();
  await page.getByRole('button', { name: 'Préférences' }).click();

  dialogue = page.getByRole('dialog', { name: 'Préférences' });
  await expect(dialogue.getByRole('checkbox', { name: 'Recevoir les nouveautés par e-mail' })).toBeChecked();
  await expect(dialogue.getByRole('checkbox', { name: "Utiliser l'affichage compact du catalogue" })).toBeChecked();
});

test('afficher des commandes simulées', async ({ page }) => {

  await page.route('**/api/orders.json', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          reference: 'CMD-TEST-001',
          date: '24/09/2026',
          status: 'Expédiée',
          total: '42,00 €'
        }
      ])
    });
    // await route.continue();              // continuer normalement
    // await route.fulfill({ status: 500 }) // erreur 500
    // await route.abort()                  // panne réseau
  });

  await page.getByRole('button', {
    name: 'Ouvrir le menu du compte'
  }).click();

  await page.getByRole('button', {
    name: 'Mes commandes'
  }).click();

  await expect(
    page.getByText('CMD-TEST-001')
  ).toBeVisible();

});