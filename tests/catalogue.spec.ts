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

// CATALOGUE
test('trier le catalogue par prix croissant', async ({ authenticatedPage }) => {
    await authenticatedPage.getByLabel('Ordre du catalogue').selectOption('price-asc');

    const premiereCarte = authenticatedPage.locator('#catalogGrid article').first();
    await expect(premiereCarte.getByRole('heading', { level: 3 })).toHaveText(
    'Chaussettes Pair Programming'
    );
});

// CATALOGUE
test('parcourir le catalogue et ajouter deux Souris Click au panier', async ({ authenticatedPage }) => {

    const produit = 'Souris Click';
    const totalAttendu= '59,80 €';

    const souris = authenticatedPage.locator('#catalogGrid article')
                .filter({ has: authenticatedPage.getByRole('heading', { name: produit }) });
    await souris.getByRole('button', { name: 'Voir le produit' }).click();

    const dialogue = authenticatedPage.getByRole('dialog', { name: produit});
    await dialogue.getByLabel('Quantité').fill('2');
    await dialogue.getByRole('button', { name: 'Ajouter au panier' }).click();

    await authenticatedPage.getByRole('button', { name: /^Panier/ }).click();

    // L'assertion passe, mais elle vérifie une grosse zone au lieu d'exprimer précisément le besoin.
    const panier = authenticatedPage.locator('#cartView');
    await expect(panier.getByText(produit, { exact: true})).toHaveCount(2);
    await expect(panier).toContainText(`Total : ${totalAttendu}`);
});

// CATALOGUE
test('filtrer le catalogue par catégorie Bureau', async ({ authenticatedPage }) => {
    await authenticatedPage.getByRole('button', { name: 'Bureau', exact: true }).click();

    const produitsBureau = authenticatedPage.locator('#catalogGrid article');

    // Mauvaise valeur attendue volontaire : il y a 4 cartes Bureau dans le HTML réel.
    await expect.soft(produitsBureau).toHaveCount(4);

    // Cette vérification est quand même exécutée après l'échec soft.
    await expect(authenticatedPage.locator('#catalogCount')).toHaveText('4 produits');
    await expect(authenticatedPage.getByRole('heading', { name: 'Clavier Mechanical Test' })).toBeVisible();
});