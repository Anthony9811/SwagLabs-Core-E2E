import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CartPage extends BasePage {
  private readonly cartItem;
  private readonly checkoutButton;

  constructor(page: Page) {
    super(page);
    this.cartItem = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async goToCheckout() {
    this.checkoutButton.click();
  }

  get cartItems() {
    return this.cartItem;
  }

  async isItemInCart(productName: string): Promise<boolean> {
    const item = this.cartItems.filter({ hasText: productName });
    return await item.isVisible();
  }
}