import { test, expect } from './fixtures';

// CATALOGUE — recherche sur les nouveaux produits.
test('rechercher Gourde Trace Viewer dans le catalogue', async ({ authenticatedPage }) => {
  await authenticatedPage.getByLabel('Rechercher un produit').fill('Gourde Trace Viewer');

  const produits = authenticatedPage.locator('#catalogGrid article');
  await expect(produits).toHaveCount(1);
  await expect(produits.getByRole('heading', { name: 'Gourde Trace Viewer' })).toBeVisible();
});

// CATALOGUE — état vide après une recherche sans résultat.
test('afficher aucun résultat pour une recherche inexistante', async ({ authenticatedPage }) => {
  await authenticatedPage.getByLabel('Rechercher un produit').fill('produit qui n existe pas');

  await expect(authenticatedPage.locator('#catalogGrid article')).toHaveCount(0);
  await expect(authenticatedPage.getByText('Aucun produit ne correspond à votre recherche.', { exact: true })).toBeVisible();
});

// CATALOGUE — tri du catalogue du produit le moins cher au plus cher.
test('trier le catalogue par prix croissant', async ({ authenticatedPage }) => {
  await authenticatedPage.getByLabel('Ordre du catalogue').selectOption('price-asc');

  const premierProduit = authenticatedPage.locator('#catalogGrid article').first().getByRole('heading', { level: 3 });
  await expect(premierProduit).toHaveText('Chaussettes Pair Programming');
});

// CATALOGUE - TEST À REFACTORER PENDANT LE CHAPITRE III
// Ce test passe, mais concentre volontairement plusieurs défauts réalistes :
// CSS, nth(), attente fixe, scénario long et assertion finale très globale.
test('parcourir le catalogue et ajouter deux Souris Click au panier', async ({ authenticatedPage }) => {
  
  const produit = 'Souris Click';
  const totalAttendu = '59,80 €';

  const souris = authenticatedPage.locator('#catalogGrid article').filter({ has: authenticatedPage.getByRole('heading', { name: produit }) }); 
  await souris.getByRole('button', { name: 'Voir le produit' }).click(); 

  const dialogue = authenticatedPage.getByRole('dialog', { name: produit });
  await dialogue.getByLabel('Quantité').fill('2');
  await dialogue.getByRole('button', { name: 'Ajouter au panier' }).click();
  await authenticatedPage.getByRole('button', { name: /^Panier/ }).click();

  const panier = authenticatedPage.locator('#cartView');
  await expect(panier.getByText(produit, { exact: true })).toHaveCount(2);
  await expect(panier).toContainText(`Total : ${totalAttendu}`);

});

// CATALOGUE - BUG VOLONTAIRE POUR LE CHAPITRE III
// Le catalogue contient réellement 4 produits Bureau, mais ce test en attend 3.
// expect.soft() permet de continuer les vérifications ; le test sera tout de même rouge à la fin.
test('filtrer le catalogue par catégorie Bureau', async ({ authenticatedPage }) => {

  await authenticatedPage.getByRole('button', { name: 'Bureau', exact: true }).click();

  const produitsBureau = authenticatedPage.locator('#catalogGrid article');

  // Mauvaise valeur attendue volontaire : il y a 4 cartes Bureau dans le HTML réel.
  await expect.soft(produitsBureau).toHaveCount(4);

  // Cette vérification est quand même exécutée après l'échec soft.
  await expect(authenticatedPage.locator('#catalogCount')).toHaveText('4 produits');
  await expect(authenticatedPage.getByRole('heading', { name: 'Clavier Mechanical Test' })).toBeVisible();
});
