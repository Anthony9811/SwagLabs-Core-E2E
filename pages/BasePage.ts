import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly cartButton;
  readonly cartBadge;
  readonly menuButton;
  readonly logoutLink;
  readonly allItemsLink;
  readonly closeMenuButton;
  private readonly resetAppStateLink;
  private readonly backToProductsButton; 


  constructor(page: Page) {
    this.page = page; 
    this.cartButton = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.backToProductsButton = page.getByTestId('back-to-products');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartButton.click();
  }

  async resetAppState() {
    await this.menuButton.click();
    await this.resetAppStateLink.click();
  }

  async backToProducts() {
    await this.backToProductsButton.click();
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  /**
   * 
   * @param socialNetwork - Expects 'twitter', 'facebook', or 'linkedin' to match data-test IDs.
   */
  async goToSocials(socialNetwork: string) {
    await this.page.getByTestId(`social-${socialNetwork}`).click();
  }
}