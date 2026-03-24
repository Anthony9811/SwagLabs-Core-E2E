import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class CartPage extends BasePage {
  private readonly cartItem;

  constructor(page:Page) {
    super(page);
    this.cartItem = page.getByTestId('inventory-item');
  }

  get cartItems() {
    return this.cartItem;
}

async isItemInCart(productName: string): Promise<boolean> {
    const item = this.cartItems.filter({ hasText: productName });
    return await item.isVisible();
}
}