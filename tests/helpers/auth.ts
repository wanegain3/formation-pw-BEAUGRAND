import { Page } from '@playwright/test';

export async function seConnecter(page:Page){
  await page.goto('http://localhost:3000');
  await page.getByLabel("Nom d'utilisateur").fill('stagiaire');
  await page.getByLabel('Mot de passe').fill('playwright');
  await page.getByRole('button', { name: 'Connexion' }).click();
}