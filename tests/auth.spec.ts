import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

test.describe('Módulo de Autenticación - Laboratorio de Testing', () => {
  const validEmail = 'pvalladaresbazalarqa@gmail.com';
  const validPassword = 'Pablito2027$$';

  test('TC-AUTH-01: Login exitoso con credenciales válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await expect(page).toHaveTitle(/Login/);

    await loginPage.login(validEmail, validPassword);

    // Verificación post-login
    await expect(homePage.navInicio).toBeVisible();
    await expect(homePage.navFavoritos).toBeVisible();
    await expect(homePage.navMiCuenta).toBeVisible();
    await expect(homePage.navCerrarSesion).toBeVisible();
  });

  test('TC-AUTH-02: Botón de inicio de sesión deshabilitado con campos incompletos', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // 1. Inicialmente deshabilitado cuando ambos campos están vacíos
    await expect(loginPage.loginButton).toBeDisabled();

    // 2. Solo con email ingresado continúa deshabilitado
    await loginPage.fillEmail(validEmail);
    await expect(loginPage.loginButton).toBeDisabled();

    // 3. Al completar la contraseña, el botón pasa a estar habilitado
    await loginPage.fillPassword(validPassword);
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('TC-AUTH-04: Despliegue del modal interactivo de recuperación de contraseña', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.openForgotPasswordModal();

    await expect(loginPage.swalModal).toBeVisible();
    await expect(loginPage.swalInput).toBeVisible();
    await expect(loginPage.swalConfirmButton).toBeVisible();
  });
});
