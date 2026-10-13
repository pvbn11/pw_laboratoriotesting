import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly lastnameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;

  readonly nameHolderInput: Locator;
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly securityCodeInput: Locator;

  readonly completePaymentButton: Locator;
  readonly swalModal: Locator;
  readonly swalTitle: Locator;
  readonly swalRetryButton: Locator;
  readonly swalGoToAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.lastnameInput = page.locator('input[name="lastname"]');
    this.emailInput = page.locator('input[name="email"]');
    this.addressInput = page.locator('input[name="address"]');
    this.countrySelect = page.locator('select[name="country"]');

    this.nameHolderInput = page.locator('input[name="nameHolder"]');
    this.cardNumberInput = page.locator('input[name="cardNumber"]');
    this.expiryDateInput = page.locator('input[name="expiryDate"]');
    this.securityCodeInput = page.locator('input[name="securityCode"]');

    this.completePaymentButton = page.getByRole('button', { name: 'Completar Pago' });
    this.swalModal = page.locator('.swal2-popup, [role="dialog"]');
    this.swalTitle = page.locator('.swal2-title, [role="dialog"] h2');
    this.swalRetryButton = page.getByRole('button', { name: 'Reintentar' });
    this.swalGoToAccountButton = page.getByRole('button', { name: 'Ir a mi cuenta' });
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async fillBuyerInfo(data: {
    name: string;
    lastname: string;
    email: string;
    address: string;
    country: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.lastnameInput.fill(data.lastname);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.countrySelect.selectOption(data.country);
  }

  async fillPaymentInfo(data: {
    nameHolder: string;
    cardNumber: string;
    expiryDate: string; // YYYY-MM
    securityCode: string;
  }) {
    await this.nameHolderInput.fill(data.nameHolder);
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryDateInput.fill(data.expiryDate);
    await this.securityCodeInput.fill(data.securityCode);
  }

  async submitPayment() {
    await this.completePaymentButton.click();
  }

  /**
   * Mocks the backend orders endpoint to return a 201 Created / 200 OK
   * allowing deterministic testing of successful purchases.
   */
  async mockOrderSuccess() {
    await this.page.route('**/api/v1/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Orden creada exitosamente',
          orderId: 'ORDER-TEST-12345',
          status: 'SUCCESS'
        }),
      });
    });
  }
}
