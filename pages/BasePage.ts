import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartBadge.click();
  }
}