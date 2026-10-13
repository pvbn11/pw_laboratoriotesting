import { Page, Locator } from '@playwright/test';

export class FavoritesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly totalAgregadosText: Locator;
  readonly favoriteCards: Locator;
  readonly emptyStateText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Favoritos' });
    this.totalAgregadosText = page.locator('p:has-text("Total agregados")');
    this.favoriteCards = page.locator('main a[href^="/products/"]');
    this.emptyStateText = page.getByText('No has agregado ningún favorito');
  }

  async goto() {
    // Note: URL includes typo from frontend routing '/whishlist'
    await this.page.goto('/whishlist');
  }

  async getFavoriteProductLink(productSlug: string) {
    return this.page.locator(`main a[href="/products/${productSlug}"]`);
  }
}
