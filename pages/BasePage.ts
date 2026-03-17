import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping_cart_badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' }); //might fail due to name, test pending
    this.logoutLink = page.getByTestId('logout_sidebar_link');
    this.allItemsLink = page.getByTestId('inventory_sidebar_link');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartBadge.click();
  }
}