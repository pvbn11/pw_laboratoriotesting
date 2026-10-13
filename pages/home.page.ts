import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly brandLogo: Locator;
  readonly navInicio: Locator;
  readonly navFavoritos: Locator;
  readonly navMiCuenta: Locator;
  readonly navCerrarSesion: Locator;
  readonly cartOpenerDesktop: Locator;
  readonly cartBadge: Locator;
  readonly featuredProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLogo = page.getByRole('navigation').getByRole('link', { name: 'Laboratorio De Testing' });
    this.navInicio = page.getByRole('link', { name: 'Inicio' });
    this.navFavoritos = page.getByRole('link', { name: 'Favoritos' });
    this.navMiCuenta = page.getByRole('link', { name: 'Mi Cuenta' });
    this.navCerrarSesion = page.getByRole('link', { name: 'Cerrar Sesión' });
    this.cartOpenerDesktop = page.locator('[data-at="cart-opener"]');
    this.cartBadge = this.cartOpenerDesktop.locator('p, span').or(page.locator('[data-at="cart-opener"]'));
    this.featuredProducts = page.locator('article');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openProductDetail(productName: string) {
    await this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first().click();
  }

  async openCart() {
    await this.cartOpenerDesktop.click();
  }
}
