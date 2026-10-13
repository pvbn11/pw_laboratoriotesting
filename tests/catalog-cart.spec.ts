import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartDrawerPage } from '../pages/cart.page';

test.describe('Módulo de Catálogo y Carrito de Compras', () => {
  test('TC-CAT-01: Navegación y renderizado de productos destacados en Home', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(homePage.brandLogo).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Productos destacados' })).toBeVisible();

    // Validar que se muestren artículos de productos
    const productCount = await homePage.featuredProducts.count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('TC-CAT-03 & TC-CART-02: Incrementar unidades, añadir al carrito y validar total en drawer', async ({ page }) => {
    const productPage = new ProductDetailPage(page);
    const cartPage = new CartDrawerPage(page);

    // Navegar directamente al detalle del producto
    await productPage.goto('bandas-elasticas-de-resistencia');
    await expect(productPage.title).toHaveText('Bandas Elásticas de Resistencia');

    // Incrementar cantidad a 2 (+1 unidad)
    await productPage.increaseQuantity(1);

    // Añadir al carrito
    await productPage.addToCart();

    // Abrir drawer del carrito
    await cartPage.openCart();
    await expect(cartPage.drawer).toBeVisible();

    // Validar que el total calculado sea $700.00 (350.00 x 2)
    await expect(cartPage.totalText).toContainText('$700.00');

    // Botón de checkout disponible
    await expect(cartPage.checkoutBtn).toBeVisible();
  });
});
