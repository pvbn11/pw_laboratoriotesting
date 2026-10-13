import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { CartDrawerPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('Módulo de Checkout y Procesamiento de Pagos', () => {
  const email = 'pvalladaresbazalarqa@gmail.com';
  const password = 'Pablito2027$$';

  test.beforeEach(async ({ page }) => {
    // Preparar estado: Iniciar sesión y agregar producto al carrito para tener checkout válido
    const loginPage = new LoginPage(page);
    const productPage = new ProductDetailPage(page);
    const cartPage = new CartDrawerPage(page);

    await loginPage.goto();
    await loginPage.login(email, password);

    await productPage.goto('bandas-elasticas-de-resistencia');
    await productPage.addToCart();

    await cartPage.openCart();
    await cartPage.proceedToCheckout();
  });

  test('TC-CHK-02: Botón Completar Pago inicialmente deshabilitado y habilitado tras completar datos', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(page).toHaveTitle(/Checkout/);
    await expect(checkoutPage.completePaymentButton).toBeDisabled();

    // Llenar información del comprador
    await checkoutPage.fillBuyerInfo({
      name: 'Paolo',
      lastname: 'Valladares',
      email: email,
      address: 'Av. Las Palmeras 123',
      country: 'Colombia',
    });

    // Llenar información de pago
    await checkoutPage.fillPaymentInfo({
      nameHolder: 'Paolo Valladares',
      cardNumber: '4532015112830366',
      expiryDate: '2028-12',
      securityCode: '123',
    });

    // El botón debe habilitarse
    await expect(checkoutPage.completePaymentButton).toBeEnabled();
  });

  test('TC-CHK-03: Manejo de rechazo de pago por tarjeta inválida (Error 400)', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillBuyerInfo({
      name: 'Paolo',
      lastname: 'Valladares',
      email: email,
      address: 'Av. Las Palmeras 123',
      country: 'Colombia',
    });

    await checkoutPage.fillPaymentInfo({
      nameHolder: 'Paolo Valladares',
      cardNumber: '4532015112830366',
      expiryDate: '2028-12',
      securityCode: '123',
    });

    await checkoutPage.submitPayment();

    // Esperar a que aparezca el modal de error por rechazo de backend
    await expect(checkoutPage.swalModal).toBeVisible();
    await expect(checkoutPage.swalTitle).toHaveText('Error al procesar el pago');
    await expect(checkoutPage.swalRetryButton).toBeVisible();
  });

  test('TC-CHK-04: Flujo E2E de compra exitosa con interceptación de red determinista', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Mockeamos la respuesta de la orden para simular aprobación exitosa del pago
    await checkoutPage.mockOrderSuccess();

    await checkoutPage.fillBuyerInfo({
      name: 'Paolo',
      lastname: 'Valladares',
      email: email,
      address: 'Av. Las Palmeras 123',
      country: 'Colombia',
    });

    await checkoutPage.fillPaymentInfo({
      nameHolder: 'Paolo Valladares',
      cardNumber: '4532015112830366',
      expiryDate: '2028-12',
      securityCode: '123',
    });

    await checkoutPage.submitPayment();

    // Validar modal de orden creada con éxito
    await expect(checkoutPage.swalModal).toBeVisible();
    await expect(checkoutPage.swalTitle).toHaveText('Orden creada');
    await expect(checkoutPage.swalGoToAccountButton).toBeVisible();

    // Clic en "Ir a mi cuenta" y validar redirección
    await checkoutPage.swalGoToAccountButton.click();
    await page.waitForURL('**/my-account');
    await expect(page).toHaveTitle(/My Account/);
  });
});
