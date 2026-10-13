import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordButton: Locator;
  readonly signupLink: Locator;
  readonly togglePasswordButton: Locator;
  readonly swalModal: Locator;
  readonly swalInput: Locator;
  readonly swalConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[placeholder="Ingresa tu email"]');
    this.passwordInput = page.locator('input[placeholder="Ingresa tu contraseña"]');
    this.loginButton = page.getByRole('button', { name: 'Iniciar Sesión' });
    this.forgotPasswordButton = page.getByRole('button', { name: '¿Olvidaste tu contraseña?' });
    this.signupLink = page.getByRole('link', { name: '¿No tienes una cuenta? Crea una' });
    this.togglePasswordButton = page.locator('button:has(img[alt="toggle-password"]), button:has(img)').first();
    this.swalModal = page.locator('.swal2-popup, [role="dialog"]');
    this.swalInput = page.locator('#swal2-input');
    this.swalConfirmButton = page.getByRole('button', { name: 'Recuperar contraseña' });
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submitLogin() {
    await this.loginButton.click();
  }

  async login(email: string, pass: string) {
    await this.fillEmail(email);
    await this.fillPassword(pass);
    await this.submitLogin();
    await this.page.waitForURL('**/');
  }

  async openForgotPasswordModal() {
    await this.forgotPasswordButton.click();
    await expect(this.swalModal).toBeVisible();
  }
}
