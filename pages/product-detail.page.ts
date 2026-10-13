import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly price: Locator;
  readonly incrementBtn: Locator;
  readonly decrementBtn: Locator;
  readonly quantityDisplay: Locator;
  readonly addToCartBtn: Locator;
  readonly addToFavoritesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('main h1');
    this.price = page.locator('main p:has-text("$")').first();
    this.incrementBtn = page.locator('[data-at="increment-quantity"]');
    this.decrementBtn = page.locator('[data-at="decrement-quantity"]');
    this.quantityDisplay = this.incrementBtn.locator('..').locator('div, span, p').nth(0);
    this.addToCartBtn = page.locator('[data-at="add-to-cart"]');
    this.addToFavoritesBtn = page.locator('[data-at="add-to-favorites"]');
  }

  async goto(productSlug: string) {
    await this.page.goto(`/products/${productSlug}`);
  }

  async increaseQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {
      await this.incrementBtn.click();
    }
  }

  async decreaseQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {
      await this.decrementBtn.click();
    }
  }

  async addToCart() {
    await this.addToCartBtn.click();
  }

  async addToFavorites() {
    await this.addToFavoritesBtn.click();
  }
}
