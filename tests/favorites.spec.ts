import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { FavoritesPage } from '../pages/favorites.page';

test.describe('Módulo de Favoritos (Wishlist) - Laboratorio de Testing', () => {
  const email = 'pvalladaresbazalarqa@gmail.com';
  const password = 'Pablito2027$$';
  const testProduct = 'set-de-pesas-ajustables';

  test('TC-FAV-01 & TC-FAV-02: Agregar producto a favoritos y verificar persistencia en /whishlist', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductDetailPage(page);
    const favoritesPage = new FavoritesPage(page);

    // 1. Iniciar sesión para asociar favoritos a la cuenta del usuario
    await loginPage.goto();
    await loginPage.login(email, password);

    // 2. Navegar a un producto y agregarlo a favoritos
    await productPage.goto(testProduct);
    await expect(productPage.title).toBeVisible();

    // Si el botón de agregar a favoritos está visible, hacer clic
    if (await productPage.addToFavoritesBtn.isVisible()) {
      await productPage.addToFavorites();
    }

    // 3. Navegar a la página de favoritos
    await favoritesPage.goto();
    await expect(favoritesPage.heading).toBeVisible();

    // 4. Esperar a que termine de cargar y validar que aparezca al menos un producto favorito
    await expect(favoritesPage.totalAgregadosText).toBeVisible();
    await expect(favoritesPage.favoriteCards.first()).toBeVisible({ timeout: 10000 });
  });
});
