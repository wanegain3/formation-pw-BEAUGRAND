import { test, expect } from '@playwright/test';
import { seConnecter } from './helpers/auth';

// AUTHENTIFICATION — scénario de base.
test('se connecter avec des identifiants valides', async ({ page }) => {
await seConnecter(page);
await expect(page.getByRole('heading', { name: 'Produits' })).toBeVisible();
await expect(page.getByRole('button', { name: 'Déconnexion' })).toBeVisible();
});

// AUTHENTIFICATION — cas d'erreur métier.
test('afficher une erreur avec des identifiants invalides', async ({ page }) => {
await page.goto('http://localhost:3000');
await page.getByLabel("Nom d'utilisateur").fill('stagiaire');
await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe');
await page.getByRole('button', { name: 'Connexion' }).click();
await expect(page.getByRole('alert')).toHaveText('Identifiants incorrects.');
});

// COMPTE — la récupération est simulée par l'application.
test('demander un lien de récupération de mot de passe', async ({ page }) => {
await page.goto('http://localhost:3000');

await page.getByRole('link', { name: 'Mot de passe oublié' }).click();
const dialogue = page.getByRole('dialog', { name: 'Récupérer votre accès' });

await dialogue.getByLabel('Adresse e-mail').fill('stagiaire@test.local');
await dialogue.getByRole('button', { name: 'Envoyer le lien' }).click();

await expect(dialogue.getByRole('status')).toHaveText('E-mail de récupération envoyé.');
});

// COMPTE — le formulaire simule la création et affiche une confirmation.
test('créer un compte avec un formulaire valide', async ({ page }) => {
await page.goto('http://localhost:3000');

await page.getByRole('link', { name: 'Créer un compte' }).click();
const dialogue = page.getByRole('dialog', { name: 'Créer un compte' });

await dialogue.getByLabel('Prénom').fill('Alex');
await dialogue.getByLabel('Adresse e-mail du compte').fill('alex@test.fr');
await dialogue.getByLabel('Créer un code secret').fill('playwright123');
await dialogue.getByRole('checkbox', { name: /J'accepte les conditions/ }).check();
await dialogue.getByRole('button', { name: 'Créer le compte' }).click();

await expect(dialogue.getByRole('status')).toHaveText('Compte créé. Vous pouvez maintenant vous connecter.');
});

