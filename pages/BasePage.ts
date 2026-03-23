import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly cartBadge;
  readonly menuButton;
  readonly logoutLink;
  readonly allItemsLink;
  readonly cartBadgeNumber;
  private readonly resetAppStateLink;
  private readonly backToProductsButton; 


  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.cartBadgeNumber = page.getByTestId('shopping-cart-badge');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartBadge.click();
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetAppStateLink.click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * 
   * @param socialNetwork - Expects 'twitter', 'facebook', or 'linkedin' to match data-test IDs.
   */
  async goToSocials(socialNetwork: string) {
    await this.page.getByTestId(`social-${socialNetwork}`).click();
  }
}