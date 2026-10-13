import { Page, Locator } from '@playwright/test';

export class CartDrawerPage {
  readonly page: Page;
  readonly cartOpenerDesktop: Locator;
  readonly drawer: Locator;
  readonly closeBtn: Locator;
  readonly cartItems: Locator;
  readonly totalText: Locator;
  readonly checkoutBtn: Locator;
  readonly clearBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartOpenerDesktop = page.locator('[data-at="cart-opener"]');
    this.drawer = page.locator('aside, [role="complementary"]');
    this.closeBtn = this.drawer.locator('button').first();
    this.cartItems = this.drawer.locator('div.grid, div:has(> img)');
    this.totalText = this.drawer.locator('p:has-text("Total:")');
    this.checkoutBtn = this.drawer.getByRole('button', { name: 'Ir al checkout' });
    this.clearBtn = this.drawer.getByRole('button', { name: 'Limpiar' });
  }

  async openCart() {
    await this.cartOpenerDesktop.click();
    await this.drawer.waitFor({ state: 'visible' });
  }

  async proceedToCheckout() {
    await this.checkoutBtn.click();
    await this.page.waitForURL('**/checkout');
  }

  async clearCart() {
    await this.clearBtn.click();
  }
}
